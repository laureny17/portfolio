"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WatercolorStar from "./watercolor-star";

const links = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Projects" },
  { href: "/art", label: "Art" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="col flex items-center justify-between pb-16 sm:pb-24">
      <Link href="/" className="group flex items-center gap-1.5" aria-label="Lauren Yoo, home">
        <WatercolorStar size={18} seed={2} className="nav-star" />
        <span>Lauren Yoo</span>
      </Link>

      <nav className="flex gap-4">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className="link link-muted"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
