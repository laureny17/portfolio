"use client";
import { useCallback, useEffect, useState } from "react";
import ProjectItem, { projectSlug } from "@/components/project-item";
import { hiddenProjectIds, projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

const visibleProjects = projects.filter((p) => !hiddenProjectIds.has(p.id));

export default function Projects() {
  // Only one project open at a time
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Deep link: /projects#pokemon-cry-atlas opens that project
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && visibleProjects.some((p) => projectSlug(p) === hash)) {
      setOpenSlug(hash);
      requestAnimationFrame(() =>
        document.getElementById(hash)?.scrollIntoView({ block: "start" })
      );
    }
  }, []);

  // URL side effects stay out of the state updater: Next.js patches
  // history.replaceState, and calling it mid-render updates its Router.
  const toggle = useCallback(
    (slug: string) => {
      const opening = openSlug !== slug;
      setOpenSlug(opening ? slug : null); // opening one closes any other
      if (opening) {
        history.replaceState(null, "", `#${slug}`);
      } else if (window.location.hash === `#${slug}`) {
        history.replaceState(null, "", window.location.pathname);
      }
    },
    [openSlug]
  );

  return (
    <main className="col flex flex-col gap-16">
      <section className="flex flex-col gap-6">
        <h2 className="reveal flex gap-3" style={{ "--i": 0 } as React.CSSProperties}>
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
                style={{ "--i": i + 1 } as React.CSSProperties}
              >
                <ProjectItem
                  project={project}
                  open={openSlug === slug}
                  onToggle={() => toggle(slug)}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2
          className="reveal flex gap-3"
          style={{ "--i": visibleProjects.length + 1 } as React.CSSProperties}
        >
          <span className="muted tabular-nums">02</span>
          <span>Tools</span>
        </h2>
        <dl className="flex flex-col gap-3">
          {skillCategories.map((category, i) => (
            <div
              key={category.title}
              className="reveal grid grid-cols-[100px_1fr] gap-4"
              style={{ "--i": visibleProjects.length + 2 + i } as React.CSSProperties}
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
