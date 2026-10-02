import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export default function Home() {
  return (
    <main className="col flex flex-col gap-4">
      <section className="flex items-start gap-5 sm:gap-6">
        <Image
          src="/assets/profile/profile-photo.jpeg"
          alt="Lauren"
          width={176}
          height={176}
          className="reveal shrink-0 w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-[10px] object-cover select-none"
          style={delay(0)}
          draggable={false}
          priority
        />
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
