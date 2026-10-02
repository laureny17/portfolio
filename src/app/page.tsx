import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export default function Home() {
  return (
    <main className="col flex flex-col gap-8">
      <section className="reveal flex items-center gap-4" style={delay(0)}>
        <Image
          src="/assets/profile/profile-photo.jpeg"
          alt="Lauren"
          width={112}
          height={112}
          className="w-14 h-14 rounded-full object-cover select-none"
          draggable={false}
          priority
        />
        <div className="flex flex-col">
          <span>Lauren Yoo</span>
          <span className="muted">she/her</span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <p className="reveal" style={delay(1)}>
          Hi, I&apos;m Lauren! I&apos;m a senior at MIT studying computer
          science, passionate about building meaningful experiences. I&apos;m
          particularly excited about networks and IoT, games/digital media,
          education, and accessibility in design.
        </p>
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
      </section>
    </main>
  );
}
