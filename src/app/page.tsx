"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [cloverSize, setCloverSize] = useState(500); // Default clover size
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Mouse position
  const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 });

  // Track window dimensions for responsive resizing
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);

      // Dynamically adjust clover size based on breakpoints
      if (window.innerWidth < 640) {
        setCloverSize(300); // Small screens
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        setCloverSize(400); // Medium screens
      } else {
        setCloverSize(500); // Large screens
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

  // Calculate clover's dynamic position (centered horizontally)
  const cloverLeft = Math.max((windowWidth - cloverSize / 4) / 2, 0);
  const cloverTop = windowHeight / 2;

  // Calculate shadow offset based on mouse position
  useEffect(() => {
    let animationFrameId: number;

    const updateShadow = () => {
      const cloverCenterX = cloverLeft + cloverSize / 2;
      const cloverCenterY = cloverTop - 0.6 * cloverSize + cloverSize / 2;

      const targetX = (mousePosition.x - cloverCenterX) * -0.25;
      const targetY = (mousePosition.y - cloverCenterY) * -0.25;

      setShadowPosition((prev) => ({
        x: prev.x + (targetX - prev.x) * 0.1,
        y: prev.y + (targetY - prev.y) * 0.1,
      }));

      animationFrameId = requestAnimationFrame(updateShadow);
    };

    animationFrameId = requestAnimationFrame(updateShadow);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition, cloverLeft, cloverTop, cloverSize]);

  return (
    <div
      className="flex flex-col w-full max-w-full"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Section */}
      <main className="relative w-full h-screen">
        {windowWidth > 0 && windowHeight > 0 && (
          <>
            {/* Shadow Clover */}
            <div
              style={{
                position: "absolute",
                top: `${cloverTop + shadowPosition.y}px`,
                left: `${cloverLeft + shadowPosition.x}px`,
                transform: "translate(0, -60%) rotate(15deg)",
                width: cloverSize,
                height: cloverSize,
                zIndex: -2,
                filter: "blur(10px)",
                opacity: 0.5,
              }}
            >
              <Image
                src="/assets/Star.svg"
                alt="shadow-clover"
                width={cloverSize}
                height={cloverSize}
                priority
              />
            </div>

            {/* Main Clover */}
            <div
              style={{
                position: "absolute",
                top: `${cloverTop}px`,
                left: `${cloverLeft}px`,
                transform: "translate(0, -60%) rotate(15deg)",
                width: cloverSize,
                height: cloverSize,
                zIndex: -1,
              }}
            >
              <Image
                src="/assets/Star.svg"
                alt="clover"
                width={cloverSize}
                height={cloverSize}
                priority
              />
            </div>
          </>
        )}

        {/* Introduction Section */}
        <div className="absolute top-1/3 left-0 sm:left-10 md:left-20 lg:left-30">
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
