"use client";

import { useEffect, useRef } from "react";
import WatercolorStar from "./watercolor-star";

/** The watercolor star, drifting on its own and leaning a little toward the cursor. */
export default function HeroStar({ size = 132 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      // Pull is strongest nearby and fades out with distance; capped at 10px
      const pull = Math.min(10, 1600 / (dist + 160));
      target.x = (dx / dist) * pull;
      target.y = (dy / dist) * pull;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.05) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="will-change-transform select-none pointer-events-none">
      <div className="drift">
        <WatercolorStar size={size} seed={4} animate />
      </div>
    </div>
  );
}
