"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtImage as ArtImageType } from "@/data/art";

type ArtImageProps = {
  image: ArtImageType;
};

export default function ArtImage({ image }: ArtImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Check if this is a fish sprite (needs black background)
  const isFishSprite =
    image.src.includes("pixel-fish") || image.src.includes("fish-");
  const bgColor = isFishSprite ? "bg-black" : "bg-white";

  const handleClick = () => {
    if (image.link) {
      window.open(image.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg break-inside-avoid inline-block w-full mb-4 select-none ${bgColor} ${
        image.link ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
      }`}
      style={{ verticalAlign: "top" }}
      onClick={handleClick}
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
          {image.src.includes("animation/") ? (
            // Use unoptimized img tag for animation images to avoid Next.js optimization issues
            <img
              src={image.src}
              alt={image.alt}
              className={`w-full h-auto object-contain ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              draggable={false}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              width={800}
              height={800}
              quality={75}
              loading="lazy"
              className={`w-full h-auto object-contain ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              draggable={false}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          )}
        </div>
      )}
    </div>
  );
}
