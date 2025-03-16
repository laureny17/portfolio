"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between">
      {/* Name */}
      <p className="text-lg sm:text-xl md:text-2xl">Lauren Yoo</p>

      {/* Navigation */}
      <nav className="flex space-x-3">
        <Link
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" });
            // update URL without refreshing!
            window.history.pushState({}, "", "#projects");
          }}
          className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-xl md:text-2xl"
        >
          Projects
        </Link>
        <span className="text-lg sm:text-xl md:text-2xl">/</span>
        <Link
          href="/art"
          className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-xl md:text-2xl"
        >
          Art
        </Link>
        <span className="text-lg sm:text-xl md:text-2xl">/</span>
        <Link
          href="/about"
          className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-xl md:text-2xl"
        >
          About
        </Link>
      </nav>
    </header>
  );
}
