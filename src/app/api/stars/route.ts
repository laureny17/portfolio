// Guest stars: GET the latest ones, POST to leave one.
//
// Stored in Upstash Redis (Vercel Marketplace). Reads either env var naming the
// integration uses. Without them, GET returns { enabled: false } and POST 503s.
// To clear stars, delete the "stars" key from the Upstash console.
//
// Each visitor can drop one star of each color per browser session, tracked by
// an anonymous session cookie (cleared when the browser closes).

import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { STAR_PALETTE } from "@/data/star-palette";

export const dynamic = "force-dynamic";

export type GuestStar = {
  id: string;
  x: number; // 0..1 across the field
  y: number; // 0..1 down the field
  c: number; // index into STAR_PALETTE
  t: number; // ms timestamp
};

const KEY = "stars";
const MAX_STARS = 300; // older stars fall off
const COOLDOWN_SECONDS = 2; // per IP, between stars
const SESSION_COOKIE = "star_session";
const USED_TTL_SECONDS = 60 * 60 * 24; // bookkeeping cleanup; the cookie itself ends with the session

const usedKey = (session: string, c: number) => `stars:used:${session}:${c}`;

/** Colors this session has already dropped. */
async function usedColors(redis: Redis, session: string | undefined) {
  if (!session) return [];
  const flags = await redis.mget<(number | null)[]>(
    ...STAR_PALETTE.map((_, c) => usedKey(session, c))
  );
  return flags.flatMap((flag, c) => (flag ? [c] : []));
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

export async function GET() {
  const redis = getRedis();
  if (!redis) return Response.json({ enabled: false, stars: [] });

  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  const [stars, used] = await Promise.all([
    redis.lrange<GuestStar>(KEY, 0, MAX_STARS - 1),
    usedColors(redis, session),
  ]);
  // Per-visitor (used colors), so no shared caching
  return Response.json({ enabled: true, stars, used }, { headers: { "Cache-Control": "private, no-store" } });
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) return Response.json({ error: "stars aren't set up yet" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const { x, y, c } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isInteger(c) ||
    (c as number) < 0 ||
    (c as number) >= STAR_PALETTE.length
  ) {
    return Response.json({ error: "bad star" }, { status: 400 });
  }

  // Light rate limit per visitor so nobody fills the sky in one go
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const allowed = await redis.set(`stars:cooldown:${ip}`, 1, { nx: true, ex: COOLDOWN_SECONDS });
  if (!allowed) return Response.json({ error: "slow down a little" }, { status: 429 });

  // One of each color per session
  const jar = await cookies();
  let session = jar.get(SESSION_COOKIE)?.value;
  if (!session) {
    session = crypto.randomUUID();
    // No maxAge/expires: a session cookie, gone when the browser closes
    jar.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  const fresh = await redis.set(usedKey(session, c as number), 1, { nx: true, ex: USED_TTL_SECONDS });
  if (!fresh) return Response.json({ error: "already dropped that color" }, { status: 409 });

  const star: GuestStar = {
    id: crypto.randomUUID(),
    x: clamp(x, 0, 1),
    y: clamp(y, 0, 1),
    c: c as number,
    t: Date.now(),
  };
  await redis.lpush(KEY, star);
  await redis.ltrim(KEY, 0, MAX_STARS - 1);

  return Response.json({ star }, { status: 201 });
}
