import type { Card } from "@/components/card";

export const projects: Card[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description:
      "A personal portfolio website built with Next.js and Tailwind CSS, featuring a clean and modern design.",
    image: ["/assets/portfolio.png"],
    tags: ["web", "next.js", "tailwind"],
    isComplete: true,
  },
  {
    id: 2,
    title: "Game Project",
    description:
      "An interactive game built with Unity, showcasing creative gameplay mechanics and visual design.",
    image: ["/assets/game.png"],
    tags: ["game", "unity", "c#"],
    isComplete: true,
  },
  {
    id: 3,
    title: "Art Project",
    description:
      "A digital art project exploring creative expression through code and visual design.",
    image: ["/assets/art.png"],
    tags: ["art", "creative", "digital"],
    isComplete: true,
  },
  // Add more projects as needed
];
