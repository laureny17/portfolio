"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import type { GuestStar } from "@/app/api/stars/route";
import { STAR_PALETTE } from "@/data/star-palette";
import { ding } from "@/utils/ding";
import { STAR_PATH, STAR_VIEWBOX, WatercolorFilter } from "./watercolor-star";

const STAR_SIZE = 22;
const DEFAULT_COLOR = 4; // the site's blue

type LocalStar = GuestStar & { fresh?: boolean };

// Deterministic per-star randomness, so a star drifts the same way every visit
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

function driftStyle(id: string, index: number, fresh: boolean): CSSProperties {
  const r = (n: number) => hash(id + n);
  return {
    "--r": `${Math.round(r(1) * 70 - 35)}deg`,
    "--dx": `${(1.5 + r(2) * 3).toFixed(1)}px`,
    "--dy": `${(1.5 + r(3) * 3).toFixed(1)}px`,
    "--dur": `${(8 + r(4) * 7).toFixed(1)}s`,
    "--phase": `${(-r(5) * 15).toFixed(1)}s`,
    "--enter-delay": fresh ? "0ms" : `${Math.min(index, 40) * 35 + 150}ms`,
  } as CSSProperties;
}

/** One painted star; the filter comes from the shared defs in <GuestStars>. */
function PaintedStar({ c, size = STAR_SIZE }: { c: number; size?: number }) {
  const { color } = STAR_PALETTE[c];
  return (
    <svg
      viewBox={STAR_VIEWBOX}
      width={size}
      height={size}
      style={{ mixBlendMode: "multiply", overflow: "visible" }}
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
  const [stars, setStars] = useState<LocalStar[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(DEFAULT_COLOR);
  const [pulses, setPulses] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");
  const fieldRef = useRef<HTMLDivElement>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetch("/api/stars")
      .then((res) => res.json())
      .then((data: { stars: GuestStar[] }) => setStars(data.stars))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const flash = (message: string) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3000);
  };

  const pulse = (id: string) => setPulses((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));

  const place = useCallback(
    async (x: number, y: number) => {
      const c = selected;
      const tempId = `local-${crypto.randomUUID()}`;
      const star: LocalStar = { id: tempId, x, y, c, t: Date.now(), fresh: true };
      setStars((s) => [star, ...s]);
      ding(STAR_PALETTE[c].freq);
      pulse(tempId);

      try {
        const res = await fetch("/api/stars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ x, y, c }),
        });
        if (res.status === 201) return; // keep the local copy; it has the same look
        if (res.status === 503) {
          flash("stars aren't saving yet, so this one's just for you");
          return;
        }
        setStars((s) => s.filter((st) => st.id !== tempId));
        flash(res.status === 429 ? "slow down a little ✦" : "that star didn't stick, try again?");
      } catch {
        setStars((s) => s.filter((st) => st.id !== tempId));
        flash("that star didn't stick, try again?");
      }
    },
    [selected]
  );

  const onFieldClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Keep stars a little inside the edges
    const x = Math.min(0.96, Math.max(0.04, (e.clientX - rect.left) / rect.width));
    const y = Math.min(0.9, Math.max(0.1, (e.clientY - rect.top) / rect.height));
    place(x, y);
  };

  const onFieldKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      place(0.08 + Math.random() * 0.84, 0.15 + Math.random() * 0.7);
    }
  };

  const onStarClick = (e: MouseEvent<HTMLButtonElement>, star: LocalStar) => {
    e.stopPropagation();
    ding(STAR_PALETTE[star.c].freq);
    pulse(star.id);
  };

  const choose = (c: number) => {
    setSelected(c);
    ding(STAR_PALETTE[c].freq);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* One watercolor filter per color, shared by every star */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          {STAR_PALETTE.map((p, i) => (
            <WatercolorFilter key={p.name} id={`guest-star-${i}`} seed={3 + i} edgeColor={p.edge} />
          ))}
        </defs>
      </svg>

      <div className="flex items-end justify-between gap-4">
        <p className="muted">pick a note, then click below to leave a star.</p>
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
        aria-label="leave a star (Enter places one at random)"
        onClick={onFieldClick}
        onKeyDown={onFieldKey}
        className="relative h-[200px] rounded-[10px] border border-[var(--rule)] bg-[var(--background)]"
        style={{ cursor: cursorFor(selected) }}
      >
        {loaded && stars.length === 0 && (
          <p className="page-in absolute inset-0 flex items-center justify-center muted pointer-events-none">
            no stars yet. be the first?
          </p>
        )}

        {stars.map((star, i) => (
          <button
            key={star.id}
            type="button"
            aria-label={`star, note ${STAR_PALETTE[star.c].note}`}
            onClick={(e) => onStarClick(e, star)}
            className="guest-star"
            style={{
              left: `${star.x * 100}%`,
              top: `${star.y * 100}%`,
              ...driftStyle(star.id, stars.length - 1 - i, !!star.fresh),
            }}
          >
            <span className="guest-star-enter">
              <span className="guest-star-drift">
                <span
                  key={pulses[star.id] ?? 0}
                  className={pulses[star.id] ? "guest-star-pop" : "guest-star-rest"}
                >
                  <PaintedStar c={star.c} />
                </span>
                {pulses[star.id] ? (
                  <span
                    key={`pulse-${pulses[star.id]}`}
                    className="guest-star-pulse"
                    style={{ "--pulse": STAR_PALETTE[star.c].color } as CSSProperties}
                  />
                ) : null}
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="flex justify-between text-[13px] muted min-h-[1.6em]">
        <span>
          {stars.length > 0 && `${stars.length} star${stars.length === 1 ? "" : "s"}`}
        </span>
        <span key={notice} className="page-in">
          {notice}
        </span>
      </p>
    </div>
  );
}
