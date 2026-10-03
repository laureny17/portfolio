"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import type { GuestStar } from "@/app/api/stars/route";
import { STAR_PALETTE } from "@/data/star-palette";
import { ding } from "@/utils/ding";
import { hop, makeBody, RADIUS, step, type Body, type Walls } from "@/utils/star-physics";
import { STAR_PATH, STAR_VIEWBOX, WatercolorFilter } from "./watercolor-star";

const STAR_SIZE = 22;
const DEFAULT_COLOR = 4; // the site's blue
const MAX_SHOWN = 120; // keeps the pile from climbing out of the field
const RAIN_INTERVAL_MS = 45; // stagger when saved stars pour in on load

const FIELD_HEIGHT = 240; // blank space the stars fall into

type Shown = { id: string; c: number };

// Invisible walls: the field's own edges
const wallsFor = (width: number): Walls => ({ left: 0, right: width, bottom: FIELD_HEIGHT });

/** One painted star; the filter comes from the shared defs in <GuestStars>. */
function PaintedStar({ c, size = STAR_SIZE }: { c: number; size?: number }) {
  const { color } = STAR_PALETTE[c];
  return (
    <svg
      viewBox={STAR_VIEWBOX}
      width={size}
      height={size}
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

// Custom cursor: a tiny flat star in the selected color
const cursorFor = (c: number) => {
  const { color } = STAR_PALETTE[c];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="${STAR_VIEWBOX}"><path d="${STAR_PATH}" fill="${color}" stroke="${color}" stroke-width="40" stroke-linejoin="round"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 10 10, crosshair`;
};

export default function GuestStars() {
  const [shown, setShown] = useState<Shown[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(DEFAULT_COLOR);
  const [boing, setBoing] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");
  const [fieldWidth, setFieldWidth] = useState(0);

  const fieldRef = useRef<HTMLDivElement>(null);
  const bodies = useRef<Body[]>([]);
  const elements = useRef(new Map<string, HTMLElement>());
  const wallsRef = useRef<Walls | null>(null);
  const frame = useRef(0);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reducedMotion = useRef(false);

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

  const wake = useCallback(() => {
    if (frame.current) return;
    let restFrames = 0;
    const tick = () => {
      const walls = wallsRef.current;
      if (!walls) {
        frame.current = 0;
        return;
      }
      const moving = step(bodies.current, walls);
      draw();
      restFrames = moving ? 0 : restFrames + 1;
      frame.current = restFrames > 30 ? 0 : requestAnimationFrame(tick);
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

  /** Add a star at the top of the field (x as a fraction across) and let it fall. */
  const spawn = useCallback(
    (id: string, c: number, xFraction: number) => {
      const width = fieldRef.current?.clientWidth;
      if (!width) return;
      // Sizes vary ±12%, seeded by id so a star keeps its size across visits
      let h = 0;
      for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
      const r = RADIUS * (0.88 + ((h % 1000) / 1000) * 0.24);
      const x = r + (width - r * 2) * Math.min(1, Math.max(0, xFraction));
      bodies.current.push(makeBody(id, x, r, Math.random() * Math.PI * 2, r));
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
      .then((res) => res.json())
      .then((data: { stars: GuestStar[] }) => {
        setTotal(data.stars.length);
        const toPour = data.stars.slice(0, MAX_SHOWN).reverse(); // oldest first
        const el = fieldRef.current;
        if (!el || toPour.length === 0) return;
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            toPour.forEach((s, i) =>
              timers.current.push(
                setTimeout(() => spawn(s.id, s.c, s.x), reducedMotion.current ? 0 : i * RAIN_INTERVAL_MS)
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

  // ---- interactions ----

  const flash = (message: string) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3000);
  };

  const place = useCallback(
    async (xFraction: number) => {
      const c = selected;
      const tempId = `local-${crypto.randomUUID()}`;
      spawn(tempId, c, xFraction);
      setTotal((n) => n + 1);
      ding(STAR_PALETTE[c].freq);

      const undo = () => {
        bodies.current = bodies.current.filter((b) => b.id !== tempId);
        elements.current.delete(tempId);
        setShown((s) => s.filter((st) => st.id !== tempId));
        setTotal((n) => n - 1);
        wake();
      };

      try {
        const res = await fetch("/api/stars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ x: xFraction, y: 0, c }),
        });
        if (res.status === 201) return;
        if (res.status === 503) {
          flash("stars aren't saving yet, so this one's just for you");
          return;
        }
        undo();
        flash(res.status === 429 ? "slow down a little ✦" : "that star didn't stick, try again?");
      } catch {
        undo();
        flash("that star didn't stick, try again?");
      }
    },
    [selected, spawn, wake]
  );

  // Stars fall from the top of the field, above wherever you click
  const onFieldClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    place((e.clientX - rect.left) / rect.width);
  };

  const onFieldKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      place(Math.random());
    }
  };

  const onStarClick = (e: MouseEvent<HTMLButtonElement>, star: Shown) => {
    e.stopPropagation();
    ding(STAR_PALETTE[star.c].freq);
    const body = bodies.current.find((b) => b.id === star.id);
    if (body) {
      hop(body);
      wake();
    }
    setBoing((p) => ({ ...p, [star.id]: (p[star.id] ?? 0) + 1 }));
  };

  const choose = (c: number) => {
    setSelected(c);
    ding(STAR_PALETTE[c].freq);
  };

  return (
    <div className="flex flex-col gap-3">
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          {/* One watercolor filter per color, shared by every star */}
          {STAR_PALETTE.map((p, i) => (
            <WatercolorFilter key={p.name} id={`guest-star-${i}`} seed={3 + i} edgeColor={p.edge} />
          ))}
        </defs>
      </svg>

      <div className="flex items-end justify-between gap-4">
        <p className="muted">pick a note, then click below to drop a star.</p>
        <div role="radiogroup" aria-label="star color and note" className="flex gap-1.5 shrink-0">
          {STAR_PALETTE.map((p, i) => (
            <button
              key={p.name}
              type="button"
              role="radio"
              aria-checked={selected === i}
              aria-label={`${p.name}, note ${p.note}`}
              onClick={() => choose(i)}
              className="group flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span
                className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5"
                style={{ transform: selected === i ? "scale(1.25)" : undefined }}
              >
                <PaintedStar c={i} size={16} />
              </span>
              <span
                className="text-[11px] leading-none transition-colors"
                style={{ color: selected === i ? "var(--ink)" : "var(--faint)" }}
              >
                {p.note}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={fieldRef}
        role="button"
        tabIndex={0}
        aria-label="drop a star (Enter drops one at random)"
        onClick={onFieldClick}
        onKeyDown={onFieldKey}
        className="relative select-none"
        style={{ height: FIELD_HEIGHT, cursor: cursorFor(selected) }}
      >
        {loaded && total === 0 && (
          <p className="page-in absolute inset-0 flex items-center justify-center muted pointer-events-none">
            no stars yet. be the first?
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
            onClick={(e) => onStarClick(e, star)}
            className="guest-star"
          >
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
          </button>
        ))}
      </div>

      <p className="flex justify-between text-[13px] muted min-h-[1.6em]">
        <span>{total > 0 && `${total} star${total === 1 ? "" : "s"}`}</span>
        <span key={notice} className="page-in">
          {notice}
        </span>
      </p>
    </div>
  );
}
