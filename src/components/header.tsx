"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex justify-between">
      {/* Name */}
      <Link href="/" className="text-lg sm:text-2xl md:text-3xl font-medium">
        Lauren Yoo
      </Link>

      {/* Navigation */}
      <nav className="flex space-x-3">
        <Link
          href="/projects"
          className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-2xl md:text-3xl font-medium"
        >
          Projects
        </Link>
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
