"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Carousel from "@/components/carousel";

// Sample project data - you can replace with your actual projects
const projectCards = [
  {
    id: 1,
    title: "Interactive Data Visualization",
    description:
      "A web application that visualizes complex datasets in an intuitive and interactive way.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["React", "D3.js", "TypeScript"],
  },
  {
    id: 2,
    title: "AI-Powered Learning Platform",
    description:
      "An educational platform that uses machine learning to personalize learning experiences.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["Next.js", "TensorFlow.js", "Tailwind CSS"],
  },
  {
    id: 3,
    title: "Sustainable Energy Dashboard",
    description:
      "A dashboard for monitoring and optimizing energy usage in smart buildings.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["React", "Node.js", "Chart.js"],
  },
];

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [cloverSize, setCloverSize] = useState(600); // Default clover size
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Mouse position
  const projectsRef = useRef<HTMLDivElement>(null);

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
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial values
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // track mouse position for shadow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // calculate clover's dynamic position
  const cloverLeft = Math.max((windowWidth - cloverSize / 2) / 2, 0); // Dynamic horizontal center
  const cloverTop = windowHeight / 2; // Vertical center of clover

  // calculate shadow offset based on mouse position
  const shadowOffsetX =
    (mousePosition.x - (cloverLeft + cloverSize / 2)) * -0.1; // Opposite direction of mouse
  const shadowOffsetY = (mousePosition.y - (cloverTop + cloverSize / 2)) * -0.1; // Opposite direction of mouse

  // Scroll to projects section
  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="grid max-w-full" onMouseMove={handleMouseMove}>
      <main className="row-start-2 h-screen relative">
        {/* shadow clover */}
        <div
          style={{
            position: "absolute",
            top: `${cloverTop + shadowOffsetY}px`,
            left: `${cloverLeft + shadowOffsetX}px`,
            transform: "translate(0, -60%) rotate(15deg)",
            width: cloverSize,
            height: cloverSize,
            zIndex: -2,
            filter: "blur(10px)", // add blur for shadow effect
            opacity: 0.5, // semi-transparent
          }}
        >
          <Image
            src="/Clover.svg"
            alt="shadow-clover"
            layout="intrinsic"
            width={cloverSize}
            height={cloverSize}
            priority
          />
        </div>

        {/* main clover */}
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
            src="/Clover.svg"
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
            Hi, I'm{" "}
            <span className="underline underline-offset-6 md:underline-offset-8 underline-green-thick">
              Lauren
            </span>
            !
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl underline underline-offset-4 underline-green pb-4">
            CS/Math + Media Studies @ MIT
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl">
            I’m passionate about building technologies <br />
            that create meaningful experiences!
          </p>
        </div>
      </main>
      {/* Projects Section */}
      <section
        ref={projectsRef}
        className="w-full py-16 row-start-3"
        id="projects"
      >
        <div className="max-w-7xl mx-auto px-6">
          <Carousel cards={projectCards} />
        </div>
      </section>
    </div>
  );
}
