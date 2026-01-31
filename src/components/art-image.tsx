"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ArtImage as ArtImageType } from "@/data/art";

type ArtImageProps = {
  image: ArtImageType;
  priority?: boolean;
  onLoadComplete?: () => void;
  enableModal?: boolean;
};

export default function ArtImage({
  image,
  priority = false,
  onLoadComplete,
  enableModal = true,
}: ArtImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if this is a fish sprite (needs black background)
  const isFishSprite =
    image.src.includes("pixel-fish") || image.src.includes("fish-");
  const bgColor = isFishSprite ? "bg-black" : "bg-white";
  const useNativeImg =
    image.src.includes("/assets/art/hackmit/hack25/") ||
    image.src.includes("animation/");
  const thumbnailQuality = 40;
  const fullQuality = 90;

  const handleClick = () => {
    if (image.link) {
      window.open(image.link, "_blank", "noopener,noreferrer");
      return;
    }
    if (enableModal) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <div
      className={`relative overflow-hidden rounded-lg block w-full select-none ${bgColor} ${
        image.link ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
      }`}
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
          {useNativeImg ? (
            // Use unoptimized img tag for animation/HackMIT images to avoid Next.js optimization issues
            <img
              src={image.src}
              alt={image.alt}
              className={`w-full h-auto object-contain ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              draggable={false}
              loading={priority ? "eager" : "lazy"}
              onLoad={() => {
                setIsLoading(false);
                onLoadComplete?.();
              }}
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
              quality={thumbnailQuality}
              loading={priority ? undefined : "lazy"}
              priority={priority}
              className={`w-full h-auto object-contain ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              draggable={false}
              onLoad={() => {
                setIsLoading(false);
                onLoadComplete?.();
              }}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          )}
        </div>
      )}
      {isModalOpen && !image.link && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {useNativeImg ? (
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                draggable={false}
                loading="eager"
              />
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1600}
                quality={fullQuality}
                priority
                className="max-h-[90vh] max-w-[90vw] object-contain"
                sizes="90vw"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
