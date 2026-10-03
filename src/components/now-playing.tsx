"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { NowPlaying as NowPlayingData } from "@/app/api/now-playing/route";

type Track = Extract<NowPlayingData, { configured: true }>["track"];

const POLL_MS = 60_000;

/** The "listening" row in Now. Renders nothing until there's a track to show. */
export default function NowPlaying({ labelClassName = "" }: { labelClassName?: string }) {
  const [track, setTrack] = useState<Track>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const res = await fetch("/api/now-playing");
        const data = (await res.json()) as NowPlayingData;
        if (!cancelled) setTrack(data.configured ? data.track : null);
      } catch {
        // keep whatever we showed last
      }
    };

    load();
    const interval = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  if (!track) return null;

  return (
    <div className="reveal grid grid-cols-[84px_1fr] gap-4">
      <dt className={labelClassName}>Listening</dt>
      {/* key: crossfade when the song changes */}
      <dd key={track.url} className="page-in flex items-baseline gap-2 min-w-0">
        {track.isPlaying && <Equalizer />}
        <a href={track.url} target="_blank" rel="noopener noreferrer" className="marquee-link link min-w-0">
          <Marquee>
            {track.title}
            <span className="muted"> · {track.artist}</span>
          </Marquee>
        </a>
        {!track.isPlaying && <span className="muted shrink-0">(last played)</span>}
      </dd>
    </div>
  );
}

function Equalizer() {
  return (
    <span aria-label="playing now" className="equalizer shrink-0" role="img">
      <span />
      <span />
      <span />
    </span>
  );
}

const MARQUEE_SPEED = 32; // px per second
const MARQUEE_GAP = 40; // px between the end of the text and its repeat
const MARQUEE_HOLD = 1.2; // seconds resting at the start of each pass

/**
 * Text that scrolls sideways while hovered or focused, if it's too long to
 * fit. Each pass rests at the start for a moment, and the loop is seamless
 * (the text is followed by a copy of itself). Otherwise, or with reduced
 * motion: plain ellipsis.
 */
function Marquee({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const anim = useRef<Animation | null>(null);
  const [overflow, setOverflow] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Does the text overflow? Re-checked when either size changes
  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    const check = () => setOverflow(text.scrollWidth > box.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(box);
    ro.observe(text);
    return () => ro.disconnect();
  }, []);

  const run = overflow && hovered;
  // Still showing the moving layout while it eases back to the start
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const text = textRef.current;
    if (!track || !text) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (run && !reduced) {
      const distance = text.scrollWidth + MARQUEE_GAP;
      const total = MARQUEE_HOLD + distance / MARQUEE_SPEED;
      anim.current?.cancel();
      setReturning(false);
      anim.current = track.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(0)", offset: MARQUEE_HOLD / total },
          { transform: `translateX(${-distance}px)` },
        ],
        { duration: total * 1000, iterations: Infinity, easing: "linear" }
      );
      return;
    }

    // Stopped: ease back to the start from wherever it was, rather than snapping
    const current = anim.current;
    anim.current = null;
    if (!current) return;
    const from = getComputedStyle(track).transform;
    current.cancel();
    if (!from || from === "none" || reduced) return;
    setReturning(true);
    anim.current = track.animate([{ transform: from }, { transform: "none" }], {
      duration: 450,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    anim.current.onfinish = () => {
      anim.current = null;
      setReturning(false);
    };
  }, [run]);

  useEffect(() => () => anim.current?.cancel(), []);

  return (
    <span
      ref={boxRef}
      className="marquee"
      data-overflow={overflow || undefined}
      data-running={run || returning || undefined}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span ref={trackRef} className="marquee-track">
        <span ref={textRef} className="marquee-text">
          {children}
        </span>
        {overflow && (
          <span className="marquee-text" aria-hidden="true" style={{ paddingLeft: MARQUEE_GAP }}>
            {children}
          </span>
        )}
      </span>
    </span>
  );
}
