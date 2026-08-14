// ============================================
// ART IMAGE REGISTRY
// ============================================
// Ccentral control center for all art images!
//
// HOW TO USE:
// 1. To ADD a new image: Add it to this registry with a unique ID
// 2. To REMOVE an image: Delete the entry
//
// Then reference images by their ID in art.ts
// ============================================

export type ArtImageData = {
  id: string; // Unique identifier
  src: string; // Image path
  alt: string; // Alt text
  link?: string; // Optional link URL (e.g., YouTube video)
};

// All your art images in one place!
export const artImages: Record<string, ArtImageData> = {
  // 21T.121, Spring 2026
  "s26-bag": {
    id: "s26-bag",
    src: "/assets/art/21T.121-S26/bag.jpeg",
    alt: "Bag",
  },
  "s26-bp-setup": {
    id: "s26-bp-setup",
    src: "/assets/art/21T.121-S26/bp-setup.jpeg",
    alt: "BP Setup",
  },
  "s26-jug": {
    id: "s26-jug",
    src: "/assets/art/21T.121-S26/jug.jpeg",
    alt: "Jug",
  },
  "s26-model-1": {
    id: "s26-model-1",
    src: "/assets/art/21T.121-S26/model-1.jpeg",
    alt: "Model 1",
  },
  "s26-model-2a": {
    id: "s26-model-2a",
    src: "/assets/art/21T.121-S26/model-2a.jpeg",
    alt: "Model 2a",
  },
  "s26-model-2b": {
    id: "s26-model-2b",
    src: "/assets/art/21T.121-S26/model-2b.jpeg",
    alt: "Model 2b",
  },
  "s26-perfumes": {
    id: "s26-perfumes",
    src: "/assets/art/21T.121-S26/perfumes.jpeg",
    alt: "Perfumes",
  },
  "s26-replica": {
    id: "s26-replica",
    src: "/assets/art/21T.121-S26/replica.jpeg",
    alt: "Replica",
  },
  "s26-scarf": {
    id: "s26-scarf",
    src: "/assets/art/21T.121-S26/scarf.jpeg",
    alt: "Scarf",
  },
  "s26-skelly": {
    id: "s26-skelly",
    src: "/assets/art/21T.121-S26/skelly.jpeg",
    alt: "Skelly",
  },
  "s26-zeus": {
    id: "s26-zeus",
    src: "/assets/art/21T.121-S26/zeus.jpeg",
    alt: "Zeus",
  },

  // Digital Paintings - Portfolio 2023
  "sip-clouds": {
    id: "sip-clouds",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-clouds.PNG",
    alt: "SIP Clouds",
  },
  "sip-field": {
    id: "sip-field",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-field.PNG",
    alt: "SIP Field",
  },
  "sip-lake": {
    id: "sip-lake",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-lake.PNG",
    alt: "SIP Lake",
  },
  "sip-sunset": {
    id: "sip-sunset",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-sunset.PNG",
    alt: "SIP Sunset",
  },
  "sip-swirl": {
    id: "sip-swirl",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-swirl.PNG",
    alt: "SIP Swirl",
  },
  "sip-woods": {
    id: "sip-woods",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-woods.PNG",
    alt: "SIP Woods",
  },

  // Digital Paintings - Misc
  "sky-cotl": {
    id: "sky-cotl",
    src: "/assets/art/digital-paintings/misc/sky-cotl.PNG",
    alt: "Sky COTL",
  },
  "arcane-style-study": {
    id: "arcane-style-study",
    src: "/assets/art/digital-paintings/misc/arcane-style-study.jpg",
    alt: "Arcane Style Study",
  },

  // HackMIT - BP25
  "bp25-banner": {
    id: "bp25-banner",
    src: "/assets/art/hackmit/bp25/bp25-banner.PNG",
    alt: "BP25 Banner",
  },
  "bp25-fb": {
    id: "bp25-fb",
    src: "/assets/art/hackmit/bp25/bp25-fb.PNG",
    alt: "BP25 Facebook",
  },
  "bp25-logo": {
    id: "bp25-logo",
    src: "/assets/art/hackmit/bp25/bp25-logo.PNG",
    alt: "BP25 Logo",
  },
  "bp25-table-sign": {
    id: "bp25-table-sign",
    src: "/assets/art/hackmit/bp25/bp25-table-sign.PNG",
    alt: "BP25 Table Sign",
  },

  // HackMIT - Hack26
  "hack26-tote": {
    id: "hack26-tote",
    src: "/assets/art/hackmit/hack26/hack26-tote.webp",
    alt: "Hack26 Tote",
  },

  // HackMIT - BP26
  "bp26-about-layout": {
    id: "bp26-about-layout",
    src: "/assets/art/hackmit/bp26/bp26-about-layout.png",
    alt: "BP26 About Layout",
  },
  "bp26-crewneck-blue": {
    id: "bp26-crewneck-blue",
    src: "/assets/art/hackmit/bp26/bp26-crewneck-blue.png",
    alt: "BP26 Crewneck Blue",
  },
  "bp26-crewneck-tan": {
    id: "bp26-crewneck-tan",
    src: "/assets/art/hackmit/bp26/bp26-crewneck-tan.png",
    alt: "BP26 Crewneck Tan",
  },

  // HackMIT - Hack25
  "hack25-puzzle": {
    id: "hack25-puzzle",
    src: "/assets/art/hackmit/hack25/hack-25-puzzle-announcement.png",
    alt: "Hack25 Puzzle Announcement",
  },
  "hack25-cards-1": {
    id: "hack25-cards-1",
    src: "/assets/art/hackmit/hack25/hack25-playing-cards-1.jpeg",
    alt: "Hack25 Playing Cards 1",
  },
  "hack25-cards-2": {
    id: "hack25-cards-2",
    src: "/assets/art/hackmit/hack25/hack25-playing-cards-2.jpeg",
    alt: "Hack25 Playing Cards 2",
  },
  "hack25-recruitment": {
    id: "hack25-recruitment",
    src: "/assets/art/hackmit/hack25/hack25-recruitment.png",
    alt: "Hack25 Recruitment",
  },
  "hack26-prospectus-01": {
    id: "hack26-prospectus-01",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-01.png",
    alt: "Hack26 Prospectus 01",
  },
  "hack26-prospectus-02": {
    id: "hack26-prospectus-02",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-02.png",
    alt: "Hack26 Prospectus 02",
  },
  "hack26-prospectus-03": {
    id: "hack26-prospectus-03",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-03.png",
    alt: "Hack26 Prospectus 03",
  },
  "hack26-prospectus-04": {
    id: "hack26-prospectus-04",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-04.png",
    alt: "Hack26 Prospectus 04",
  },
  "hack26-prospectus-05": {
    id: "hack26-prospectus-05",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-05.png",
    alt: "Hack26 Prospectus 05",
  },
  "hack26-prospectus-06": {
    id: "hack26-prospectus-06",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-06.png",
    alt: "Hack26 Prospectus 06",
  },
  "hack26-prospectus-07": {
    id: "hack26-prospectus-07",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-07.png",
    alt: "Hack26 Prospectus 07",
  },
  "hack26-prospectus-08": {
    id: "hack26-prospectus-08",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-08.png",
    alt: "Hack26 Prospectus 08",
  },
  "hack26-prospectus-09": {
    id: "hack26-prospectus-09",
    src: "/assets/art/hackmit/hack25/hack26-prospectus-09.png",
    alt: "Hack26 Prospectus 09",
  },
  "hack25-tote-light": {
    id: "hack25-tote-light",
    src: "/assets/art/hackmit/hack25/tote-light.jpeg",
    alt: "Hack25 Tote Light",
  },
  "hack25-tote-dark": {
    id: "hack25-tote-dark",
    src: "/assets/art/hackmit/hack25/tote-dark.jpeg",
    alt: "Hack25 Tote Dark",
  },
  "hack25-photo-wall": {
    id: "hack25-photo-wall",
    src: "/assets/art/hackmit/hack25/photo-wall.jpeg",
    alt: "Hack25 Photo Wall",
  },
  "hack25-check-first": {
    id: "hack25-check-first",
    src: "/assets/art/hackmit/hack25/check-first-place.png",
    alt: "Hack25 First Place Check",
  },
  "hack25-check-second": {
    id: "hack25-check-second",
    src: "/assets/art/hackmit/hack25/check-second-place.png",
    alt: "Hack25 Second Place Check",
  },
  "hack25-check-third": {
    id: "hack25-check-third",
    src: "/assets/art/hackmit/hack25/check-third-place.png",
    alt: "Hack25 Third Place Check",
  },
  "hack25-check-beginner": {
    id: "hack25-check-beginner",
    src: "/assets/art/hackmit/hack25/check-beginner.png",
    alt: "Hack25 Beginner Check",
  },
  "hack25-hacker-check-in": {
    id: "hack25-hacker-check-in",
    src: "/assets/art/hackmit/hack25/hacker-check-in.png",
    alt: "Hack25 Hacker Check In",
  },
  "hack25-mentor-sponsor-check-in": {
    id: "hack25-mentor-sponsor-check-in",
    src: "/assets/art/hackmit/hack25/mentor-sponsor-check-in.png",
    alt: "Hack25 Mentor Sponsor Check In",
  },
  "hack25-banner-vertical": {
    id: "hack25-banner-vertical",
    src: "/assets/art/hackmit/hack25/hack-vertical.png",
    alt: "Hack25 Vertical Banner",
  },
  "hack25-social-media": {
    id: "hack25-social-media",
    src: "/assets/art/hackmit/hack25/hack25-social-media.png",
    alt: "Hack25 Social Media",
  },
  "hack25-video-cover": {
    id: "hack25-video-cover",
    src: "/assets/art/hackmit/hack25/video-cover.png",
    alt: "Hack25 Video Cover",
  },
  "hack25-splash-main": {
    id: "hack25-splash-main",
    src: "/assets/art/hackmit/hack25/splash-main.png",
    alt: "Hack25 Splash Main",
  },
  "hack25-splash-tracks": {
    id: "hack25-splash-tracks",
    src: "/assets/art/hackmit/hack25/splash-tracks.png",
    alt: "Hack25 Splash Tracks",
  },
  "hack25-splash-end": {
    id: "hack25-splash-end",
    src: "/assets/art/hackmit/hack25/splash-end.png",
    alt: "Hack25 Splash End",
  },

  // Sketches
  "clouds-study": {
    id: "clouds-study",
    src: "/assets/art/sketches/clouds-study.PNG",
    alt: "Clouds Study",
  },
  eyes: {
    id: "eyes",
    src: "/assets/art/sketches/eyes.jpg",
    alt: "Eyes",
  },
  "greek-corinthian": {
    id: "greek-corinthian",
    src: "/assets/art/sketches/greek-corinthian.PNG",
    alt: "Greek Corinthian",
  },
  "greek-doric": {
    id: "greek-doric",
    src: "/assets/art/sketches/greek-doric.PNG",
    alt: "Greek Doric",
  },
  "greek-ionic": {
    id: "greek-ionic",
    src: "/assets/art/sketches/greek-ionic.PNG",
    alt: "Greek Ionic",
  },
  "sketch-cat": {
    id: "sketch-cat",
    src: "/assets/art/sketches/sketch-cat.jpg",
    alt: "Sketch Cat",
  },
  "sketch-dog": {
    id: "sketch-dog",
    src: "/assets/art/sketches/sketch-dog.jpg",
    alt: "Sketch Dog",
  },
  "tori-floor": {
    id: "tori-floor",
    src: "/assets/art/sketches/tori-floor.PNG",
    alt: "Tori Floor",
  },
  "tori-sleep": {
    id: "tori-sleep",
    src: "/assets/art/sketches/tori-sleep.jpg",
    alt: "Tori Sleep",
  },
  jinx: {
    id: "jinx",
    src: "/assets/art/sketches/jinx.jpg",
    alt: "Jinx",
  },
  "pin-girl": {
    id: "pin-girl",
    src: "/assets/art/sketches/pin-girl.jpg",
    alt: "Pin Girl",
  },

  // Traditional
  "bird-dragonfruit": {
    id: "bird-dragonfruit",
    src: "/assets/art/traditional/bird-dragonfruit.jpeg",
    alt: "Bird Dragonfruit",
  },
  "hopper-inspired": {
    id: "hopper-inspired",
    src: "/assets/art/traditional/hopper-inspired.jpeg",
    alt: "Hopper Inspired",
  },
  pot: {
    id: "pot",
    src: "/assets/art/traditional/pot.jpeg",
    alt: "Pot",
  },
  "realism-gloves": {
    id: "realism-gloves",
    src: "/assets/art/traditional/realism-gloves.jpeg",
    alt: "Realism Gloves",
  },
  "dog-tote": {
    id: "dog-tote",
    src: "/assets/art/traditional/dog-tote.jpeg",
    alt: "Dog Tote",
  },
  // Animation
  "dog-calculus": {
    id: "dog-calculus",
    src: "/assets/art/animation/dog-calculus.png",
    alt: "Dog Calculus Animation",
    link: "https://youtu.be/5-UyWwG1TGI",
  },
  stargardt: {
    id: "stargardt",
    src: "/assets/art/animation/stargardt.png",
    alt: "Stargardt Animation",
    link: "https://youtu.be/5ML7prwZ5g4",
  },
};

// Helper function to get images by IDs
export const getImagesByIds = (ids: string[]): ArtImageData[] => {
  return ids.map((id) => artImages[id]).filter((img) => Boolean(img));
};

// Helper function to get a single image by ID
export const getImageById = (id: string): ArtImageData | undefined => {
  return artImages[id];
};
