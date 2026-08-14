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
  isTeam?: boolean;
  roleLabel?: string; // custom badge instead of/alongside "Team", e.g. "UROP", "Internship"
  githubUrl?: string; // link to the project's GitHub repo, if public
  githubUnavailableReason?: string; // shown (greyed out) instead of the link when githubUrl isn't set
  deployedUrl?: string; // link to the live/deployed project, if hosted anywhere and shareable
  deployedUnavailableReason?: string; // shown (greyed out) when the project is deployed but the link isn't shared
  devpostUrl?: string; // link to the project's Devpost submission, if it has one
  devpostUnavailableReason?: string; // shown (greyed out) when there's no Devpost submission to link
  labUrl?: string; // link to an external project/publication/lab page, if any
  labUnavailableReason?: string; // shown (greyed out) when there's no external page to link
};

const GithubIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.284-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.303-5.467-1.334-5.467-5.933 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.628-5.48 5.922.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.29 0 .32.192.694.8.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"
    />
  </svg>
);

const ExternalLinkIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const DevpostIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 44 29" className={className} aria-hidden="true">
    <polygon
      points="35.936 0 29.552 0 37.616 13.997 29.552 28.018 35.936 28.018 44 13.997"
      fill="currentColor"
    />
    <polygon
      points="8.064 0 14.448 0 6.384 13.997 14.448 28.018 8.064 28.018 0 13.997"
      fill="currentColor"
    />
    <polygon
      points="12.048 28.018 3.984 13.997 12.048 0 31.952 0 40.016 13.997 31.952 28.018"
      fill="currentColor"
    />
    <path
      d="M20.208,22.51 L15.12,22.51 L15.12,5.507 L20.424,5.507 C25.272,5.507 28.872,7.792 28.872,14.021 C28.872,19.985 24.552,22.51 20.208,22.51 Z M20.328,8.802 L18.528,8.802 L18.528,19.192 L20.208,19.192 C23.76,19.192 25.392,17.099 25.392,13.997 C25.392,10.534 23.904,8.802 20.328,8.802 Z"
      fill="white"
    />
  </svg>
);

const GlobeIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconUnavailable = ({
  icon,
  reason,
  label,
}: {
  icon: React.ReactNode;
  reason: string;
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-label={label}
        className="block cursor-not-allowed opacity-30"
      >
        {icon}
      </button>
      {open && (
        <div
          role="tooltip"
          className="icon-tooltip absolute bottom-full left-0 mb-2 w-48 rounded-lg bg-white text-[var(--black)] border border-gray-200 text-xs px-3 py-2 shadow-lg z-20"
        >
          {reason}
        </div>
      )}
    </div>
  );
};

const Card = ({ card, className = "" }: { card: Card; className?: string }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // below sm (640px), image cycling is disabled: only the first image is shown
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // navigator/window aren't available during SSR, so this has to run client-side only
  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream
    );
  }, []);

  useEffect(() => {
    if (isMobile) setImageIndex(0);
  }, [isMobile]);

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

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % card.image.length);
  };

  useEffect(() => {
    if (
      !isMobile &&
      Array.isArray(card.image) &&
      card.image.length > 1 &&
      !isVideo(card.image[imageIndex])
    ) {
      const interval = setInterval(() => {
        nextImage();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [card.image, imageIndex, isMobile]);

  // Handle video error
  const handleVideoError = (src: string) => {
    console.log("Video failed to load:", src);
    setVideoFailed((prev) => ({
      ...prev,
      [src]: true,
    }));
  };


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
    <div className={className}>
      <div
        className="rounded-3xl px-3 min-[400px]:px-4 sm:px-6 md:px-8 py-8 bg-white flex flex-col"
      >
        {card.image && (
          <div className="mb-6 mx-auto flex flex-col items-center justify-center w-full">
            {/* Media container */}
            <div
              className={`flex items-center justify-center ${
                !isMobile && card.image.length > 1 ? "cursor-pointer" : ""
              }`}
              style={{ width: "100%" }}
              onClick={
                !isMobile && card.image.length > 1
                  ? (e) => {
                      e.stopPropagation();
                      nextImage();
                    }
                  : undefined
              }
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
                <div className="relative rounded-md overflow-hidden w-full aspect-[16/9]">
                  <Image
                    src={
                      isVideo(card.image[imageIndex])
                        ? getVideoFallback(card.image[imageIndex])
                        : card.image[imageIndex] || "/assets/Icon.svg"
                    }
                    alt={card.title}
                    fill
                    className="object-contain transition-transform hover:scale-102 duration-300"
                    onError={(e) => {
                      if (isVideo(card.image[imageIndex])) {
                        handleImageError(e, card.image[imageIndex]);
                      }
                    }}
                  />
                </div>
              )}
            </div>

          </div>
        )}

        <div className="pb-3">
          <p className="card-title text-lg sm:text-xl md:text-2xl lg:text-2xl italic">
            {card.title}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {card.githubUrl ? (
              <a
                href={card.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${card.title} on GitHub`}
                title="View on GitHub"
                className="hover:opacity-70 transition-opacity"
              >
                <GithubIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            ) : (
              <IconUnavailable
                icon={<GithubIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                reason={card.githubUnavailableReason || "GitHub link not available"}
                label="GitHub repo not available"
              />
            )}
            {card.devpostUrl ? (
              <a
                href={card.devpostUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${card.title} on Devpost`}
                title="View on Devpost"
                className="hover:opacity-70 transition-opacity"
              >
                <DevpostIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            ) : (
              card.devpostUnavailableReason && (
                <IconUnavailable
                  icon={<DevpostIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                  reason={card.devpostUnavailableReason}
                  label="Devpost link not available"
                />
              )
            )}
            {card.labUrl ? (
              <a
                href={card.labUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View project page for ${card.title}`}
                title="View project page"
                className="hover:opacity-70 transition-opacity"
              >
                <GlobeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            ) : (
              card.labUnavailableReason && (
                <IconUnavailable
                  icon={<GlobeIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                  reason={card.labUnavailableReason}
                  label="Project page not available"
                />
              )
            )}
            {card.deployedUrl ? (
              <a
                href={card.deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View live deployment of ${card.title}`}
                title="View live"
                className="hover:opacity-70 transition-opacity"
              >
                <ExternalLinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            ) : (
              card.deployedUnavailableReason && (
                <IconUnavailable
                  icon={<ExternalLinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                  reason={card.deployedUnavailableReason}
                  label="Live link not available"
                />
              )
            )}
          </div>
        </div>
        <p className="text-xs sm:text-base md:text-base lg:text-base pb-4 hyphens-auto card-description">
          {card.description}
        </p>

        {/* tags - badges, sm screens and up */}
        <div className="hidden sm:flex flex-wrap gap-2 mt-auto mb-1">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs sm:text-xs md:text-xs lg:text-sm px-3 py-0.5 bg-[var(--accent)] text-[var(--black)] rounded-full"
            >
              {tag}
            </span>
          ))}
          {!card.isComplete && (
            <span className="text-xs sm:text-xs md:text-xs lg:text-sm px-3 py-0.5 text-[var(--black)] rounded-full border-2 border-[var(--accent)]">
              WIP
            </span>
          )}
          {card.isTeam && (
            <span className="text-xs sm:text-xs md:text-xs lg:text-sm px-3 py-0.5 text-[var(--black)] rounded-full border-2 border-[var(--accent)]">
              Team
            </span>
          )}
          {card.roleLabel && (
            <span className="text-xs sm:text-xs md:text-xs lg:text-sm px-3 py-0.5 text-[var(--black)] rounded-full border-2 border-[var(--accent)]">
              {card.roleLabel}
            </span>
          )}
        </div>
        {/* tags - plain light-blue text, mobile only */}
        <p className="flex sm:hidden flex-wrap text-xs italic text-[var(--accent2)] mt-auto mb-1 gap-x-1">
          {[
            ...card.tags,
            ...(!card.isComplete ? ["[WIP]"] : []),
            ...(card.isTeam ? ["[Team]"] : []),
            ...(card.roleLabel ? [`[${card.roleLabel}]`] : []),
          ].join(", ")}
        </p>
      </div>
    </div>
  );
};

export default Card;
export type { Card };
