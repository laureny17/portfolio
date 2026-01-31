// ============================================
// ART GALLERY STRUCTURE
// ============================================
// This file defines how your art is organized into sections.
// Images are referenced by their IDs from art-images.ts
//
// To add/remove/hide images, edit art-images.ts instead!
// ============================================

import { getImagesByIds, type ArtImageData } from "./art-images";

export type ArtImage = {
  src: string;
  alt: string;
  hidden?: boolean;
  link?: string;
};

export type ArtSubsection = {
  name: string;
  images: ArtImage[];
};

export type ArtSection = {
  name: string;
  subsections?: ArtSubsection[];
  images?: ArtImage[];
};

// Helper to convert ArtImageData[] to ArtImage[]
const toArtImages = (images: ArtImageData[]): ArtImage[] => {
  return images.map((img) => ({
    src: img.src,
    alt: img.alt,
    hidden: img.hidden,
    link: img.link,
  }));
};

export const artSections: ArtSection[] = [
  {
    name: "Digital Paintings",
    images: toArtImages(
      getImagesByIds([
        // Portfolio 2023
        "sip-clouds",
        "sip-field",
        "sip-lake",
        "sip-sunset",
        "sip-swirl",
        "sip-vines",
        "sip-wings",
        "sip-woods",
        // Misc
        "portrait",
        "sky-cotl",
        "tree",
        "bridge-1",
        "bridge-2",
        "bridge-3",
        "bridge-4",
      ])
    ),
  },
  {
    name: "Sketches",
    images: toArtImages(
      getImagesByIds([
        "clouds-study",
        "eyes",
        "greek-corinthian",
        "greek-doric",
        "greek-ionic",
        "sketch-cat",
        "sketch-dog",
        "tori-floor",
        "tori-sleep",
      ])
    ),
  },
  {
    name: "Traditional",
    images: toArtImages(
      getImagesByIds([
        "bird-dragonfruit",
        "hopper-inspired",
        "pot",
        "realism-gloves",
        "dog-tote",
      ])
    ),
  },
  {
    name: "HackMIT",
    subsections: [
      {
        name: "HackMIT 2025, Marketing Head",
        images: toArtImages(
          getImagesByIds([
            "hack25-splash-main",
            "hack25-splash-tracks",
            "hack25-splash-end",
            "hack25-social-media",
            "hack25-check-first",
            "hack25-check-second",
            "hack25-check-third",
            "hack25-check-beginner",
            "hack25-hacker-check-in",
            "hack25-mentor-sponsor-check-in",
            "hack25-banner-vertical",
            "hack25-recruitment",
            "hack25-video-cover",
            "hack25-puzzle",
            "hack25-tote-dark",
            "hack25-tote-light",
            "hack25-cards-1",
            "hack25-cards-2",
            "hack25-photo-wall",
          ])
        ),
      },
      {
        name: "Blueprint 2025, Marketing",
        images: toArtImages(
          getImagesByIds([
            "bp25-banner",
            "bp25-fb",
            "bp25-logo",
            "bp25-table-sign",
          ])
        ),
      },
      {
        name: "Blueprint 2026, Marketing",
        images: toArtImages(
          getImagesByIds([
            "bp26-about-layout",
            "bp26-crewneck-blue",
            "bp26-crewneck-tan",
          ])
        ),
      },
    ],
  },
  {
    name: "Animation",
  },
];
