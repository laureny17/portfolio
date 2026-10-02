import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export default function Home() {
  return (
    <main className="col flex flex-col gap-4">
      {/* Photo height tracks the bio: fixed width, stretched to the row's height, cropped to fit */}
      <section className="flex items-stretch gap-5 sm:gap-6">
        <div
          className="reveal relative shrink-0 w-[84px] sm:w-[108px] overflow-hidden rounded-[10px]"
          style={delay(0)}
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
        <p className="reveal min-w-0" style={delay(1)}>
          Hi, I&apos;m Lauren! I&apos;m a senior at MIT studying computer
          science, passionate about building meaningful experiences. I&apos;m
          particularly excited about networks and IoT, games/digital media,
          education, and accessibility in design.
        </p>
      </section>

      <p className="reveal" style={delay(2)}>
        Outside of that, I draw (
        <Link href="/art" className="link muted">
          art
        </Link>
        ), run, and read (some of my all-time favorites include{" "}
        <em>A Thousand Splendid Suns</em>,{" "}
        <em>Everything I Know about Love</em>, and{" "}
        <em>Crying in H Mart</em>).
      </p>
    </main>
  );
}
