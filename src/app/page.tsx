import Image from "next/image";
import type { CSSProperties } from "react";
import GuestStars from "@/components/guest-stars";
import NowPlaying from "@/components/now-playing";
import { now } from "@/data/now";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export default function Home() {
  return (
    <main className="col flex flex-col gap-16">
      <section className="flex flex-col gap-4">
        <h2 className="reveal flex gap-3" style={delay(0)}>
          <span className="muted tabular-nums">01</span>
          <span>About</span>
        </h2>
        {/* Photo height tracks the bio: fixed width, stretched to the row's height, cropped to fit */}
        <div className="flex items-stretch gap-5 sm:gap-6">
          <div
            className="reveal relative shrink-0 w-[84px] sm:w-[108px] overflow-hidden rounded-[10px]"
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
          <p className="reveal min-w-0" style={delay(2)}>
            Hi, I&apos;m Lauren! I&apos;m a senior at MIT studying computer
            science, passionate about building meaningful experiences. I&apos;m
            particularly excited about networks and IoT, games/digital media,
            education, and accessibility in design.
          </p>
        </div>

        <p className="reveal" style={delay(3)}>
          Outside of that, I draw, run, and read (some of my all-time favorites include{" "}
          <em>A Thousand Splendid Suns</em>,{" "}
          <em>Everything I Know about Love</em>, and{" "}
          <em>Crying in H Mart</em>).
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="reveal flex gap-3" style={delay(4)}>
          <span className="muted tabular-nums">02</span>
          <span>Now</span>
        </h2>
        <dl className="flex flex-col gap-3">
          {now.based && (
            <div className="reveal grid grid-cols-[84px_1fr] gap-4" style={delay(5)}>
              <dt className="muted">based</dt>
              <dd>{now.based}</dd>
            </div>
          )}
          {now.taking.length > 0 && (
            <div className="reveal grid grid-cols-[84px_1fr] gap-4" style={delay(6)}>
              <dt className="muted">taking</dt>
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
          <NowPlaying labelClassName="muted" />
          {now.running && (
            <div className="reveal grid grid-cols-[84px_1fr] gap-4" style={delay(7)}>
              <dt className="muted">running</dt>
              <dd>{now.running}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="reveal flex flex-col gap-4" style={delay(8)}>
        <h2 className="flex gap-3">
          <span className="muted tabular-nums">03</span>
          <span>Jar</span>
        </h2>
        <GuestStars />
      </section>
    </main>
  );
}
