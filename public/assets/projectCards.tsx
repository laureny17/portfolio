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
      "An LLM-powered educational platform providing users with simulated phishing content to train their phishing detection skills. Don't get (ph/f)ished!",
    image: ["/assets/PhishDemo.mp4"],
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
    title: "M(assive) I(ntake) (of) T(ap)",
    description:
      "A water fountain exploration challenge. Rate fountains around MIT's campus to build your tier list, and compete on a personal leaderboard——because hydration should be fun.",
    image: ["/assets/WaterTourDemo.mp4"],
    tags: ["Angular", "Node.js", "Express.js", "MongoDB"],
    isComplete: false,
  },
  {
    id: 3,
    title: "Dam Campus",
    description:
      "An interactive campus map and social networking fusion website. Navigate the halls of MIT's campus with your selected beaver avatar and view building-specific posts from students about their experiences there.",
    image: ["/assets/DamCampusDemo.mp4"],
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Render"],
    isComplete: true,
  },
  {
    id: 4,
    title: "Desktop Duck",
    description:
      "A small experimental desktop virtual pet app with self-drawn animated assets. The more windows you have open on your screen, the more frantically your duck will move around!",
    image: ["/assets/DesktopDuckDemo.mp4"],
    tags: ["JavaScript", "Electron"],
    isComplete: true,
  },
  {
    id: 5,
    title: "This Portfolio!",
    description:
      "Compatible with mobile and made fully responsive to window resizing with Tailwind CSS.",
    // image: ["/assets/PortfolioDemo.mp4"],
    image: [""],
    tags: ["Typescript", "Next.js", "Tailwind CSS", "Vercel"],
    isComplete: true,
  },
];
