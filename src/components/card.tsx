"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Card = {
  id: number;
  title: string;
  description: string;
  image: string[];
  tags: string[];
  isComplete: boolean;
};

const Card = ({ card }: { card: Card; className?: string }) => {
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
    <div className="w-full px-3">
      <div className="rounded-3xl border border-[var(--black)] p-8 sm:p-10 h-150 overflow-scroll bg-white">
        {card.image && (
          <div className="mb-6 rounded-xl w-[150px] h-[200px] mx-auto items-center flex justify-center">
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
        <p className="text-xs sm:text-sm md:text-sm lg:text-base pb-4">
          {card.description}
        </p>

        {/* tags */}
        <div className="flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs sm:text-xs md:text-xs lg:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-[var(--accent)] text-[var(--black)] rounded-full border-2 border-[var(--accent)] flex items-center"
            >
              {tag}
            </span>
          ))}
          {!card.isComplete && (
            <span className="text-xs sm:text-xs md:text-xs lg:text-sm px-2 sm:px-3 py-0.5 sm:py-1 text-[var(--black)] rounded-full border-2 border-[var(--accent)] flex items-center">
              WIP
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
export type { Card };
