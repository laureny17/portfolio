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
  const [modalLoadedImages, setModalLoadedImages] = useState<Set<string>>(
    new Set()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
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
      setIsModalLoading(true);
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

  useEffect(() => {
    if (!isModalOpen) return;
    const src = images[modalIndex]?.src;
    if (!src) return;
    setIsModalLoading(!modalLoadedImages.has(src));
  }, [isModalOpen, modalIndex, images, modalLoadedImages]);

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
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 transition-opacity duration-200 ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
        onMouseDown={handleBackdropClick}
        onPointerDown={handleBackdropClick}
        onPointerUp={handleBackdropClick}
        onMouseMove={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        <div
          ref={modalImageRef}
          className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseMove={handleModalMouseMove}
          onPointerMove={(e) => handleModalMouseMove(e as React.MouseEvent<HTMLDivElement>)}
        >
          {isModalLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <svg
                className="h-16 w-16 star-spin-pause"
                viewBox="0 0 473 466"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M151.1,131.7c12.6-2.2,23.3-10.7,31.3-20.6,8-9.9,13.8-21.3,20.7-32.1,11.3-17.6,25.5-33.4,41.9-46.5,7.8-6.2,16.7-12.1,26.7-12.4,14.4-.4,18.5,5.1,24.4,18.1,5.9,13,10.1,35.4,12.9,49.8,4.7,24.6,11.9,53.7,14.6,64.3.3,1.1,9,15.9,11,17.4,12.2,8.8,20.7,10.4,27,12.4,25.4,8.2,26.9,9.9,52.8,20.5,4.2,1.7,24.2,12.2,26.6,16,4.2,6.4,13.4,14.6,11.7,22-3.9,16.6-20.7,34.1-35.5,41.2-19.9,9.6-46.5,17.6-59.2,32.3-9.5,11.1-6.7,27.3-8.2,41.8-1.5,14.5,1.7,36.8-1.9,53.6-5.3,24.8-11.4,34.6-26,36.4-17.9,2.2-51-36.4-63.3-49.4-21.9-23.1-29-45-61-46.2-16.8-.6-45.9,23.2-61.9,28.2-18.6,5.9-34.2,12.5-53.5,15.3-11.3,1.6-26.3-1.2-35.3-8.1-9.4-7.2-2-29.3,2.2-40.3,6.4-16.8,6.9-16.4,15.4-31.4,7.2-12.7,10.9-18.9,18.8-34.1,2.5-4.8,10.7-17.2,8.9-22.2-6-16.4-28.3-33.6-31.2-37.2-14.5-18.4-39.3-36.8-40.6-54-.3-4.6-1.1-12.5-.2-17,1.5-7.3,15.1-15.9,22.4-17.7,41.6-10,81,4.7,108.3,0h0Z"
                  fill="#c8d7ff"
                  stroke="#c8d7ff"
                  strokeMiterlimit="10"
                  strokeWidth="40"
                />
              </svg>
            </div>
          )}
          <img
            src={images[modalIndex]?.src}
            alt={`${alt} ${modalIndex + 1}`}
            className="relative max-h-[90vh] max-w-[90vw] object-contain rounded-lg z-20"
            draggable={false}
            loading="eager"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onLoad={() => {
              const src = images[modalIndex]?.src;
              if (!src) return;
              setModalLoadedImages((prev) => new Set([...prev, src]));
              setIsModalLoading(false);
            }}
            onError={() => setIsModalLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
