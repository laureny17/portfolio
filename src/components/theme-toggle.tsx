"use client";

import { useRef } from "react";

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
  // Browsers report a pointer leave when a view transition starts (the overlay
  // takes the hover), which would snap the icon out of its hover tilt
  // mid-turn. Ignore leaves during the fade and re-sync with :hover after.
  const fading = useRef(false);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!document.startViewTransition) return apply();
    const btn = e.currentTarget;
    fading.current = true;
    document.startViewTransition(apply).finished.finally(() => {
      fading.current = false;
      // :hover takes a frame or two to come back after the overlay goes away
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!btn.matches(":hover")) delete btn.dataset.hover;
        }),
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") e.currentTarget.dataset.hover = "";
      }}
      onPointerLeave={(e) => {
        if (!fading.current) delete e.currentTarget.dataset.hover;
      }}
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
