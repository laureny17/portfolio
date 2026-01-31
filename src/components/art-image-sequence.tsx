"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ArtImage as ArtImageType } from "@/data/art";

type ArtImageSequenceProps = {
  images: ArtImageType[];
  alt: string;
  priority?: boolean;
  onLoadComplete?: () => void;
  enableModal?: boolean;
};

export default function ArtImageSequence({
  images,
  alt,
  priority = false,
  onLoadComplete,
  enableModal = true,
}: ArtImageSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalImageRef = useRef<HTMLDivElement>(null);

  // Check if this is a fish sprite sequence (needs black background)
  const isFishSprite =
    images.length > 0 &&
    (images[0].src.includes("pixel-fish") || images[0].src.includes("fish-"));
  const bgColor = isFishSprite ? "bg-black" : "bg-white";
  const useNativeImg = images.some(
    (img) =>
      img.src.includes("/assets/art/hackmit/hack25/") ||
      img.src.includes("animation/")
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalOpen || !containerRef.current || images.length <= 1) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.floor(percentage * images.length);
    const clampedIndex = Math.min(newIndex, images.length - 1);

    setCurrentIndex(clampedIndex);
  };

  const handleModalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isModalOpen || !modalImageRef.current || images.length <= 1) return;

    const rect = modalImageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.floor(percentage * images.length);
    const clampedIndex = Math.min(newIndex, images.length - 1);

    setModalIndex(clampedIndex);
  };

  const handleClick = () => {
    if (enableModal) {
      setModalIndex(currentIndex);
      setIsModalOpen(true);
    }
  };

  const handleBackdropClick = () => {
    setIsModalOpen(false);
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
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg block w-full select-none ${bgColor}`}
      onMouseMove={handleMouseMove}
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
          {images.map((image, index) =>
            useNativeImg ? (
              <img
                key={image.src}
                src={image.src}
                alt={`${alt} ${index + 1}`}
                className={`w-full h-auto object-contain ${
                  index === currentIndex
                    ? loadedImages.has(image.src)
                      ? "opacity-100"
                      : "opacity-0"
                    : "opacity-0 absolute inset-0"
                }`}
                draggable={false}
                loading={priority && index === 0 ? "eager" : "lazy"}
                onLoad={() => {
                  setLoadedImages((prev) => {
                    const newSet = new Set([...prev, image.src]);
                    if (newSet.size === 1) {
                      setIsLoading(false);
                      onLoadComplete?.();
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
              />
            ) : (
              <Image
                key={image.src}
                src={image.src}
                alt={`${alt} ${index + 1}`}
                width={800}
                height={800}
                loading={priority && index === 0 ? undefined : "lazy"}
                priority={priority && index === 0}
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
                      onLoadComplete?.();
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
            )
          )}
        </div>
      )}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={handleBackdropClick}
          onMouseDown={handleBackdropClick}
          onPointerDown={handleBackdropClick}
          onPointerUp={handleBackdropClick}
          onMouseMove={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
        >
          <div
            ref={modalImageRef}
            className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseMove={handleModalMouseMove}
            onPointerMove={(e) => handleModalMouseMove(e as React.MouseEvent<HTMLDivElement>)}
          >
            <img
              src={images[modalIndex]?.src}
              alt={`${alt} ${modalIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              draggable={false}
              loading="eager"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
