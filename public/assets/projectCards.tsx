type ProjectCard = {
  id: number;
  title: string;
  description: string;
  image: string[];
  tags: string[];
  isComplete: boolean;
};

export const projectCards: ProjectCard[] = [
  {
    id: 1,
    title: "Phabulous Phishes",
    description:
      "An LLM-powered educational platform providing users with simulated phishing content to train their phishing detection skills.",
    image: [],
    tags: [
      "JavaScript",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
      "Sequelize",
    ],
    isComplete: true,
  },
  {
    id: 2,
    title: "Massive Intake of Tap: A Water Tour",
    description:
      "A private water fountain exploration challenge for friends. Track discovered fountains around MIT's campus, rate their freshness and taste to develop your personalized water fountain tier list generated from your reviews, and compete against friends on a personal leaderboard——because hydration should be fun.",
    image: ["/placeholder.svg?height=300&width=500"],
    tags: ["Angular", "Node.js", "Express.js", "MongoDB"],
    isComplete: false,
  },
  {
    id: 3,
    title: "Dam Campus",
    description:
      "An interactive campus map and social networking fusion website. Navigate the halls of MIT's campus with your selected beaver avatar and click on buildings' buttons to view posts from other students about their experiences there!",
    image: ["/placeholder.svg?height=300&width=500"],
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Render"],
    isComplete: true,
  },
  {
    id: 4,
    title: "Desktop Duck",
    description:
      "A small experimental desktop virtual pet app with self-drawn animated assets. The more windows you have open on your screen, the more frantically your duck will move around!",
    image: ["/assets/DesktopDuck.png", "/assets/Clover.svg"],
    tags: ["JavaScript", "Electron"],
    isComplete: true,
  },
  {
    id: 5,
    title: "This Portfolio",
    description: "You are here!",
    image: [
      "/assets/portfolio1.png",
      "/assets/portfolio2.png",
      "/assets/portfolio3.png",
    ],
    tags: ["Typescript", "Next.js", "Tailwind CSS", "Vercel"],
    isComplete: true,
  },
];
