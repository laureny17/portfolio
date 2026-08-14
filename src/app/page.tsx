"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import ProjectGrid from "@/components/project-grid";
import { hiddenProjectIds, projects as projectCards } from "../data/projects";

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [iconSize, setIconSize] = useState(500); // Default icon size
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Mouse position
  const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 });

  const filteredProjects = useMemo(() => {
    return projectCards.filter((card) => !hiddenProjectIds.has(card.id));
  }, []);

  // Track window dimensions for responsive resizing
  useEffect(() => {
    let lastWidth = window.innerWidth;

    function handleResize() {
      // On mobile, scrolling shows/hides the browser chrome, which changes
      // innerHeight (and fires resize) without the width actually changing.
      // Only react to genuine width changes so the star doesn't jump on scroll.
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;

      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);

      // Dynamically adjust icon size based on breakpoints
      if (window.innerWidth < 640) {
        // Mobile: scale with screen width instead of a fixed size
        setIconSize(Math.round(window.innerWidth * 0.85));
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        setIconSize(400); // Medium screens
      } else {
        setIconSize(500); // Large screens
      }
    }

    // initial measurement (always runs, unlike handleResize above)
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    if (window.innerWidth < 640) {
      setIconSize(Math.round(window.innerWidth * 0.85));
    } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
      setIconSize(400);
    } else {
      setIconSize(500);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track mouse position for shadow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Calculate icon's dynamic position (centered horizontally)
  const isMobile = windowWidth > 0 && windowWidth < 640;
  const iconLeft = isMobile
    ? windowWidth * 0.15 // mobile: less inset, so more of the bigger star stays on-screen
    : Math.max((windowWidth - iconSize / 4) / 2, 0);
  const iconTop = isMobile ? windowHeight * 0.4 : windowHeight / 2;

  // Calculate shadow offset based on mouse position
  useEffect(() => {
    let animationFrameId: number;

    const updateShadow = () => {
      const iconCenterX = iconLeft + iconSize / 2;
      const iconCenterY = iconTop - 0.6 * iconSize + iconSize / 2;

      const targetX = (mousePosition.x - iconCenterX) * -0.25;
      const targetY = (mousePosition.y - iconCenterY) * -0.25;

      setShadowPosition((prev) => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1,
      }));

      animationFrameId = requestAnimationFrame(updateShadow);
    };

    animationFrameId = requestAnimationFrame(updateShadow);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition, iconLeft, iconTop, iconSize]);

  return (
    <div
      className="flex flex-col w-full max-w-full"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Section */}
      <main className="relative w-full h-[55vh] sm:h-screen">
        {windowWidth > 0 && windowHeight > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              pointerEvents: "none",
            }}
          >
            {isMobile ? (
              /* Mobile: single blurred star, immune to user input, ambient-floating on its own */
              <div
                style={{
                  position: "absolute",
                  top: `${iconTop}px`,
                  left: `${iconLeft}px`,
                  transform: "translate(0, -60%) rotate(15deg)",
                  width: iconSize,
                  height: iconSize,
                  zIndex: -1,
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  pointerEvents: "none",
                  WebkitTouchCallout: "none",
                }}
              >
                <div className="ambient-float-star">
                  <Image
                    src="/assets/Icon.svg"
                    alt="icon"
                    width={iconSize}
                    height={iconSize}
                    priority
                    draggable={false}
                    style={{
                      filter: "blur(10px)",
                      opacity: 0.5,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Shadow Icon */}
                <div
                  style={{
                    position: "absolute",
                    top: `${iconTop + shadowPosition.y}px`,
                    left: `${iconLeft + shadowPosition.x}px`,
                    transform: "translate(0, -60%) rotate(15deg)",
                    width: iconSize,
                    height: iconSize,
                    zIndex: -2,
                    filter: "blur(10px)",
                    opacity: 0.5,
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    pointerEvents: "none",
                    WebkitTouchCallout: "none",
                  }}
                >
                  <Image
                    src="/assets/Icon.svg"
                    alt="shadow-icon"
                    width={iconSize}
                    height={iconSize}
                    priority
                    draggable={false}
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  />
                </div>

                {/* Main Icon */}
                <div
                  style={{
                    position: "absolute",
                    top: `${iconTop}px`,
                    left: `${iconLeft}px`,
                    transform: "translate(0, -60%) rotate(15deg)",
                    width: iconSize,
                    height: iconSize,
                    zIndex: -1,
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    pointerEvents: "none",
                    WebkitTouchCallout: "none",
                  }}
                >
                  <Image
                    src="/assets/Icon.svg"
                    alt="icon"
                    width={iconSize}
                    height={iconSize}
                    priority
                    draggable={false}
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Introduction Section */}
        <div
          className="absolute top-[30%] sm:top-[28%] left-0 md:left-8 lg:left-12 xl:left-28 2xl:left-36"
          style={{ zIndex: 1 }}
        >
          <p
            className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl pb-4 sm:pb-6 md:pb-8 lg:pb-10 whitespace-nowrap"
            style={{ fontFamily: "Pecita" }}
          >
            {`Hi, I'm `}
            <span className="underline underline-offset-6 md:underline-offset-8 underline-green-thick">
              Lauren
            </span>
            !
          </p>
          <p className="hero-subtitle text-base sm:text-lg md:text-lg lg:text-lg underline underline-offset-4 underline-green pb-4">
            CS + Design @ MIT
          </p>
          <p className="text-xs max-w-[280px] sm:max-w-none">
            {`I'm passionate about building meaningful experiences!`}
          </p>
        </div>
      </main>

      {/* Projects Section */}
      <section id="projects" className="pt-6 sm:pt-20 pb-20">
        <div className="relative px-0 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          {/* Section Header */}
          <div className="mb-8 flex items-center gap-4">
            <span className="text-base md:text-xl lg:text-2xl flex-shrink-0">
              Projects
            </span>
            <div className="flex-1 h-[2px] bg-[var(--accent)] -translate-y-[2px]" />
          </div>

          {/* Projects Grid */}
          <div className="w-full mb-16">
            {filteredProjects.length > 0 ? (
              <ProjectGrid cards={filteredProjects} />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
