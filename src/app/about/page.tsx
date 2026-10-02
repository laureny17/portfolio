import Image from "next/image";
import type { CSSProperties } from "react";

const skillCategories = [
  {
    title: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C#", "C", "Assembly"],
  },
  {
    title: "Frameworks",
    items: [
      "React",
      "Next.js",
      "TanStack Query",
      "Node.js",
      "Express",
      "Fastify",
      "Django",
      "Flask",
      "React Native",
      "Tailwind",
      "Three.js",
      "OpenCV",
      "Electron",
    ],
  },
  {
    title: "Data & infra",
    items: [
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Supabase",
      "Firebase",
      "Apache Spark (SparkSQL)",
      "Presto/Trino",
      "Apache Airflow",
      "Thrift",
      "AWS",
      "Docker",
      "Git",
    ],
  },
  {
    title: "Design",
    items: [
      "Figma",
      "Adobe Illustrator",
      "Adobe After Effects",
      "Adobe Animate",
      "Unity 3D",
    ],
  },
];

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export default function About() {
  return (
    <main className="col flex flex-col gap-14">
      <section className="reveal flex items-center gap-4" style={delay(0)}>
        <Image
          src="/assets/profile/profile-photo.jpeg"
          alt="Lauren"
          width={112}
          height={112}
          className="w-14 h-14 rounded-full object-cover select-none"
          draggable={false}
          priority
        />
        <div className="flex flex-col">
          <span>Lauren Yoo</span>
          <span className="muted">she/her · CS @ MIT, 2027 · New Jersey</span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="reveal flex gap-3" style={delay(1)}>
          <span className="muted tabular-nums">01</span>
          <span>About</span>
        </h2>
        <p className="reveal" style={delay(2)}>
          I like building for social impact. I&apos;m particularly excited by
          computer networks and IoT, game dev and digital media, education, and
          universal design.
        </p>
        <p className="reveal" style={delay(3)}>
          In my free time I draw, paint, and animate; run (!!!); cross more
          books off my reading list (favorite recs:{" "}
          <em>A Thousand Splendid Suns</em>,{" "}
          <em>Everything I Know about Love</em>, <em>Crying in H Mart</em>);
          and work on whatever new project has been plaguing my mind.
        </p>
        <div className="reveal pt-2" style={delay(4)}>
          <Image
            src="/assets/profile/sky-clouds.jpg"
            alt="Sky and clouds drawing"
            width={920}
            height={400}
            sizes="(max-width: 500px) 100vw, 460px"
            className="w-full h-auto max-h-[220px] object-cover rounded-[3px] select-none"
            draggable={false}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="reveal flex gap-3" style={delay(5)}>
          <span className="muted tabular-nums">02</span>
          <span>Tools</span>
        </h2>
        <dl className="flex flex-col gap-3">
          {skillCategories.map((category, i) => (
            <div
              key={category.title}
              className="reveal grid grid-cols-[100px_1fr] gap-4"
              style={delay(6 + i)}
            >
              <dt className="muted">{category.title}</dt>
              <dd>{category.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
