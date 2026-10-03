"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

export const projectSlug = (p: Project) =>
  p.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
const videoPoster = (src: string) => src.replace(/\.(mp4|webm|mov)$/i, ".png");

function Media({ src, alt, playing }: { src: string; alt: string; playing: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only play while the project is open
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  if (isVideo(src) && !videoFailed) {
    return (
      <video
        ref={videoRef}
        src={src}
        poster={videoPoster(src)}
        muted
        loop
        playsInline
        preload="metadata"
        data-loaded={loaded}
        onLoadedData={() => setLoaded(true)}
        onError={() => setVideoFailed(true)}
        className="fade-media w-full rounded-[3px] bg-[#f6f6f7]"
      />
    );
  }

  return (
    <Image
      src={isVideo(src) ? videoPoster(src) : src}
      alt={alt}
      width={920}
      height={520}
      sizes="(max-width: 560px) 100vw, 520px"
      data-loaded={loaded}
      onLoad={() => setLoaded(true)}
      className="fade-media w-full h-auto rounded-[3px] bg-[#f6f6f7]"
      draggable={false}
    />
  );
}

function ProjectLink({
  href,
  unavailableReason,
  label,
}: {
  href?: string;
  unavailableReason?: string;
  label: string;
}) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="link">
        {label} ↗
      </a>
    );
  }
  if (unavailableReason) {
    return (
      <span className="text-[var(--faint)] cursor-help" title={unavailableReason}>
        {label}
      </span>
    );
  }
  return null;
}

type ProjectItemProps = {
  project: Project;
  open: boolean;
  onToggle: () => void;
};

export default function ProjectItem({ project, open, onToggle }: ProjectItemProps) {
  // Media isn't mounted (and so never downloads) until the first open
  const [hasOpened, setHasOpened] = useState(open);
  useEffect(() => {
    if (open) setHasOpened(true);
  }, [open]);

  const slug = projectSlug(project);
  const media = project.image.filter(Boolean);
  const role = [project.roleLabel, project.isTeam ? "team" : null].filter(Boolean).join(", ");

  return (
    <article id={slug} className="scroll-mt-10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${slug}-details`}
        className="group w-full text-left cursor-pointer flex items-baseline justify-between gap-6"
      >
        <span className="flex flex-col gap-0.5">
          <span className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
            {project.title}
          </span>
          <span className="muted">{project.blurb}</span>
        </span>
        <span
          aria-hidden="true"
          className="muted text-[15px] leading-none transition-transform duration-500 ease-[var(--ease-out)]"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>

      <div className="expand" data-open={open} id={`${slug}-details`}>
        <div className="expand-inner">
          <div className="expand-content pt-4 pb-2 flex flex-col gap-4">
            <p>{project.description}</p>

            {hasOpened && media.length > 0 && (
              <div className="flex flex-col gap-3">
                {media.map((src) => (
                  <Media key={src} src={src} alt={project.title} playing={open} />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-1 text-[13px]">
              <p className="muted">
                {project.tags.join(", ")}
                {role && <> · {role}</>}
              </p>
              <p className="flex flex-wrap gap-x-4">
                <ProjectLink href={project.deployedUrl} unavailableReason={project.deployedUnavailableReason} label="live" />
                <ProjectLink href={project.githubUrl} unavailableReason={project.githubUnavailableReason} label="code" />
                <ProjectLink href={project.devpostUrl} unavailableReason={project.devpostUnavailableReason} label="devpost" />
                <ProjectLink href={project.labUrl} unavailableReason={project.labUnavailableReason} label="lab page" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
