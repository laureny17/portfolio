// Guest stars: GET the latest ones, POST to leave one.
//
// Stored in Upstash Redis (Vercel Marketplace). Reads either env var naming the
// integration uses. Without them, GET returns { enabled: false } and POST 503s.
// To clear stars, delete the "stars" key from the Upstash console.
//
// Each visitor can drop one star of each color per browser session, tracked by
// an anonymous session cookie (cleared when the browser closes).
//
// Keeping Redis usage low (free tier: 500k commands/month):
// - GET is the same for everyone, so it's cached at the CDN; bots refreshing
//   the page mostly hit the cache, and a miss costs 1 command
// - POST is rate limited per IP; blocked IPs are remembered in memory, so
//   repeat offenders cost nothing
// - if Redis errors (down, or over quota) both routes answer 503 instead of
//   throwing, and the client stops retrying
//
// The jar holds at most the newest 150 stars from the last 30 days. The list is
// newest-first (LPUSH), so expired stars are always a run at the end; reads
// cut that tail off (1 extra command, only when something actually expired).

import { Ratelimit } from "@upstash/ratelimit";
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
const MAX_STARS = 150; // newest 150 are kept; each new star pushes out the oldest
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // stars expire after 30 days
const SESSION_COOKIE = "star_session";
const USED_TTL_SECONDS = 60 * 60 * 24; // bookkeeping cleanup; the cookie itself ends with the session

const usedKey = (session: string, c: number) => `stars:used:${session}:${c}`;

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

// Anti-spam only: a real visitor drops at most 7 (one per color), so this is
// generous enough for many people sharing one IP (e.g. campus wifi)
let limiter: Ratelimit | null = null;
const getLimiter = (redis: Redis) =>
  (limiter ??= new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(30, "60 s"), // 2 commands per check (sliding window is 4–5)
    prefix: "stars:ratelimit",
  }));

const unavailable = () =>
  Response.json({ error: "stars are resting right now" }, { status: 503 });

/**
 * Stars from the last 30 days, newest first. Deletes expired ones from the
 * end of the list. Trimming from the tail (negative LTRIM index) is safe even
 * if a new star is pushed onto the head at the same moment.
 */
async function freshStars(redis: Redis) {
  const all = await redis.lrange<GuestStar>(KEY, 0, -1);
  const cutoff = Date.now() - MAX_AGE_MS;
  let expired = 0;
  while (expired < all.length && Number(all[all.length - 1 - expired].t) < cutoff) expired++;
  if (expired > 0) await redis.ltrim(KEY, 0, -(expired + 1)); // all expired -> list removed
  return all.slice(0, all.length - expired).slice(0, MAX_STARS);
}

export async function GET() {
  const redis = getRedis();
  if (!redis) return Response.json({ enabled: false, stars: [] });

  try {
    const stars = await freshStars(redis);
    return Response.json(
      { enabled: true, stars },
      // Same for everyone: let the CDN serve it, refreshing every 15s
      { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60" } }
    );
  } catch (error) {
    console.error(error);
    return unavailable();
  }
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

  try {
    // Rate limit per IP so a script can't fill the jar
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success, reset } = await getLimiter(redis).limit(ip);
    if (!success) {
      // Tell the client when to retry; it keeps the star and resends then
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return Response.json(
        { error: "slow down a little" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

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
  } catch (error) {
    console.error(error);
    return unavailable();
  }
}
