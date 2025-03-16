"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex justify-between">
      {/* Name */}
      <Link href="/" className="text-lg sm:text-xl md:text-2xl">
        Lauren Yoo
      </Link>

      {/* Navigation */}
      <nav className="flex space-x-3">
        <Link
          href={pathname === "/" ? "#projects" : "/"}
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" });
              window.history.pushState({}, "", "#projects");
            }
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
