"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import Image from "next/image";
import { useCallback } from "react";

type Card = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
};

const Carousel = ({ cards }: { cards: Card[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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
    <div
      className="relative w-full"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* cards container */}
      <div>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cards.map((card) => (
            <div key={card.id} className="w-full">
              <div className="rounded-3xl shadow-md p-10 h-150 overflow-hidden">
                {card.image && (
                  <div className="mb-6 rounded-xl">
                    <Image
                      // src={card.image}
                      src={"/Clover.svg"}
                      alt={card.title}
                      width={500}
                      height={300}
                      className="w-full h-auto object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                )}
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl pb-3 italic">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl pb-4">
                  {card.description}
                </p>

                {/* tags */}
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs sm:text-xs md:text-sm lg:text-base px-3 py-1 bg-[var(--accent)] text-[var(--black)] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* nav arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--black)] text-[var(--background)]"
        aria-label="Previous slide"
      >
        {`<`}
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--black)] text-[var(--background)]"
        aria-label="Next slide"
      >
        {`>`}
      </button>

      {/* dots */}
      <div className="flex justify-center gap-2 mt-8">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex
                ? "bg-[var(--black)]"
                : "bg-[var(--light-gray)]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
