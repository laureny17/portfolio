"use client";

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

  addSequenceByFilenames([
    "hack26-prospectus-01.webp",
    "hack26-prospectus-02.webp",
    "hack26-prospectus-03.webp",
    "hack26-prospectus-04.webp",
    "hack26-prospectus-05.webp",
    "hack26-prospectus-06.webp",
    "hack26-prospectus-07.webp",
    "hack26-prospectus-08.webp",
    "hack26-prospectus-09.webp",
  ]);
  addSequenceByFilenames([
    "bp26-crewneck-blue.webp",
    "bp26-crewneck-tan.webp",
  ]);
  addSequenceByFilenames([
    "check-first-place.webp",
    "check-second-place.webp",
    "check-third-place.webp",
    "check-beginner.webp",
  ]);
  addSequenceByFilenames([
    "hack-vertical.webp",
    "hacker-check-in.webp",
    "mentor-sponsor-check-in.webp",
  ]);
  addSequenceByFilenames([
    "splash-main.webp",
    "splash-tracks.webp",
    "splash-end.webp",
  ]);
  addSequenceByFilenames(["tote-light.webp", "tote-dark.webp"]);
  addSequenceByFilenames([
    "hack25-playing-cards-1.webp",
    "hack25-playing-cards-2.webp",
  ]);
  addSequenceByFilenames([
    "greek-corinthian.webp",
    "greek-ionic.webp",
    "greek-doric.webp",
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

type ArtSectionGalleryProps = {
  section: ArtSection;
};

/** One art section's images (or its subsections), as masonry columns. */
export default function ArtSectionGallery({ section }: ArtSectionGalleryProps) {
  const renderMasonry = (images: ArtImageType[], alt: string) => {
    const items = getImageSequences(images);
    return (
      <Masonry
        breakpointCols={2}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {items.map((item, i) => (
          <div
            key={Array.isArray(item) ? `sequence-${i}` : item.src}
            className="reveal"
            style={{ "--i": Math.min(i, 12) } as React.CSSProperties}
          >
            {Array.isArray(item) ? (
              <ArtImageSequence images={item} alt={alt} priority={i < 3} />
            ) : (
              <ArtImage image={item} priority={i < 3} />
            )}
          </div>
        ))}
      </Masonry>
    );
  };

  if (section.name === "Animation") {
    return (
      <ul className="col flex flex-col gap-3">
        <li>
          A music video explaining Stargardt disease.{" "}
          <a
            href="https://youtu.be/5ML7prwZ5g4"
            target="_blank"
            rel="noopener noreferrer"
            className="link muted"
          >
            Watch ↗
          </a>
        </li>
        <li>
          17-year-old me calculates the volume of my dog using triple
          integrals.{" "}
          <a
            href="https://youtu.be/5-UyWwG1TGI"
            target="_blank"
            rel="noopener noreferrer"
            className="link muted"
          >
            Watch ↗
          </a>
        </li>
      </ul>
    );
  }

  if (section.subsections) {
    return (
      <div className="flex flex-col gap-16">
        {section.subsections.map((subsection) => (
          <section key={subsection.name} className="flex flex-col gap-4">
            <h2 className="muted">{subsection.name}</h2>
            {renderMasonry(subsection.images, subsection.name)}
          </section>
        ))}
      </div>
    );
  }

  return section.images ? renderMasonry(section.images, section.name) : null;
}
