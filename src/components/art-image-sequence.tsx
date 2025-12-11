"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import type { ArtImage as ArtImageType } from "@/data/art";

type ArtImageSequenceProps = {
  images: ArtImageType[];
  alt: string;
};

export default function ArtImageSequence({
  images,
  alt,
}: ArtImageSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if this is a fish sprite sequence (needs black background)
  const isFishSprite =
    images.length > 0 &&
    (images[0].src.includes("pixel-fish") || images[0].src.includes("fish-"));
  const bgColor = isFishSprite ? "bg-black" : "bg-white";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || images.length <= 1) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.floor(percentage * images.length);
    const clampedIndex = Math.min(newIndex, images.length - 1);

    setCurrentIndex(clampedIndex);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg break-inside-avoid inline-block w-full mb-4 select-none ${bgColor}`}
      style={{ verticalAlign: "top" }}
      onMouseMove={handleMouseMove}
    >
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center min-h-[200px] z-10 ${bgColor}`}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      {hasError ? (
        <div
          className={`flex items-center justify-center text-gray-400 min-h-[200px] ${bgColor}`}
        >
          <span className="text-sm">Failed to load</span>
        </div>
      ) : (
        <div className={`relative w-full ${bgColor}`}>
          {images.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={`${alt} ${index + 1}`}
              width={800}
              height={800}
              quality={75}
              loading={index === 0 ? "lazy" : "lazy"}
              className={`w-full h-auto object-contain ${
                index === currentIndex
                  ? loadedImages.has(image.src)
                    ? "opacity-100"
                    : "opacity-0"
                  : "opacity-0 absolute inset-0"
              }`}
              draggable={false}
              onLoad={() => {
                setLoadedImages((prev) => {
                  const newSet = new Set([...prev, image.src]);
                  if (newSet.size === 1) {
                    setIsLoading(false);
                  }
                  return newSet;
                });
              }}
              onError={() => {
                if (index === 0) {
                  setIsLoading(false);
                  setHasError(true);
                }
              }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ))}
        </div>
      )}
    </div>
  );
}
