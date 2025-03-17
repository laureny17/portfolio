"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { useCallback } from "react";
import Card from "./card";

const Carousel = ({ cards }: { cards: Card[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const newVisibleCards = window.innerWidth <= 960 ? 1 : 2;
      if (newVisibleCards !== visibleCards) {
        setVisibleCards(newVisibleCards);
        // Reset to first card when switching layouts to prevent empty states
        setCurrentIndex(0);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visibleCards]); // Add visibleCards to dependency array

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  }, [cards.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  }, [cards.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  return (
    <div className="relative w-full max-w-[95%]" ref={carouselRef}>
      {/* Navigation: Prev button, Dots, Next button - now above the carousel */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {/* Previous button */}
        <button
          onClick={prevSlide}
          className="flex items-center justify-center"
          aria-label="Previous slide"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--black)] text-[var(--background)]">
            <span className="inline-block transform -translate-y-0.5">←</span>
          </div>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${
                index === currentIndex
                  ? "text-lg text-[var(--black)] flex items-center"
                  : "w-2 h-2 rounded-full bg-[var(--light-gray)]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex ? "❤" : ""}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="flex items-center justify-center"
          aria-label="Next slide"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--black)] text-[var(--background)]">
            <span className="inline-block transform -translate-y-0.5">→</span>
          </div>
        </button>
      </div>

      {/* Cards container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${
              currentIndex *
              (visibleCards === 1 ? 20 / visibleCards : 40 / visibleCards)
            }%)`,
            width: `${cards.length * (100 / visibleCards)}%`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              className={`${visibleCards === 1 ? "w-full mx-auto" : "w-1/2"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
