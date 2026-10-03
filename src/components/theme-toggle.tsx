"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "theme";

/**
 * Light/dark switch. With nothing stored the site follows the system; picking
 * the theme the system already uses clears the override, so it goes back to
 * following the system. The icon is pure CSS off <html data-theme>, so there's
 * nothing to hydrate.
 */
export default function ThemeToggle() {
  const apply = () => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.dataset.theme ?? (systemDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";

    if (next === (systemDark ? "dark" : "light")) {
      delete root.dataset.theme;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    } else {
      root.dataset.theme = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
    }
  };

  // Cross-fade the whole page as one snapshot, so everything changes together
  // (per-element color transitions lag on nested text). Instant where the
  // View Transitions API isn't available.
  const toggle = () => {
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
  };

  // Hover (the icon's tilt and darker color) comes from where the mouse
  // actually is, not :hover or enter/leave events: browsers drop or misreport
  // those around a view transition (and Safari doesn't restore :hover until
  // the mouse moves), which made the icon snap out of its tilt mid-switch.
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let x = -1;
    let y = -1;
    const update = () => {
      const btn = ref.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const over = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      if (over) btn.dataset.hover = "";
      else delete btn.dataset.hover;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      update();
    };
    // Mouse left the window (only trusted at the window's edge, so a stray
    // leave during a view transition can't clear the hover)
    const onLeavePage = (e: PointerEvent) => {
      const atEdge = e.clientX <= 0 || e.clientY <= 0 || e.clientX >= innerWidth - 1 || e.clientY >= innerHeight - 1;
      if (!atEdge) return;
      x = y = -1;
      update();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeavePage);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", update);
      document.documentElement.removeEventListener("pointerleave", onLeavePage);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <svg className="icon-moon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M13.5 9.6A5.75 5.75 0 0 1 6.4 2.5a5.75 5.75 0 1 0 7.1 7.1Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="icon-sun" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M8 1.25v1.5M8 13.25v1.5M1.25 8h1.5M13.25 8h1.5M3.2 3.2l1.06 1.06M11.74 11.74l1.06 1.06M3.2 12.8l1.06-1.06M11.74 4.26l1.06-1.06"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
