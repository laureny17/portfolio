"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Carousel from "@/components/carousel";
import { projectCards } from "../../public/assets/projectCards";

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [cloverSize, setCloverSize] = useState(600); // Default clover size
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Mouse position
  const projectsRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(1200);

  // Track window dimensions for responsive resizing
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);

      // Dynamically adjust clover size based on breakpoints
      if (window.innerWidth < 640) {
        setCloverSize(500); // Small screens
      } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        setCloverSize(600); // Medium screens
      } else {
        setCloverSize(700); // Large screens
      }

      // Account for padding and arrows (40px padding on each side + 20px for arrows)
      setCarouselWidth(Math.min(window.innerWidth - 120, 1200));
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
  const cloverLeft = Math.max((windowWidth - cloverSize / 2) / 2, 0);
  const cloverTop = windowHeight / 2;

  // Calculate shadow offset based on mouse position
  const shadowOffsetX =
    (mousePosition.x - (cloverLeft + cloverSize / 2)) * -0.1;
  const shadowOffsetY = (mousePosition.y - (cloverTop + cloverSize / 2)) * -0.1;

  // Handle hash changes to scroll to Projects
  useEffect(() => {
    if (window.location.hash === "#projects") {
      projectsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className="flex flex-col w-full max-w-full"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Section */}
      <main className="relative w-full h-screen">
        {/* Shadow Clover */}
        <div
          style={{
            position: "absolute",
            top: `${cloverTop + shadowOffsetY}px`,
            left: `${cloverLeft + shadowOffsetX}px`,
            transform: "translate(0, -60%) rotate(15deg)",
            width: cloverSize,
            height: cloverSize,
            zIndex: -2,
            filter: "blur(10px)",
            opacity: 0.5,
          }}
        >
          <Image
            src="/assets/Clover.svg"
            alt="shadow-clover"
            layout="intrinsic"
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
            src="/assets/Clover.svg"
            alt="clover"
            layout="intrinsic"
            width={cloverSize}
            height={cloverSize}
            priority
          />
        </div>

        {/* Introduction Section */}
        <div className="absolute top-1/3 left-10 sm:left-15 md:left-20 lg:left-30">
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

      {/* Projects Section */}
      <section ref={projectsRef} className="w-full py-16 px-7" id="projects">
        <div className="w-full px-5">
          <div className="w-full">
            <Carousel cards={projectCards} />
          </div>
        </div>
      </section>
    </div>
  );
}
