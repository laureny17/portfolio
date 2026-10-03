"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if this is a fish sprite (needs black background)
  const isFishSprite =
    image.src.includes("pixel-fish") || image.src.includes("fish-");
  const bgColor = isFishSprite ? "bg-black" : "bg-white";
  const useNativeImg = image.src.includes("animation/");

  const handleClick = () => {
    if (image.link) {
      window.open(image.link, "_blank", "noopener,noreferrer");
      return;
    }
    if (enableModal) {
      setIsModalLoading(!modalImgRef.current?.complete);
      setIsModalOpen(true);
    }
  };

  const handleBackdropClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
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
      className={`relative overflow-hidden rounded-[3px] block w-full select-none ${bgColor} ${
        image.link ? "cursor-pointer hover:opacity-90 transition-opacity" : "cursor-pointer"
      } transition-opacity duration-300 hover:opacity-90`}
      onClick={handleClick}
    >
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center min-h-[200px] z-10 ${bgColor}`}
        >
          <div className="absolute inset-0 bg-[var(--skeleton)] animate-pulse" />
        </div>
      )}
      {hasError ? (
        <div
          className={`flex items-center justify-center text-[var(--muted)] min-h-[200px] ${bgColor}`}
        >
          <span>Failed to load</span>
        </div>
      ) : (
        <div className={`relative w-full ${bgColor}`}>
          {useNativeImg ? (
            // Use unoptimized img tag for animation/HackMIT images to avoid Next.js optimization issues
            <img
              src={image.src}
              alt={image.alt}
              className={`w-full h-auto object-contain transition-opacity duration-700 ${
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
              width={600}
              height={600}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              className={`w-full h-auto object-contain transition-opacity duration-700 ${
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
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/95 px-4 transition-opacity duration-300 ${
              isModalOpen && !image.link
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={handleBackdropClick}
          >
            {isModalLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none muted" aria-label="loading">
                <span className="tuning-dots text-[20px] tracking-[0.15em]" aria-hidden="true">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            )}
            <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-[3px]">
              <img
                ref={modalImgRef}
                src={image.src}
                alt={image.alt}
                className={`relative max-h-[90vh] max-w-[90vw] object-contain rounded-[3px] z-10 transition-opacity duration-500 ${
                  isModalLoading ? "opacity-0" : "opacity-100"
                }`}
                draggable={false}
                loading="eager"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onLoad={() => setIsModalLoading(false)}
                onError={() => setIsModalLoading(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
