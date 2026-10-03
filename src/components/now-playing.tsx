"use client";

import { useEffect, useState } from "react";
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
        <a href={track.url} target="_blank" rel="noopener noreferrer" className="link truncate">
          {track.title}
          <span className="muted"> · {track.artist}</span>
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
