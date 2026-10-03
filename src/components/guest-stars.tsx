"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import type { GuestStar } from "@/app/api/stars/route";
import { STAR_PALETTE } from "@/data/star-palette";
import { allowSound, ding, dingSequence, heardTime, prepareAudio } from "@/utils/ding";
import {
  advance,
  clearSpawnY,
  hop,
  makeBody,
  RADIUS,
  startClock,
  step,
  type Body,
  type Walls,
} from "@/utils/star-physics";
import { STAR_PATH, STAR_VIEWBOX, WatercolorFilter } from "./watercolor-star";

const STAR_SIZE = 22;
const MAX_SHOWN = 150; // all the server keeps; fits the field even on phones
const POUR_MAX_MS = 1500; // saved stars always finish pouring in within ~this long
const FIELD_HEIGHT = 240; // blank space the stars fall into
const DRAG_THRESHOLD = 4; // px of movement before a press becomes a drag
const DROP_SLOP = 24; // px above the field that still counts as dropping into it
const MAX_THROW = 6; // px per physics substep
const TUNE_LENGTH = 10; // notes in "play a tune"
const TUNE_BEAT_MS = 240;
const SAVE_ATTEMPTS = 5;
const MAX_ACTIVE_MS = 8000; // physics stops this long after the last drop/tap at most

// sessionStorage key: colors used this session, so the palette remembers across
// reloads (the server enforces the limit too, with a session cookie)
const USED_STORAGE_KEY = "stars-used";

type Shown = { id: string; c: number };

type Drag = {
  c: number;
  originX: number; // where the palette star sits, to fly back to
  originY: number;
  started: boolean;
  samples: { x: number; y: number; t: number }[]; // recent pointer positions, for throw speed
};

// Invisible walls: the field's own edges
const wallsFor = (width: number): Walls => ({ left: 0, right: width, bottom: FIELD_HEIGHT });

// Sizes vary ±12%, seeded by id so a star keeps its size across visits
function radiusFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return RADIUS * (0.88 + ((h % 1000) / 1000) * 0.24);
}

function readUsed(): number[] {
  try {
    return JSON.parse(sessionStorage.getItem(USED_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeUsed(used: Set<number>) {
  try {
    sessionStorage.setItem(USED_STORAGE_KEY, JSON.stringify([...used]));
  } catch {
    // storage unavailable (private mode etc.); the server still enforces it
  }
}

// Temporary id for a just-dropped star. Not crypto.randomUUID(): browsers only
// expose it on HTTPS/localhost, so it breaks on a phone viewing the dev server
// over the LAN (and on iOS before 15.4).
const localId = () => `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * When each saved star gets tossed in on load: one continuous pour that starts
 * gently, flows faster in the middle, and eases off at the end (like tipping a
 * cup), with a little jitter so it never ticks like a metronome.
 */
function pourSchedule(count: number): number[] {
  if (count <= 1) return [0];
  const total = Math.min(POUR_MAX_MS, count * 40);
  const step = total / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const eased = (1 - Math.cos((Math.PI * i) / (count - 1))) / 2; // ease-in-out
    return Math.max(0, eased * total + (Math.random() - 0.5) * step * 0.6);
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * POST a star, retrying through rate limits and flaky connections.
 * Resolves to what happened; only "failed"/"duplicate" should remove the star.
 */
async function saveStar(star: { x: number; y: number; c: number }) {
  for (let attempt = 0; attempt < SAVE_ATTEMPTS; attempt++) {
    try {
      const res = await fetch("/api/stars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(star),
      });
      if (res.status === 201) return "saved";
      if (res.status === 503) return "disabled";
      if (res.status === 409) return "duplicate";
      if (res.status === 429) {
        const wait = Number(res.headers.get("Retry-After")) || 2;
        await sleep(wait * 1000);
        continue;
      }
      if (res.status < 500) return "failed"; // bad request; retrying won't help
    } catch {
      // network hiccup: fall through to backoff
    }
    await sleep(1000 * 2 ** attempt);
  }
  return "failed";
}

/** One painted star; the filter comes from the shared defs in <GuestStars>. */
function PaintedStar({ c, size = STAR_SIZE }: { c: number; size?: number | string }) {
  const { color } = STAR_PALETTE[c];
  return (
    <svg
      viewBox={STAR_VIEWBOX}
      width={size}
      height={size}
      className="block"
      style={{ overflow: "visible" }}
      aria-hidden="true"
      focusable="false"
    >
      <g filter={`url(#guest-star-${c})`}>
        <path d={STAR_PATH} fill={color} stroke={color} strokeWidth={40} strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function GuestStars() {
  const [shown, setShown] = useState<Shown[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [used, setUsed] = useState<Set<number>>(new Set());
  const [dragging, setDragging] = useState<number | null>(null); // color being dragged
  const [boing, setBoing] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");
  const [fieldWidth, setFieldWidth] = useState(0);

  const fieldRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const bodies = useRef<Body[]>([]);
  const elements = useRef(new Map<string, HTMLElement>());
  const wallsRef = useRef<Walls | null>(null);
  const frame = useRef(0);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reducedMotion = useRef(false);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  wallsRef.current = fieldWidth ? wallsFor(fieldWidth) : null;

  // ---- simulation loop: runs only while something is moving ----

  const transformFor = (b: Body) => {
    const half = STAR_SIZE / 2;
    return `translate3d(${b.x - half}px, ${b.y - half}px, 0) rotate(${b.angle}rad) scale(${b.r / RADIUS})`;
  };

  const draw = useCallback(() => {
    for (const b of bodies.current) {
      const el = elements.current.get(b.id);
      if (el) el.style.transform = transformFor(b);
    }
  }, []);

  // Each wake keeps the loop alive for a while; it also stops early once still.
  // The cap is a safety net: a star wedged in a tall pile can jitter forever
  // at sub-pixel scale, and that shouldn't keep a phone busy.
  const activeUntil = useRef(0);

  const wake = useCallback(() => {
    activeUntil.current = performance.now() + MAX_ACTIVE_MS;
    if (frame.current) return;
    const clock = startClock(performance.now());
    const tick = (now: number) => {
      const walls = wallsRef.current;
      if (!walls) {
        frame.current = 0;
        return;
      }
      // Real-time steps, so it looks the same at 60Hz and on 120Hz phones
      if (advance(bodies.current, walls, clock, now) > 0) draw();
      const done = clock.restSteps > 30 || now > activeUntil.current;
      frame.current = done ? 0 : requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Settle instantly (no animation) for reduced-motion visitors
  const settleNow = useCallback(() => {
    const walls = wallsRef.current;
    if (!walls) return;
    for (let i = 0; i < 600 && step(bodies.current, walls); i++);
    draw();
  }, [draw]);

  // ---- layout ----

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setUsed(new Set(readUsed()));
    const el = fieldRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setFieldWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Walls moved (resize): let everything re-settle
  useEffect(() => {
    if (fieldWidth) wake();
  }, [fieldWidth, wake]);

  // ---- spawning ----

  /** Add a star at (x, y) px in the field, optionally thrown, and let it fall. */
  const spawn = useCallback(
    (id: string, c: number, x: number, y: number, vx = 0, vy = 0) => {
      const width = fieldRef.current?.clientWidth;
      if (!width) return;
      const r = radiusFor(id);
      const sx = Math.min(width - r, Math.max(r, x));
      // Never start overlapping another star (the push-apart would launch it)
      const sy = clearSpawnY(bodies.current, sx, Math.min(FIELD_HEIGHT - r, Math.max(r, y)), r);
      const body = makeBody(id, sx, sy, Math.random() * Math.PI * 2, r);
      body.px = body.x - vx;
      body.py = body.y - vy;
      bodies.current.push(body);
      // Oldest stars drop out once there are too many to show
      if (bodies.current.length > MAX_SHOWN) {
        const removed = bodies.current.shift()!;
        elements.current.delete(removed.id);
      }
      setShown((s) => [...s, { id, c }].slice(-MAX_SHOWN));
      if (reducedMotion.current) requestAnimationFrame(settleNow);
      else wake();
    },
    [wake, settleNow]
  );

  // Load saved stars, then pour them in once the field scrolls into view (once)
  const started = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ready = fieldWidth > 0;

  useEffect(() => {
    if (!ready || started.current) return;
    started.current = true;

    fetch("/api/stars")
      .then((res) => (res.ok ? res.json() : { stars: [] }))
      .then((data: { stars: GuestStar[] }) => {
        setTotal(data.stars.length);
        const toPour = data.stars.slice(0, MAX_SHOWN).reverse(); // oldest first
        const el = fieldRef.current;
        if (!el || toPour.length === 0) return;
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            const width = el.clientWidth;
            const times = pourSchedule(toPour.length);
            toPour.forEach((s, i) =>
              timers.current.push(
                setTimeout(
                  // Tossed in: a small random sideways + upward start velocity,
                  // then ordinary gravity and collisions take over
                  () =>
                    spawn(
                      s.id,
                      s.c,
                      s.x * width,
                      RADIUS,
                      (Math.random() - 0.5) * 2.4,
                      -(0.5 + Math.random() * 1.2)
                    ),
                  reducedMotion.current ? 0 : times[i]
                )
              )
            );
          },
          { threshold: 0.35 }
        );
        io.observe(el);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [ready, spawn]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // ---- dropping a star ----

  const flash = (message: string) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3500);
  };

  const markUsed = (c: number, isUsed: boolean) =>
    setUsed((prev) => {
      const next = new Set(prev);
      if (isUsed) next.add(c);
      else next.delete(c);
      writeUsed(next);
      return next;
    });

  const drop = useCallback(
    async (c: number, x: number, y: number, vx = 0, vy = 0) => {
      const width = fieldRef.current?.clientWidth;
      if (!width) return;
      const tempId = localId();
      spawn(tempId, c, x, y, vx, vy);
      setTotal((n) => n + 1);
      markUsed(c, true);
      ding(STAR_PALETTE[c].freq);

      const undo = () => {
        bodies.current = bodies.current.filter((b) => b.id !== tempId);
        elements.current.delete(tempId);
        setShown((s) => s.filter((st) => st.id !== tempId));
        setTotal((n) => n - 1);
        wake();
      };

      // Saves go out one at a time in the background; the star is already in
      // the jar, so being "too fast" just means waiting and retrying
      saveQueue.current = saveQueue.current.then(async () => {
        const result = await saveStar({ x: x / width, y: y / FIELD_HEIGHT, c });
        if (result === "saved") return;
        if (result === "disabled") {
          flash("Stars aren't saving right now, so this one's just for you");
          return;
        }
        undo();
        if (result === "duplicate") {
          flash(`You've already left a ${STAR_PALETTE[c].name} star`);
          return; // stays marked used
        }
        markUsed(c, false);
        flash("That star didn't stick, try again?");
      });
    },
    [spawn, wake]
  );

  // ---- drag and drop from the palette ----

  const moveGhost = (x: number, y: number, scale = 1.2) => {
    const el = ghostRef.current;
    if (el) el.style.transform = `translate3d(${x - STAR_SIZE / 2}px, ${y - STAR_SIZE / 2}px, 0) scale(${scale})`;
  };

  const onPalettePointerDown = (e: PointerEvent<HTMLButtonElement>, c: number) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = {
      c,
      originX: rect.left + rect.width / 2,
      originY: rect.top + 8,
      started: false,
      samples: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }],
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPalettePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.started) {
      const first = d.samples[0];
      if (Math.hypot(e.clientX - first.x, e.clientY - first.y) < DRAG_THRESHOLD) return;
      if (used.has(d.c)) return; // used colors can't be dragged out
      d.started = true;
      setDragging(d.c);
    }
    d.samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
    if (d.samples.length > 5) d.samples.shift();
    moveGhost(e.clientX, e.clientY);
  };

  const onPalettePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    allowSound();

    // A press without a drag: just preview the note
    if (!d.started) {
      ding(STAR_PALETTE[d.c].freq);
      if (used.has(d.c)) flash(`You've already left a ${STAR_PALETTE[d.c].name} star`);
      return;
    }

    const field = fieldRef.current?.getBoundingClientRect();
    const inField =
      field &&
      e.clientX >= field.left &&
      e.clientX <= field.right &&
      e.clientY >= field.top - DROP_SLOP &&
      e.clientY <= field.bottom;

    if (field && inField) {
      // Throw speed from the last few pointer samples (px/ms → px per physics substep)
      const first = d.samples[0];
      const dt = Math.max(1, e.timeStamp - first.t);
      const perSubstep = 1000 / 60 / 2;
      const clamp = (v: number) => Math.max(-MAX_THROW, Math.min(MAX_THROW, v));
      const vx = clamp(((e.clientX - first.x) / dt) * perSubstep * 0.5);
      const vy = clamp(((e.clientY - first.y) / dt) * perSubstep * 0.5);
      setDragging(null);
      drop(d.c, e.clientX - field.left, e.clientY - field.top, vx, vy);
      return;
    }

    // Dropped outside: float back to the palette and fade
    const el = ghostRef.current;
    if (el) {
      el.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease";
      moveGhost(d.originX, d.originY, 0.8);
      el.style.opacity = "0";
      setTimeout(() => setDragging(null), 450);
    } else {
      setDragging(null);
    }
  };

  const onPaletteKey = (e: KeyboardEvent<HTMLButtonElement>, c: number) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    allowSound();
    if (used.has(c)) {
      ding(STAR_PALETTE[c].freq);
      flash(`You've already left a ${STAR_PALETTE[c].name} star`);
      return;
    }
    const width = fieldRef.current?.clientWidth ?? 0;
    drop(c, width * (0.1 + Math.random() * 0.8), RADIUS);
  };

  // ---- tapping stars in the field ----

  /** Ding, hop, and glow, as if the star was tapped. */
  /** Hop and glow, as if the star was tapped (no sound). */
  const animateTap = useCallback(
    (star: Shown) => {
      const body = bodies.current.find((b) => b.id === star.id);
      if (body) {
        hop(body);
        wake();
      }
      setBoing((p) => ({ ...p, [star.id]: (p[star.id] ?? 0) + 1 }));
    },
    [wake]
  );

  /** Ding, hop, and glow. */
  const tap = useCallback(
    (star: Shown) => {
      ding(STAR_PALETTE[star.c].freq);
      animateTap(star);
    },
    [animateTap]
  );

  // ---- a little tune: up to 10 random stars, in a random order ----

  // "waiting": pressed, audio waking. "tuning": that's taking a while (over
  // 150ms), so the button says "Tuning up" and the stars about to play breathe.
  // "playing": the first note has sounded.
  const [phase, setPhase] = useState<"idle" | "waiting" | "tuning" | "playing">("idle");
  const playing = phase !== "idle";
  const [cued, setCued] = useState<ReadonlySet<string>>(new Set());
  const tuneFrame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(tuneFrame.current), []);

  const playTune = async () => {
    if (playing || shown.length === 0) return;
    const picks = [...shown]
      .sort(() => Math.random() - 0.5)
      .slice(0, TUNE_LENGTH);
    let at = 0;
    const times = picks.map((_, i) => {
      const t = at;
      // Swung rhythm (long-short), with a held note at the end of each phrase
      const beat = i % 2 === 0 ? TUNE_BEAT_MS * 1.2 : TUNE_BEAT_MS * 0.8;
      at += (i + 1) % 4 === 0 ? beat * 1.8 : beat;
      return t;
    });
    allowSound(at + 300); // the button press covers the whole tune
    setPhase("waiting");
    const slow = setTimeout(() => {
      setPhase("tuning");
      setCued(new Set(picks.map((p) => p.id)));
    }, 150);
    const startTune = () => {
      clearTimeout(slow);
      setPhase("playing");
      setCued(new Set());
    };

    // Wake the audio first, then hand every note to the audio clock at once,
    // so the tune stays evenly spaced even if the page is busy. Each hop and
    // glow waits until its note is actually coming out of the speaker (phones
    // take a while to get sound out, so a plain timer ran ahead of the notes).
    const audioReady = await prepareAudio();
    const noteTimes = audioReady
      ? dingSequence(
          picks.map((star) => STAR_PALETTE[star.c].freq),
          times
        )
      : null;

    if (!noteTimes) {
      startTune();
      picks.forEach((star, i) => timers.current.push(setTimeout(() => animateTap(star), times[i])));
      timers.current.push(setTimeout(() => setPhase("idle"), at));
      return;
    }
    const end = noteTimes[0] + at / 1000;
    const giveUp = performance.now() + at + 2000; // audio stalled (e.g. a call)
    let next = 0;
    const frame = () => {
      const heard = heardTime();
      while (next < picks.length && heard >= noteTimes[next]) {
        // Hops that come up late (frames paused, e.g. a background tab) are
        // skipped rather than all bunched together
        if (next === 0) startTune();
        if (heard - noteTimes[next] < 0.15) animateTap(picks[next]);
        next++;
      }
      if (heard < end && performance.now() < giveUp) {
        tuneFrame.current = requestAnimationFrame(frame);
      } else {
        clearTimeout(slow);
        setCued(new Set());
        setPhase("idle");
      }
    };
    tuneFrame.current = requestAnimationFrame(frame);
  };

  const allUsed = used.size >= STAR_PALETTE.length;

  return (
    // Any press in the jar starts waking the audio (silently), so a note or the
    // tune doesn't have to wait for it. Kept to the jar on purpose: on iPhones
    // waking it can pause the visitor's own music.
    <div className="flex flex-col gap-3" onPointerDownCapture={() => void prepareAudio()}>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          {/* One watercolor filter per color, shared by every star */}
          {STAR_PALETTE.map((p, i) => (
            <WatercolorFilter key={p.name} id={`guest-star-${i}`} seed={3 + i} edgeColor={p.edge} />
          ))}
        </defs>
      </svg>

      {/* Phones: description full width, bigger palette underneath, left-aligned (easier to grab) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <p key={allUsed ? "done" : "ask"} className="page-in muted">
          {allUsed
            ? "Thanks for stopping by ⋆｡°★"
            : "Stopping by? Drag a star (or two... or more?) down on your way through."}
        </p>
        <div className="flex gap-2.5 sm:gap-1.5 shrink-0 sm:mt-1.5">
          {STAR_PALETTE.map((p, i) => {
            const isUsed = used.has(i);
            const isLifted = dragging === i;
            return (
              <button
                key={p.name}
                type="button"
                aria-label={
                  isUsed
                    ? `${p.name} star, note ${p.note}, already left`
                    : `${p.name} star, note ${p.note}. Drag it below, or press Enter to drop it`
                }
                onPointerDown={(e) => onPalettePointerDown(e, i)}
                onPointerMove={onPalettePointerMove}
                onPointerUp={onPalettePointerUp}
                onPointerCancel={() => {
                  drag.current = null;
                  setDragging(null);
                }}
                onKeyDown={(e) => onPaletteKey(e, i)}
                className="group flex flex-col items-center gap-1 sm:gap-0.5 p-1 -m-1 sm:p-0 sm:m-0 touch-none select-none"
                style={{ cursor: isUsed ? "default" : isLifted ? "grabbing" : "grab" }}
              >
                <span
                  className={`block transition-[transform,opacity] duration-500 ease-[var(--ease-out)] ${
                    isUsed ? "" : "group-hover:-translate-y-0.5"
                  }`}
                  style={{ opacity: isUsed ? 0.25 : isLifted ? 0.3 : 1 }}
                >
                  <span className="block w-7 h-7 sm:w-4 sm:h-4">
                    <PaintedStar c={i} size="100%" />
                  </span>
                </span>
                <span
                  className="text-[12px] sm:text-[11px] leading-none"
                  style={{ color: isUsed ? "var(--rule)" : "var(--faint)" }}
                >
                  {p.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={fieldRef} className="relative select-none" style={{ height: FIELD_HEIGHT }}>
        {loaded && total === 0 && dragging === null && (
          <p className="page-in absolute inset-0 flex items-center justify-center muted pointer-events-none">
            No stars yet. Be the first?
          </p>
        )}

        {shown.map((star) => (
          <button
            key={star.id}
            ref={(el) => {
              if (!el) return;
              elements.current.set(star.id, el);
              // Position it before first paint, so it never flashes at a default spot
              const body = bodies.current.find((b) => b.id === star.id);
              if (body) el.style.transform = transformFor(body);
            }}
            type="button"
            aria-label={`star, note ${STAR_PALETTE[star.c].note}`}
            onClick={() => {
              allowSound();
              tap(star);
            }}
            className="guest-star"
          >
            <span className="guest-star-appear">
              <span className="guest-star-cue" data-cued={cued.has(star.id) || undefined}>
                {boing[star.id] ? (
                  <span
                    key={`glow-${boing[star.id]}`}
                    className="guest-star-glow"
                    style={{ "--glow": STAR_PALETTE[star.c].color } as CSSProperties}
                  />
                ) : null}
                <span
                  key={boing[star.id] ?? 0}
                  className={boing[star.id] ? "guest-star-pop" : "guest-star-sway"}
                  style={{ "--phase": `${-(star.id.charCodeAt(star.id.length - 1) % 9)}s` } as CSSProperties}
                >
                  <PaintedStar c={star.c} />
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* The star following the pointer while dragging. Portaled to <body>: the
          section's reveal animation leaves a filter on it, which would make
          position: fixed relative to the section instead of the viewport. */}
      {dragging !== null &&
        createPortal(
          <div
            ref={(el) => {
              ghostRef.current = el;
              const d = drag.current;
              if (el && d && !el.style.transform) {
                const last = d.samples[d.samples.length - 1];
                el.style.transform = `translate3d(${last.x - STAR_SIZE / 2}px, ${last.y - STAR_SIZE / 2}px, 0) scale(1.2)`;
              }
            }}
            aria-hidden="true"
            className="fixed left-0 top-0 z-50 pointer-events-none will-change-transform"
            style={{ width: STAR_SIZE, height: STAR_SIZE }}
          >
            <span className="guest-star-held block">
              <PaintedStar c={dragging} />
            </span>
          </div>,
          document.body
        )}

      <p className="flex justify-between text-[13px] muted min-h-[1.6em]">
        <span className="flex gap-2">
          {total > 0 && <span>{`${total} star${total === 1 ? "" : "s"}`}</span>}
          {shown.length > 1 && (
            <>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={playTune}
                onPointerDown={() => void prepareAudio()}
                disabled={playing}
                className="link link-muted cursor-pointer disabled:cursor-default"
              >
                {phase === "tuning" ? (
                  <>
                    Tuning up
                    <span className="tuning-dots" aria-hidden="true">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </>
                ) : phase === "playing" ? (
                  "Playing ♪"
                ) : (
                  "Play a tune ♪"
                )}
              </button>
            </>
          )}
        </span>
        <span key={notice} className="page-in">
          {notice}
        </span>
      </p>
    </div>
  );
}
