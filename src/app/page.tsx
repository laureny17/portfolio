"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [iconSize, setIconSize] = useState(500); // Default icon size
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Mouse position
  const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 });

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
                src="/assets/Star.svg"
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
                src="/assets/Star.svg"
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
          className="absolute top-1/3 left-0 sm:left-10 md:left-20 lg:left-30"
          style={{ zIndex: 1 }}
        >
          <p
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl pb-10 sm:pb-10 md:pb-20 lg:pb-25"
            style={{ fontFamily: "Pecita" }}
          >
            {`Hi, I'm `}
            <span className="underline underline-offset-6 md:underline-offset-8 underline-green-thick">
              Lauren
            </span>
            !
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl underline underline-offset-4 underline-green pb-4">
            CS/Math + Media Studies @ MIT
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl">
            {`I'm passionate about building technologies`}
            <br />
            {`that create meaningful experiences!`}
          </p>
        </div>
      </main>
    </div>
  );
}
