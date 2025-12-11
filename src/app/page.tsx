"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import ProjectGrid from "@/components/project-grid";
import { projectCards } from "../components/projectCards";

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [iconSize, setIconSize] = useState(500); // Default icon size
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Mouse position
  const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 });
  const [selectedTechnologies, setSelectedTechnologies] = useState<Set<string>>(
    new Set()
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projectCards.forEach((card) => {
      card.tags.forEach((tag) => techSet.add(tag));
    });
    return Array.from(techSet).sort();
  }, []);

  // Toggle technology selection
  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tech)) {
        newSet.delete(tech);
      } else {
        newSet.add(tech);
      }
      return newSet;
    });
  };

  // Filter projects based on selected technologies
  const filteredProjects = useMemo(() => {
    return projectCards.filter((card) => {
      // Filter by technology - show if project has at least one selected technology
      if (selectedTechnologies.size > 0) {
        return card.tags.some((tag) => selectedTechnologies.has(tag));
      }
      return true;
    });
  }, [selectedTechnologies]);

  // Track window dimensions for responsive resizing
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);

      // Dynamically adjust icon size based on breakpoints
      if (window.innerWidth < 640) {
        setIconSize(300); // Small screens
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        setIconSize(400); // Medium screens
      } else {
        setIconSize(500); // Large screens
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track mouse position for shadow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Calculate icon's dynamic position (centered horizontally)
  const iconLeft = Math.max((windowWidth - iconSize / 4) / 2, 0);
  const iconTop = windowHeight / 2;

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <div
      className="flex flex-col w-full max-w-full"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Section */}
      <main className="relative w-full h-screen">
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
          </div>
        )}

        {/* Introduction Section */}
        <div
          className="absolute top-[28%] left-0 sm:left-12 md:left-20 lg:left-28 xl:left-36"
          style={{ zIndex: 1 }}
        >
          <p
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl pb-4 sm:pb-6 md:pb-8 lg:pb-10"
            style={{ fontFamily: "Pecita" }}
          >
            {`Hi, I'm `}
            <span className="underline underline-offset-6 md:underline-offset-8 underline-green-thick">
              Lauren
            </span>
            !
          </p>
          <p className="text-base sm:text-lg md:text-lg lg:text-lg underline underline-offset-4 underline-green pb-4">
            CS/Math + Media Studies @ MIT
          </p>
          <p className="text-base sm:text-lg md:text-lg lg:text-lg">
            {`I'm passionate about building technologies`}
            <br />
            {`that create meaningful experiences!`}
          </p>
        </div>
      </main>

      {/* Projects Section */}
      <section id="projects" className="pt-20 pb-20">
        <div className="relative px-0 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          {/* Section Header and Filters */}
          <div className="mb-8 flex flex-row justify-between items-start gap-6 sm:gap-8">
            {/* Header */}
            <div>
              <div className="text-lg md:text-xl lg:text-2xl">
                Here are some projects I've worked on!
              </div>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg text-gray-600 font-medium mt-2">
                Click on a project card to learn more.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              {/* Technology Filter - Multi-select dropdown */}
              <div className="relative flex flex-col gap-2" data-dropdown>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm sm:text-sm md:text-base lg:text-lg min-w-[180px] text-left flex items-center justify-between cursor-pointer"
                >
                  <span>
                    {selectedTechnologies.size === 0
                      ? "All Selected"
                      : `${selectedTechnologies.size} selected`}
                  </span>
                  <span className="ml-2">▼</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[180px] max-h-64 overflow-y-auto">
                    <div className="p-2 space-y-2">
                      {allTechnologies.map((tech) => (
                        <div key={tech} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`tech-${tech}`}
                            checked={selectedTechnologies.has(tech)}
                            onChange={() => toggleTechnology(tech)}
                          />
                          <label
                            htmlFor={`tech-${tech}`}
                            className="text-xs sm:text-sm text-gray-600 cursor-pointer font-medium flex-1 pt-0.5"
                          >
                            {tech}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="w-full mb-16">
            <ProjectGrid cards={filteredProjects} />
          </div>
        </div>
      </section>
    </div>
  );
}
