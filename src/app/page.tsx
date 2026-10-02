"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import HeroStar from "@/components/hero-star";
import ProjectItem, { projectSlug } from "@/components/project-item";
import { hiddenProjectIds, projects } from "@/data/projects";

const visibleProjects = projects.filter((p) => !hiddenProjectIds.has(p.id));

export default function Home() {
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(new Set());

  // Deep link: /#pokemon-cry-atlas opens that project
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && visibleProjects.some((p) => projectSlug(p) === hash)) {
      setOpenSlugs(new Set([hash]));
      requestAnimationFrame(() =>
        document.getElementById(hash)?.scrollIntoView({ block: "start" })
      );
    }
  }, []);

  const toggle = useCallback((slug: string) => {
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
        if (window.location.hash === `#${slug}`) {
          history.replaceState(null, "", window.location.pathname);
        }
      } else {
        next.add(slug);
        history.replaceState(null, "", `#${slug}`);
      }
      return next;
    });
  }, []);

  return (
    <main className="col flex flex-col gap-16">
      <section className="relative flex items-start justify-between gap-6">
        <div className="flex flex-col gap-4 max-w-[300px]">
          <p className="reveal" style={{ "--i": 0 } as React.CSSProperties}>
            Hi, I&apos;m Lauren. I study computer science at MIT and I&apos;m
            passionate about building meaningful experiences.
          </p>
          <p className="reveal muted" style={{ "--i": 1 } as React.CSSProperties}>
            I&apos;m especially into networks and IoT, games and digital media,
            education, and universal design. I also draw, paint, and animate;
            some of that lives in{" "}
            <Link href="/art" className="link text-[var(--ink)]">
              art
            </Link>
            .
          </p>
        </div>
        <div className="shrink-0 -mt-6 -mr-4 sm:-mr-2 origin-top-right scale-[0.7] sm:scale-100">
          <HeroStar />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="reveal flex gap-3" style={{ "--i": 2 } as React.CSSProperties}>
          <span className="muted tabular-nums">01</span>
          <span>Projects</span>
        </h2>
        <div className="flex flex-col gap-5">
          {visibleProjects.map((project, i) => {
            const slug = projectSlug(project);
            return (
              <div
                key={project.id}
                className="reveal"
                style={{ "--i": i + 3 } as React.CSSProperties}
              >
                <ProjectItem
                  project={project}
                  open={openSlugs.has(slug)}
                  onToggle={() => toggle(slug)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
