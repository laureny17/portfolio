"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import Image from "next/image";
import { useCallback } from "react";

type Card = {
  id: number;
  title: string;
  description: string;
  image: string[];
  tags: string[];
  isComplete: boolean;
};

const Card = ({ card }: { card: Card }) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (Array.isArray(card.image)) {
      const interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % card.image.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [card.image]);

  return (
    <div className="w-1/2 px-3">
      <div className="rounded-3xl border border-[var(--black)] p-10 h-150 overflow-scroll bg-white">
        {card.image && (
          <div className="mb-6 rounded-xl max-w-[300px] h-[200px] mx-auto items-center flex justify-center">
            <Image
              src={card.image[imageIndex] || "/assets/Clover.svg"}
              alt={card.title}
              width={300}
              height={200}
              className="items-center object-contain transition-transform hover:scale-105 duration-300"
            />
          </div>
        )}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl pb-3 italic">
          {card.title}
        </p>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg pb-4">
          {card.description}
        </p>

        {/* tags */}
        <div className="flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs sm:text-xs md:text-sm lg:text-base px-3 py-1 bg-[var(--accent)] text-[var(--black)] rounded-full flex items-center"
            >
              {tag}
            </span>
          ))}
          {!card.isComplete && (
            <span className="text-xs sm:text-xs md:text-sm lg:text-base px-3 py-1 text-[var(--black)] rounded-full border-2 border-[var(--accent)] leading-none flex items-center">
              WIP
            </span>
          )}
        </div>
      </div>
    </div>
  );
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
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / cards.length)}%)`,
            width: `${cards.length * 50}%`, // Each card takes up 50% of container
          }}
        >
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>

      {/* nav arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--black)] text-[var(--background)]"
        aria-label="Previous slide"
      >
        {`<`}
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--black)] text-[var(--background)]"
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
