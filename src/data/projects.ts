import type { Card } from "@/components/card";

export const hiddenProjectIds = new Set<number>([]);

export const projects: Card[] = [
  {
    id: 7,
    title: "Pokémon Cry Atlas",
    description:
      "An interactive atlas mapping which Pokémon sound alike—extracts MFCCs from hundreds of Pokémon cries, scores their acoustic similarity, and plots them as an explorable force-directed graph you can filter by generation and type. Sound ON!",
    image: ["/assets/demos/PokeCriesDemo.mp4"],
    githubUrl: "https://github.com/laureny17/poke-cries",
    deployedUrl: "https://poke-cries.onrender.com/",
    tags: ["React", "D3.js", "Python", "Flask", "Librosa"],
    isComplete: true,
  },
  {
    id: 8,
    title: "Step, Step, Learn",
    description:
      "A DDR-inspired dance game that turns any topic into an AI-generated song with choreography synced to the lyrics, then scores you as you step it out on a physical sensor floor. TreeHacks 2026 hardware hack.",
    image: ["/assets/demos/SSLDemo.jpg"],
    githubUrl: "https://github.com/laureny17/JAEL",
    devpostUrl: "https://devpost.com/software/step-step-learn",
    deployedUrl: "https://step-step-learn.onrender.com",
    tags: [
      "React",
      "Three.js",
      "TypeScript",
      "Express.js",
      "Node.js",
      "MongoDB",
      "Python",
      "OpenCV",
      "MediaPipe",
      "Claude SDK",
      "OpenAI",
      "Whisper",
      "Suno",
      "Arduino",
      "C++",
    ],
    isComplete: true,
    isTeam: true,
  },
  {
    id: 6,
    title: "AppReader",
    description:
      "HackMIT's internal application reading and scoring system—the tool our team uses to review, rate, and flag thousands of hacker applications each cycle.",
    image: [""],
    githubUnavailableReason:
      "Private repo—internal HackMIT tool.",
    deployedUnavailableReason:
      "Deployed for internal HackMIT organizers' use only.",
    tags: ["React", "Python", "Flask", "PostgreSQL", "Supabase", "Tailwind CSS"],
    isComplete: true,
    isTeam: false,
  },
  {
    id: 9,
    title: "We're in This Together (WIT)",
    description:
      "A mixed-reality tabletop game where players shape weather systems in real time—heating and cooling air parcels, building pressure systems, and reshaping terrain to control rainfall across a shared physical simulation. Existing STEP Lab project, extended in Unity during a summer UROP. Presented at MIT AI & Education Summit (MIT RAISE) 2025.",
    image: [
      "/assets/demos/WITDemo1.png",
      "/assets/demos/WITDemo2.png",
      "/assets/demos/WITDemo3.png",
    ],
    githubUnavailableReason:
      "Private repo—internal STEP Lab research project.",
    labUrl: "https://education.mit.edu/project/were-in-this-together-wit/",
    roleLabel: "UROP",
    tags: ["Unity", "C#", "Meta Quest 3"],
    isComplete: true,
    isTeam: false,
  },
  {
    id: 1,
    title: "Phabulous Phishes",
    description:
      "An LLM-powered educational platform providing users with simulated phishing content to train their phishing detection skills. HackNYU 2025.",
    image: ["/assets/demos/PhishDemo.mp4"],
    githubUrl: "https://github.com/elainejiangg/hacknyu",
    devpostUrl: "https://devpost.com/software/go-phish-acg0e1",
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
    isTeam: true,
  },
  {
    id: 4,
    title: "Desktop Duck",
    description:
      "A small experimental desktop virtual pet app with self-drawn animated assets. The more windows you have open on your screen, the more frantically your duck will move around!",
    image: ["/assets/demos/DesktopDuckDemo.mp4"],
    githubUrl: "https://github.com/laureny17/desktop-duck",
    tags: ["JavaScript", "Electron"],
    isComplete: true,
  },
];
