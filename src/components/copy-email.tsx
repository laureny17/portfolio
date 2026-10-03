"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "copied" | "failed";

// The async Clipboard API only exists on secure pages (https/localhost), so
// fall back to the old execCommand route, e.g. a phone on the LAN dev server
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/** "Email" link that copies the address instead of opening a mail app. */
export default function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(email);
    setStatus(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), ok ? 1600 : 4000);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={`Copy ${email}`}
      className="link link-muted cursor-pointer inline-grid"
    >
      {status === "failed" ? (
        // Couldn't copy: show the address so it can be copied by hand
        <span className="page-in select-all">{email}</span>
      ) : (
        // "Email" and "Copied!" share one grid cell, so swapping never shifts the footer
        (["idle", "copied"] as const).map((s) => (
          <span
            key={s}
            aria-hidden={s !== status}
            className="[grid-area:1/1] text-right transition-opacity duration-300"
            style={{ opacity: s === status ? 1 : 0 }}
          >
            {s === "idle" ? "Email" : "Copied!"}
          </span>
        ))
      )}
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Email address copied" : status === "failed" ? `Copy failed. The address is ${email}` : ""}
      </span>
    </button>
  );
}
