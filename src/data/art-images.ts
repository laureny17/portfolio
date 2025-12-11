// ============================================
// ART IMAGE REGISTRY
// ============================================
// Ccentral control center for all art images!
//
// HOW TO USE:
// 1. To HIDE an image: Set `hidden: true`
// 2. To SHOW an image: Set `hidden: false` or remove the property
// 3. To ADD a new image: Add it to this registry with a unique ID
// 4. To REMOVE an image: Set `hidden: true` or delete the entry
//
// Then reference images by their ID in art.ts
// ============================================

export type ArtImageData = {
  id: string; // Unique identifier
  src: string; // Image path
  alt: string; // Alt text
  hidden?: boolean; // Set to true to hide from gallery
  link?: string; // Optional link URL (e.g., YouTube video)
};

// All your art images in one place!
export const artImages: Record<string, ArtImageData> = {
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
  "sip-vines": {
    id: "sip-vines",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-vines.PNG",
    alt: "SIP Vines",
    hidden: true,
  },
  "sip-wings": {
    id: "sip-wings",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-wings.PNG",
    alt: "SIP Wings",
    hidden: true,
  },
  "sip-woods": {
    id: "sip-woods",
    src: "/assets/art/digital-paintings/portfolio-2023/sip-woods.PNG",
    alt: "SIP Woods",
  },

  // Digital Paintings - Self Portraits
  "portrait-1": {
    id: "portrait-1",
    src: "/assets/art/digital-paintings/self-portraits/portrait-1.PNG",
    alt: "Portrait 1",
  },
  "portrait-2": {
    id: "portrait-2",
    src: "/assets/art/digital-paintings/self-portraits/portrait-2.PNG",
    alt: "Portrait 2",
  },

  // Digital Paintings - Misc
  "bridge-1": {
    id: "bridge-1",
    src: "/assets/art/digital-paintings/misc/bridge-1.PNG",
    alt: "Bridge 1",
  },
  "bridge-2": {
    id: "bridge-2",
    src: "/assets/art/digital-paintings/misc/bridge-2.PNG",
    alt: "Bridge 2",
  },
  "bridge-3": {
    id: "bridge-3",
    src: "/assets/art/digital-paintings/misc/bridge-3.PNG",
    alt: "Bridge 3",
  },
  "bridge-4": {
    id: "bridge-4",
    src: "/assets/art/digital-paintings/misc/bridge-4.PNG",
    alt: "Bridge 4",
  },
  "sky-cotl": {
    id: "sky-cotl",
    src: "/assets/art/digital-paintings/misc/sky-cotl.PNG",
    alt: "Sky COTL",
  },

  // Games - Dam Campus - Beaver Icons
  "beaver-cool-bow": {
    id: "beaver-cool-bow",
    src: "/assets/art/games/beaver-icons/beaver-cool-bow.PNG",
    alt: "Beaver Cool Bow",
  },
  "beaver-cool-glasses": {
    id: "beaver-cool-glasses",
    src: "/assets/art/games/beaver-icons/beaver-cool-glasses.PNG",
    alt: "Beaver Cool Glasses",
  },
  "beaver-cool-normal": {
    id: "beaver-cool-normal",
    src: "/assets/art/games/beaver-icons/beaver-cool-normal.PNG",
    alt: "Beaver Cool Normal",
  },
  "beaver-cool-shades": {
    id: "beaver-cool-shades",
    src: "/assets/art/games/beaver-icons/beaver-cool-shades.PNG",
    alt: "Beaver Cool Shades",
  },
  "beaver-warm-bow": {
    id: "beaver-warm-bow",
    src: "/assets/art/games/beaver-icons/beaver-warm-bow.PNG",
    alt: "Beaver Warm Bow",
  },
  "beaver-warm-glasses": {
    id: "beaver-warm-glasses",
    src: "/assets/art/games/beaver-icons/beaver-warm-glasses.PNG",
    alt: "Beaver Warm Glasses",
  },
  "beaver-warm-normal": {
    id: "beaver-warm-normal",
    src: "/assets/art/games/beaver-icons/beaver-warm-normal.PNG",
    alt: "Beaver Warm Normal",
  },
  "beaver-warm-shades": {
    id: "beaver-warm-shades",
    src: "/assets/art/games/beaver-icons/beaver-warm-shades.PNG",
    alt: "Beaver Warm Shades",
  },

  // Games - Dam Campus - Beaver Misc
  "campus-bg": {
    id: "campus-bg",
    src: "/assets/art/games/beaver-misc/campus-bg.PNG",
    alt: "Campus Background",
  },
  log: {
    id: "log",
    src: "/assets/art/games/beaver-misc/log.PNG",
    alt: "Log",
  },
  "pressure-plate": {
    id: "pressure-plate",
    src: "/assets/art/games/beaver-misc/pressure-plate.PNG",
    alt: "Pressure Plate",
  },

  // Games - Dam Campus - Beaver Sprites
  "sprites-cool-bow": {
    id: "sprites-cool-bow",
    src: "/assets/art/games/beaver-sprites/sprites-cool-bow.PNG",
    alt: "Sprites Cool Bow",
  },
  "sprites-cool-glasses": {
    id: "sprites-cool-glasses",
    src: "/assets/art/games/beaver-sprites/sprites-cool-glasses.PNG",
    alt: "Sprites Cool Glasses",
  },
  "sprites-cool-normal": {
    id: "sprites-cool-normal",
    src: "/assets/art/games/beaver-sprites/sprites-cool-normal.PNG",
    alt: "Sprites Cool Normal",
  },
  "sprites-cool-shades": {
    id: "sprites-cool-shades",
    src: "/assets/art/games/beaver-sprites/sprites-cool-shades.PNG",
    alt: "Sprites Cool Shades",
  },
  "sprites-warm-bow": {
    id: "sprites-warm-bow",
    src: "/assets/art/games/beaver-sprites/sprites-warm-bow.PNG",
    alt: "Sprites Warm Bow",
  },
  "sprites-warm-glasses": {
    id: "sprites-warm-glasses",
    src: "/assets/art/games/beaver-sprites/sprites-warm-glasses.PNG",
    alt: "Sprites Warm Glasses",
  },
  "sprites-warm-normal": {
    id: "sprites-warm-normal",
    src: "/assets/art/games/beaver-sprites/sprites-warm-normal.PNG",
    alt: "Sprites Warm Normal",
  },
  "sprites-warm-shades": {
    id: "sprites-warm-shades",
    src: "/assets/art/games/beaver-sprites/sprites-warm-shades.PNG",
    alt: "Sprites Warm Shades",
  },

  // Games - Phabulous Phishes
  "fish-annoyed-1": {
    id: "fish-annoyed-1",
    src: "/assets/art/games/pixel-fish/fish-annoyed-1.PNG",
    alt: "Fish Annoyed 1",
  },
  "fish-annoyed-2": {
    id: "fish-annoyed-2",
    src: "/assets/art/games/pixel-fish/fish-annoyed-2.PNG",
    alt: "Fish Annoyed 2",
  },
  "fish-normal-1": {
    id: "fish-normal-1",
    src: "/assets/art/games/pixel-fish/fish-normal-1.PNG",
    alt: "Fish Normal 1",
  },
  "fish-normal-2": {
    id: "fish-normal-2",
    src: "/assets/art/games/pixel-fish/fish-normal-2.PNG",
    alt: "Fish Normal 2",
  },
  "fish-sleep-1": {
    id: "fish-sleep-1",
    src: "/assets/art/games/pixel-fish/fish-sleep-1.PNG",
    alt: "Fish Sleep 1",
  },
  "fish-sleep-2": {
    id: "fish-sleep-2",
    src: "/assets/art/games/pixel-fish/fish-sleep-2.PNG",
    alt: "Fish Sleep 2",
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
    src: "/assets/art/hackmit/hack25/check_first_place.png",
    alt: "Hack25 First Place Check",
  },
  "hack25-check-second": {
    id: "hack25-check-second",
    src: "/assets/art/hackmit/hack25/check_second_place.png",
    alt: "Hack25 Second Place Check",
  },
  "hack25-check-third": {
    id: "hack25-check-third",
    src: "/assets/art/hackmit/hack25/check_third_place.png",
    alt: "Hack25 Third Place Check",
  },
  "hack25-check-beginner": {
    id: "hack25-check-beginner",
    src: "/assets/art/hackmit/hack25/check_beginner.png",
    alt: "Hack25 Beginner Check",
  },
  "hack25-banner-hacker-check-in": {
    id: "hack25-banner-hacker-check-in",
    src: "/assets/art/hackmit/hack25/hacker-check-in.png",
    alt: "Hack25 Hacker Check In Banner",
  },
  "hack25-banner-mentor-sponsor-check-in": {
    id: "hack25-banner-mentor-sponsor-check-in",
    src: "/assets/art/hackmit/hack25/mentor-sponsor-check-in.png",
    alt: "Hack25 Mentor Sponsor Check In Banner",
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
  tree: {
    id: "tree",
    src: "/assets/art/sketches/tree.jpeg",
    alt: "Tree",
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

// Helper function to get images by IDs (filters out hidden ones)
export const getImagesByIds = (ids: string[]): ArtImageData[] => {
  return ids.map((id) => artImages[id]).filter((img) => img && !img.hidden);
};

// Helper function to get a single image by ID
export const getImageById = (id: string): ArtImageData | undefined => {
  const img = artImages[id];
  return img && !img.hidden ? img : undefined;
};
