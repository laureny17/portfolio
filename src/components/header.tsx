"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMenuOpen]);

  const handleProjectsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Restore body position immediately so scrolling works
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";

    setIsMenuOpen(false);

    // Wait for menu animation to complete before scrolling
    setTimeout(() => {
      if (pathname === "/") {
        const element = document.getElementById("projects");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        window.location.href = "/#projects";
      }
    }, 650); // Wait for menu animation (600ms) + small buffer
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="flex justify-between items-center">
        {/* Name */}
        <Link
          href="/"
          className="text-lg sm:text-2xl md:text-3xl font-medium hover:underline hover:underline-offset-4 underline-green z-50 relative"
          onClick={handleNavClick}
        >
          Lauren Yoo
        </Link>

        {/* Hamburger Menu Button - Mobile Only */}
        <button
          className="md:hidden z-50 relative w-8 h-8 self-center -mt-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="absolute transition-all duration-300"
            style={{
              width: "24px",
              height: "2.5px",
              backgroundColor: "currentColor",
              borderRadius: "1px",
              top: isMenuOpen ? "50%" : "25%",
              left: "50%",
              transform: isMenuOpen
                ? "translate(-50%, -50%) rotate(45deg)"
                : "translate(-50%, -50%)",
            }}
          />
          <span
            className="absolute transition-all duration-300"
            style={{
              width: "24px",
              height: "2.5px",
              backgroundColor: "currentColor",
              borderRadius: "1px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: isMenuOpen ? 0 : 1,
            }}
          />
          <span
            className="absolute transition-all duration-300"
            style={{
              width: "24px",
              height: "2.5px",
              backgroundColor: "currentColor",
              borderRadius: "1px",
              top: isMenuOpen ? "50%" : "75%",
              left: "50%",
              transform: isMenuOpen
                ? "translate(-50%, -50%) rotate(-45deg)"
                : "translate(-50%, -50%)",
            }}
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-3">
          {pathname === "/" ? (
            <a
              href="#projects"
              className="hover:underline hover:underline-offset-4 underline-green text-lg sm:text-2xl md:text-3xl font-medium"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("projects");
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
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

      {/* Full Screen Mobile Menu Overlay */}
      <div
        className="fixed inset-0 bg-off-white z-40 md:hidden"
        style={{
          clipPath: isMenuOpen
            ? "circle(150% at 90% 5%)"
            : "circle(0% at 90% 5%)",
          transition: "clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <nav
          className="flex flex-col justify-center items-center h-full space-y-8"
          style={{
            opacity: isMenuOpen ? 1 : 0,
            transition: "opacity 0.3s ease-in 0.3s",
          }}
        >
          {pathname === "/" ? (
            <a
              href="#projects"
              className="hover:underline hover:underline-offset-4 underline-green text-4xl font-medium"
              onClick={handleProjectsClick}
            >
              Projects
            </a>
          ) : (
            <Link
              href="/#projects"
              className="hover:underline hover:underline-offset-4 underline-green text-4xl font-medium"
              onClick={handleNavClick}
            >
              Projects
            </Link>
          )}
          <Link
            href="/about"
            className="hover:underline hover:underline-offset-4 underline-green text-4xl font-medium"
            onClick={handleNavClick}
          >
            About
          </Link>
          <Link
            href="/art"
            className="hover:underline hover:underline-offset-4 underline-green text-4xl font-medium"
            onClick={handleNavClick}
          >
            Art
          </Link>
        </nav>
      </div>
    </>
  );
}
