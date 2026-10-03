import Image from "next/image";
import type { CSSProperties } from "react";
import GuestStars from "@/components/guest-stars";
import NowPlaying from "@/components/now-playing";
import { now } from "@/data/now";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

// Known at build time, so the "Listening" row can hold its place from the start
const spotifyEnabled = Boolean(
  process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_REFRESH_TOKEN
);

export default function Home() {
  return (
    <main className="col flex flex-col gap-16">
      <section className="flex flex-col gap-4">
        <h2 className="reveal flex gap-3" style={delay(0)}>
          <span className="muted tabular-nums">01</span>
          <span>About</span>
        </h2>
        {/* Photo height tracks the text beside it (fixed width, stretched, cropped):
            phones: beside the first paragraph, second one full width below;
            desktop: beside both paragraphs */}
        <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-4 sm:gap-x-6">
          <div
            className="reveal relative row-start-1 sm:row-span-2 w-[84px] sm:w-[108px] overflow-hidden rounded-[10px]"
            style={delay(1)}
          >
            <Image
              src="/assets/profile/profile-photo.jpeg"
              alt="Lauren"
              fill
              sizes="108px"
              className="object-cover object-[50%_30%] select-none"
              draggable={false}
              priority
            />
          </div>
          <p className="reveal col-start-2 row-start-1 min-w-0" style={delay(2)}>
            Hi! I&apos;m a senior at MIT studying computer science, passionate
            about building meaningful experiences. Particularly excited about
            networks and IoT, digital media, and education.
          </p>
          <p
            className="reveal col-span-2 row-start-2 sm:col-span-1 sm:col-start-2 min-w-0"
            style={delay(3)}
          >
            Outside of that, I draw, run, and read (some of my all-time favorites include{" "}
            <em>A Thousand Splendid Suns</em>,{" "}
            <em>Everything I Know about Love</em>, and{" "}
            <em>Crying in H Mart</em>).
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="reveal flex gap-3" style={delay(4)}>
          <span className="muted tabular-nums">02</span>
          <span>Now</span>
        </h2>
        <dl className="flex flex-col gap-3">
          {now.based && (
            <div className="reveal grid grid-cols-[84px_1fr] gap-4" style={delay(5)}>
              <dt className="muted">Based</dt>
              <dd>{now.based}</dd>
            </div>
          )}
          {now.taking.length > 0 && (
            <div className="reveal grid grid-cols-[84px_1fr] gap-4" style={delay(6)}>
              <dt className="muted">Taking</dt>
              <dd>
                {now.taking.map((c, i) => (
                  <span key={c.number}>
                    <span className="muted tabular-nums">[{c.number}]</span> {c.name}
                    {i < now.taking.length - 1 && ", "}
                  </span>
                ))}
              </dd>
            </div>
          )}
          <NowPlaying enabled={spotifyEnabled} labelClassName="muted" style={delay(7)} />
          {now.running && (
            <div className="reveal grid grid-cols-[84px_1fr] gap-4" style={delay(8)}>
              <dt className="muted">Running</dt>
              <dd>{now.running}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="reveal flex flex-col gap-4" style={delay(9)}>
        <h2 className="flex gap-3">
          <span className="muted tabular-nums">03</span>
          <span>Jar</span>
        </h2>
        <GuestStars />
      </section>
    </main>
  );
}
