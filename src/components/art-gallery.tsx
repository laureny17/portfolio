"use client";

import { useState, useEffect } from "react";
import ArtImage from "./art-image";
import ArtImageSequence from "./art-image-sequence";
import type { ArtSection, ArtImage as ArtImageType } from "@/data/art";

type ArtGalleryProps = {
  sections: ArtSection[];
};

// Helper function to filter out hidden images
const filterVisibleImages = (images: ArtImageType[]): ArtImageType[] => {
  return images.filter((img) => !img.hidden);
};

// Helper function to identify image sequences
const getImageSequences = (
  images: ArtImageType[]
): (ArtImageType | ArtImageType[])[] => {
  // Filter out hidden images first
  const visibleImages = filterVisibleImages(images);
  const sequences: (ArtImageType | ArtImageType[])[] = [];
  const processed = new Set<string>();

  // Extract bridge images
  const bridgeImages = visibleImages
    .filter((img) => /bridge-\d+\.(PNG|png)/i.test(img.src))
    .sort((a, b) => {
      const numA = parseInt(a.src.match(/bridge-(\d+)/i)?.[1] || "0");
      const numB = parseInt(b.src.match(/bridge-(\d+)/i)?.[1] || "0");
      return numA - numB;
    });
  if (bridgeImages.length >= 4) {
    sequences.push(bridgeImages);
    bridgeImages.forEach((img) => processed.add(img.src));
  }

  // Extract beaver icons
  const beaverIcons = visibleImages
    .filter(
      (img) =>
        img.src.includes("beaver-icons/beaver-") &&
        /beaver-(cool|warm)-(bow|glasses|normal|shades)\.(PNG|png)/i.test(
          img.src
        )
    )
    .sort((a, b) => {
      // Sort by cool/warm, then by type
      const aMatch = a.src.match(
        /beaver-(cool|warm)-(bow|glasses|normal|shades)/i
      );
      const bMatch = b.src.match(
        /beaver-(cool|warm)-(bow|glasses|normal|shades)/i
      );
      if (!aMatch || !bMatch) return 0;
      const order = ["cool", "warm"];
      const typeOrder = ["normal", "glasses", "shades", "bow"];
      const aTemp = order.indexOf(aMatch[1]);
      const bTemp = order.indexOf(bMatch[1]);
      if (aTemp !== bTemp) return aTemp - bTemp;
      return typeOrder.indexOf(aMatch[2]) - typeOrder.indexOf(bMatch[2]);
    });
  if (beaverIcons.length >= 8) {
    sequences.push(beaverIcons);
    beaverIcons.forEach((img) => processed.add(img.src));
  }

  // Extract beaver sprites
  const beaverSprites = visibleImages
    .filter(
      (img) =>
        img.src.includes("beaver-sprites/sprites-") &&
        /sprites-(cool|warm)-(bow|glasses|normal|shades)\.(PNG|png)/i.test(
          img.src
        )
    )
    .sort((a, b) => {
      const aMatch = a.src.match(
        /sprites-(cool|warm)-(bow|glasses|normal|shades)/i
      );
      const bMatch = b.src.match(
        /sprites-(cool|warm)-(bow|glasses|normal|shades)/i
      );
      if (!aMatch || !bMatch) return 0;
      const order = ["cool", "warm"];
      const typeOrder = ["normal", "glasses", "shades", "bow"];
      const aTemp = order.indexOf(aMatch[1]);
      const bTemp = order.indexOf(bMatch[1]);
      if (aTemp !== bTemp) return aTemp - bTemp;
      return typeOrder.indexOf(aMatch[2]) - typeOrder.indexOf(bMatch[2]);
    });
  if (beaverSprites.length >= 8) {
    sequences.push(beaverSprites);
    beaverSprites.forEach((img) => processed.add(img.src));
  }

  // Extract pixel fish
  const fishImages = visibleImages
    .filter(
      (img) =>
        img.src.includes("pixel-fish/fish-") &&
        /fish-(annoyed|normal|sleep)-\d+\.(PNG|png)/i.test(img.src)
    )
    .sort((a, b) => {
      const aMatch = a.src.match(/fish-(annoyed|normal|sleep)-(\d+)/i);
      const bMatch = b.src.match(/fish-(annoyed|normal|sleep)-(\d+)/i);
      if (!aMatch || !bMatch) return 0;
      const typeOrder = ["normal", "annoyed", "sleep"];
      const aType = typeOrder.indexOf(aMatch[1]);
      const bType = typeOrder.indexOf(bMatch[1]);
      if (aType !== bType) return aType - bType;
      return parseInt(aMatch[2]) - parseInt(bMatch[2]);
    });
  if (fishImages.length >= 6) {
    sequences.push(fishImages);
    fishImages.forEach((img) => processed.add(img.src));
  }

  // Add remaining images as singles
  visibleImages.forEach((image) => {
    if (!processed.has(image.src)) {
      sequences.push(image);
    }
  });

  return sequences;
};

export default function ArtGallery({ sections }: ArtGalleryProps) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to get column count based on screen size
  const getColumnCount = (imageCount: number, width: number) => {
    if (imageCount <= 1) return 1;
    if (imageCount === 2) return 2;
    if (width >= 1024) return 5; // lg
    if (width >= 768) return 4; // md
    if (width >= 640) return 3; // sm
    return 2; // mobile
  };

  // Helper function to get column classes and styles based on image count
  const getColumnConfig = (imageCount: number) => {
    const columnCount =
      windowWidth > 0
        ? getColumnCount(imageCount, windowWidth)
        : imageCount <= 1
        ? 1
        : 2;

    if (imageCount <= 1) {
      return {
        classes: "columns-1",
        style: { columnCount: 1 },
      };
    } else if (imageCount === 2) {
      return {
        classes: "columns-2 sm:columns-2",
        style: { columnCount: 2 },
      };
    } else {
      return {
        classes: "columns-2 sm:columns-3 md:columns-4 lg:columns-5",
        style: { columnCount },
      };
    }
  };

  return (
    <div className="space-y-16">
      {sections.map((section, sectionIndex) => {
        // Compute sequences for direct images if they exist
        const sectionSequences = section.images
          ? getImageSequences(section.images)
          : null;

        return (
          <div key={sectionIndex} className="space-y-8">
            {/* Section Header */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl">
                {formatName(section.name)}
              </h2>
            </div>

            {/* Special handling for Animation section */}
            {section.name === "Animation" ? (
              <ul className="text-xs sm:text-xs md:text-sm lg:text-base text-gray-600 font-medium list-disc pl-6 space-y-2">
                <li>
                  <span>A music video explaining Stargardt disease: </span>
                  <a
                    href="https://youtu.be/5ML7prwZ5g4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 underline underline-offset-2 hover-body-link"
                  >
                    https://youtu.be/5ML7prwZ5g4
                  </a>
                </li>
                <li>
                  <span>
                    17-year-old me calculates the volume of my dog using triple
                    integrals:{" "}
                  </span>
                  <a
                    href="https://youtu.be/5-UyWwG1TGI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 underline underline-offset-2 hover-body-link"
                  >
                    https://youtu.be/5-UyWwG1TGI
                  </a>
                </li>
              </ul>
            ) : section.subsections ? (
              <div className="space-y-12">
                {section.subsections.map((subsection, subsectionIndex) => {
                  // Regular image gallery for other sections
                  const subsectionSequences = getImageSequences(
                    subsection.images
                  );
                  return (
                    <div key={subsectionIndex} className="space-y-4">
                      {/* Subsection Header */}
                      <h3 className="text-base sm:text-base md:text-lg lg:text-xl text-gray-600 font-medium">
                        {subsection.name}
                      </h3>

                      {/* Masonry Layout */}
                      {(() => {
                        const config = getColumnConfig(
                          subsectionSequences.length
                        );
                        const cols = Math.max(2, config.style.columnCount || 2);
                        return (
                          <div
                            className="w-full"
                            style={
                              {
                                "--column-count": cols,
                                columnCount: `var(--column-count, ${cols})`,
                                WebkitColumnCount: cols,
                                MozColumnCount: cols,
                                columnGap: "1rem",
                                columnFill: "auto",
                                display: "block",
                              } as React.CSSProperties & {
                                "--column-count": number;
                              }
                            }
                          >
                            {subsectionSequences.map((item, itemIndex) =>
                              Array.isArray(item) ? (
                                <ArtImageSequence
                                  key={`sequence-${itemIndex}`}
                                  images={item}
                                  alt={formatName(subsection.name)}
                                />
                              ) : (
                                <ArtImage key={itemIndex} image={item} />
                              )
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* If section has direct images */
              sectionSequences &&
              (() => {
                const config = getColumnConfig(sectionSequences.length);
                const cols = Math.max(2, config.style.columnCount || 2);
                return (
                  <div
                    className="w-full"
                    style={
                      {
                        "--column-count": cols,
                        columnCount: `var(--column-count, ${cols})`,
                        WebkitColumnCount: cols,
                        MozColumnCount: cols,
                        columnGap: "1rem",
                        columnFill: "auto",
                        display: "block",
                      } as React.CSSProperties & { "--column-count": number }
                    }
                  >
                    {sectionSequences.map((item, itemIndex) =>
                      Array.isArray(item) ? (
                        <ArtImageSequence
                          key={`sequence-${itemIndex}`}
                          images={item}
                          alt={formatName(section.name)}
                        />
                      ) : (
                        <ArtImage key={itemIndex} image={item} />
                      )
                    )}
                  </div>
                );
              })()
            )}
          </div>
        );
      })}
    </div>
  );
}
