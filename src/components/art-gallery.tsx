"use client";

import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import ArtImage from "./art-image";
import ArtImageSequence from "./art-image-sequence";
import type { ArtSection, ArtImage as ArtImageType } from "@/data/art";

type ArtGalleryProps = {
  sections: ArtSection[];
};

// Helper function to identify image sequences
const getImageSequences = (
  images: ArtImageType[]
): (ArtImageType | ArtImageType[])[] => {
  const sequences: (ArtImageType | ArtImageType[])[] = [];
  const processed = new Set<string>();
  const sequenceMap = new Map<string, ArtImageType[]>();

  const addSequenceByFilenames = (filenames: string[]) => {
    const sequence = filenames
      .map((filename) => images.find((img) => img.src.includes(filename)))
      .filter((img): img is ArtImageType => Boolean(img));
    if (sequence.length === filenames.length) {
      sequence.forEach((img) => sequenceMap.set(img.src, sequence));
    }
  };

  addSequenceByFilenames(["bridge-1.PNG", "bridge-2.PNG", "bridge-3.PNG", "bridge-4.PNG"]);

  // addSequenceByFilenames([
  //   "beaver-icons/beaver-cool-normal.PNG",
  //   "beaver-icons/beaver-cool-glasses.PNG",
  //   "beaver-icons/beaver-cool-shades.PNG",
  //   "beaver-icons/beaver-cool-bow.PNG",
  //   "beaver-icons/beaver-warm-normal.PNG",
  //   "beaver-icons/beaver-warm-glasses.PNG",
  //   "beaver-icons/beaver-warm-shades.PNG",
  //   "beaver-icons/beaver-warm-bow.PNG",
  // ]);
  // addSequenceByFilenames([
  //   "beaver-sprites/sprites-cool-normal.PNG",
  //   "beaver-sprites/sprites-cool-glasses.PNG",
  //   "beaver-sprites/sprites-cool-shades.PNG",
  //   "beaver-sprites/sprites-cool-bow.PNG",
  //   "beaver-sprites/sprites-warm-normal.PNG",
  //   "beaver-sprites/sprites-warm-glasses.PNG",
  //   "beaver-sprites/sprites-warm-shades.PNG",
  //   "beaver-sprites/sprites-warm-bow.PNG",
  // ]);
  // addSequenceByFilenames([
  //   "pixel-fish/fish-normal-1.PNG",
  //   "pixel-fish/fish-normal-2.PNG",
  //   "pixel-fish/fish-annoyed-1.PNG",
  //   "pixel-fish/fish-annoyed-2.PNG",
  //   "pixel-fish/fish-sleep-1.PNG",
  //   "pixel-fish/fish-sleep-2.PNG",
  // ]);

  addSequenceByFilenames([
    "hack26-prospectus-01.png",
    "hack26-prospectus-02.png",
    "hack26-prospectus-03.png",
    "hack26-prospectus-04.png",
    "hack26-prospectus-05.png",
    "hack26-prospectus-06.png",
    "hack26-prospectus-07.png",
    "hack26-prospectus-08.png",
    "hack26-prospectus-09.png",
  ]);
  addSequenceByFilenames([
    "bp26-crewneck-blue.png",
    "bp26-crewneck-tan.png",
  ]);
  addSequenceByFilenames([
    "check-first-place.png",
    "check-second-place.png",
    "check-third-place.png",
    "check-beginner.png",
  ]);
  addSequenceByFilenames([
    "hack-vertical.png",
    "hacker-check-in.png",
    "mentor-sponsor-check-in.png",
  ]);
  addSequenceByFilenames([
    "splash-main.png",
    "splash-tracks.png",
    "splash-end.png",
  ]);
  addSequenceByFilenames(["tote-light.jpeg", "tote-dark.jpeg"]);
  addSequenceByFilenames([
    "hack25-playing-cards-1.jpeg",
    "hack25-playing-cards-2.jpeg",
  ]);
  addSequenceByFilenames([
    "greek-corinthian.PNG",
    "greek-ionic.PNG",
    "greek-doric.PNG",
  ]);

  images.forEach((image) => {
    if (processed.has(image.src)) return;
    const sequence = sequenceMap.get(image.src);
    if (sequence) {
      sequences.push(sequence);
      sequence.forEach((img) => processed.add(img.src));
      return;
    }
    sequences.push(image);
    processed.add(image.src);
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

  const toSectionId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  // Helper function to get column count based on screen size
  const getColumnCount = (imageCount: number) => {
    if (imageCount <= 1) return 1;
    if (imageCount === 2) return 2;

    if (windowWidth === 0) return 2; // SSR/default

    if (windowWidth >= 1024) return 4; // lg+
    if (windowWidth >= 768) return 3; // md
    return 2; // sm + mobile
  };

  return (
    <div className="space-y-16">
      {sections.map((section, sectionIndex) => {
        // Compute sequences for direct images if they exist
        const sectionSequences = section.images
          ? getImageSequences(section.images)
          : null;

        return (
          <div
            key={sectionIndex}
            id={toSectionId(section.name)}
            className="space-y-8"
          >
            {/* Section Header */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="art-section-header">{formatName(section.name)}</h2>
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
                      <h3 className="art-subsection-header text-gray-600 font-medium">
                        {subsection.name}
                      </h3>

                      {/* Masonry Layout */}
                      <Masonry
                        breakpointCols={getColumnCount(
                          subsectionSequences.length
                        )}
                        className="masonry-grid"
                        columnClassName="masonry-grid_column"
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
                      </Masonry>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* If section has direct images */
              sectionSequences && (
                <Masonry
                  breakpointCols={getColumnCount(sectionSequences.length)}
                  className="masonry-grid"
                  columnClassName="masonry-grid_column"
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
                </Masonry>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
