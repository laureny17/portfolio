"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Card = {
  id: number;
  title: string;
  description: string;
  image: string[];
  tags: string[];
  isComplete: boolean;
};

const Card = ({ card, className = "" }: { card: Card; className?: string }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mediaWidth, setMediaWidth] = useState(0);
  const [videoFailed, setVideoFailed] = useState<Record<string, boolean>>({});

  // detect if the image is a video
  const isVideo = (src: string | undefined) => {
    if (!src) return false;
    return (
      src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov")
    );
  };

  // Get a fallback image for a video (mobile)
  const getVideoFallback = (videoSrc: string) => {
    // png version is fallback image
    const pngVersion = videoSrc.replace(/.mp4$/, ".png");
    return pngVersion;
  };

  // update media width when card size changes
  useEffect(() => {
    if (!cardRef.current) return;

    const updateMediaWidth = () => {
      if (cardRef.current) {
        // Get the card's content width w/o padding
        const cardWidth = cardRef.current.clientWidth;
        const newMediaWidth = Math.floor(cardWidth * 0.8);
        setMediaWidth(newMediaWidth);
      }
    };

    // initial measurement
    updateMediaWidth();

    // set up resize observer to detect changes in card size
    const resizeObserver = new ResizeObserver(updateMediaWidth);
    resizeObserver.observe(cardRef.current);

    return () => {
      if (cardRef.current) {
        resizeObserver.unobserve(cardRef.current);
      }
    };
  }, []);

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % card.image.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + card.image.length) % card.image.length);
  };

  useEffect(() => {
    if (
      Array.isArray(card.image) &&
      card.image.length > 1 &&
      !isVideo(card.image[imageIndex])
    ) {
      const interval = setInterval(() => {
        nextImage();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [card.image, imageIndex]);

  // Handle video error
  const handleVideoError = (src: string) => {
    console.log("Video failed to load:", src);
    setVideoFailed((prev) => ({
      ...prev,
      [src]: true,
    }));
  };

  // Check if we're on iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  // Handle image error - try PNG if JPG fails
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    videoSrc: string
  ) => {
    const imgElement = e.currentTarget;
    if (imgElement.src.endsWith(".jpg")) {
      // If jpg failed, try png
      const pngVersion = videoSrc.replace(/\.(mp4|webm|mov)$/, ".png");
      imgElement.src = pngVersion;
    } else if (imgElement.src.endsWith(".png")) {
      // If png also failed, use placeholder
      imgElement.src = "/placeholder.svg?height=200&width=300";
    }
  };

  return (
    <div className={`px-3 sm:px-4 ${className}`}>
      <div
        ref={cardRef}
        className="rounded-3xl p-4 sm:p-6 md:p-8 bg-white flex flex-col"
      >
        {card.image && (
          <div className="mb-6 mx-auto flex flex-col items-center justify-center w-full">
            {/* Media container */}
            <div
              className="flex items-center justify-center"
              style={{
                width: "100%",
                maxWidth: mediaWidth > 0 ? `${mediaWidth}px` : "100%",
              }}
            >
              {isVideo(card.image[imageIndex]) &&
              !videoFailed[card.image[imageIndex]] &&
              !isIOS ? (
                <div
                  className="rounded-md overflow-hidden"
                  style={{ maxHeight: "200px" }}
                >
                  <video
                    src={card.image[imageIndex]}
                    poster={getVideoFallback(card.image[imageIndex])}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-contain max-h-[200px]"
                    onError={() => handleVideoError(card.image[imageIndex])}
                  />
                </div>
              ) : (
                <div
                  className="rounded-md overflow-hidden"
                  style={{ maxHeight: "200px" }}
                >
                  <Image
                    src={
                      isVideo(card.image[imageIndex])
                        ? getVideoFallback(card.image[imageIndex])
                        : card.image[imageIndex] || "/assets/Star.svg"
                    }
                    alt={card.title}
                    width={mediaWidth || 300}
                    height={Math.floor((mediaWidth || 300) * 0.6)}
                    className="object-contain transition-transform hover:scale-105 duration-300 max-h-[200px]"
                    onError={(e) => {
                      if (isVideo(card.image[imageIndex])) {
                        handleImageError(e, card.image[imageIndex]);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Navigation arrows - only show if multiple images */}
            {card.image.length > 1 && (
              <div className="w-full flex items-center justify-between mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="text-[var(--black)] text-xl font-bold"
                  aria-label="Previous image"
                >
                  {"←"}
                </button>
                <div className="text-xs text-gray-500">
                  {imageIndex + 1}/{card.image.length}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="text-[var(--black)] text-xl font-bold"
                  aria-label="Next image"
                >
                  {"→"}
                </button>
              </div>
            )}
          </div>
        )}

        <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl pb-3 italic">
          {card.title}
        </p>
        <p className="text-sm sm:text-base md:text-base lg:text-base pb-4">
          {card.description}
        </p>

        {/* tags */}
        <div className="flex flex-wrap gap-2 mt-auto mb-1">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs sm:text-xs md:text-xs lg:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-[var(--accent)] text-[var(--black)] rounded-full"
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
