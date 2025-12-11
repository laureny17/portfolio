"use client";

import ProjectGrid from "@/components/project-grid";
import { projectCards } from "../../components/projectCards";

export default function Projects() {
  return (
    <main className="pt-10">
      <div className="relative px-0 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Simple Header */}
        <div className="mb-8 flex flex-row gap-4 justify-center sm:justify-start text-lg md:text-xl lg:text-2xl">
          Take a look around! ｡✩₊⊹
        </div>

        {/* Projects Grid */}
        <div className="w-full mb-16">
          <ProjectGrid cards={projectCards} />
        </div>
      </div>
    </main>
  );
}
