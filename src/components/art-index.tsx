"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  artSectionCount,
  artSectionCover,
  artSectionSlug,
  type ArtSection,
} from "@/data/art";

/**
 * Numbered list of art sections. On devices with a mouse, hovering a row shows
 * that section's cover in a small preview that trails the cursor.
 */
export default function ArtIndex({ sections }: { sections: ArtSection[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnabled(
      window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = previewRef.current;
    if (!el) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let first = true;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX + 24;
      target.y = e.clientY - 60;
      if (first) {
        current.x = target.x;
        current.y = target.y;
        first = false;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.1) {
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
  }, [enabled]);

  return (
    <>
      <ol className="flex flex-col" onPointerLeave={() => setActive(null)}>
        {sections.map((section, i) => {
          const count = artSectionCount(section);
          return (
            <li
              key={section.name}
              className="reveal"
              style={{ "--i": i + 1 } as React.CSSProperties}
            >
              <Link
                href={`/art/${artSectionSlug(section)}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex items-baseline gap-3 py-2 border-b border-[var(--rule)]"
              >
                <span className="muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                  {section.name}
                </span>
                {count > 0 && <span className="muted tabular-nums">{count}</span>}
              </Link>
            </li>
          );
        })}
      </ol>

      {enabled && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className="fixed left-0 top-0 z-30 pointer-events-none will-change-transform"
        >
          <div
            className="relative w-[180px] h-[220px] transition-[opacity,transform] duration-500 ease-[var(--ease-out)]"
            style={{
              opacity: active !== null && artSectionCover(sections[active]) ? 1 : 0,
              transform: active !== null ? "scale(1)" : "scale(0.96)",
            }}
          >
            {sections.map((section, i) => {
              const cover = artSectionCover(section);
              if (!cover) return null;
              return (
                <Image
                  key={section.name}
                  src={cover.src}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-cover rounded-[3px] transition-opacity duration-500"
                  style={{ opacity: active === i ? 1 : 0 }}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
