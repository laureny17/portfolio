"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex justify-between">
      {/* Name */}
      <Link
        href="/"
        className="text-lg sm:text-2xl md:text-3xl font-medium hover:underline hover:underline-offset-4 underline-green"
      >
        Lauren Yoo
      </Link>

      {/* Navigation */}
      <nav className="flex space-x-3">
        {pathname === "/" ? (
          <a
            href="#projects"
            className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-2xl md:text-3xl font-medium"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById("projects");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            Projects
          </a>
        ) : (
          <Link
            href="/#projects"
            className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-2xl md:text-3xl font-medium"
          >
            Projects
          </Link>
        )}
        <span className="text-xl sm:text-2xl md:text-3xl font-medium">/</span>
        <Link
          href="/about"
          className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-2xl md:text-3xl font-medium"
        >
          About
        </Link>
        <span className="text-xl sm:text-2xl md:text-3xl font-medium">/</span>
        <Link
          href="/art"
          className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-2xl md:text-3xl font-medium"
        >
          Art
        </Link>
      </nav>
    </header>
  );
}
