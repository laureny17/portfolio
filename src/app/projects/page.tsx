"use client";

import ProjectGrid from "@/components/project-grid";
import { projectCards } from "../../../public/assets/projectCards";

export default function Projects() {
  return (
    <main className="pt-20">
      <div className="relative px-8 sm:px-8 md:px-12 lg:px-12 xl:px-20">
        {/* Simple Header */}
        <div className="mb-8">
          <pre
            className="text-2xl font-light whitespace-pre"
            style={{ fontFamily: "Pecita" }}
          >
            {`⠀⠀⠀⢸⣦⡀⠀⠀⠀⠀⢀⡄
⠀⠀⠀⢸⣏⠻⣶⣤⡶⢾⡿⠁
⠀⠀⣀⣼⠷⠀⠀⠁   Some cool stuff I've built
⠴⣾⣯⣅⣀⠀⠀⠀⠈⢻⣦⡀
⠀⠀⠀⠉⢻⡇⣤⣾⣿⣷⣿⣿
⠀⠀⠀⠀⠸⣿⡿⠏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠟⠁⠀⠀⠀⠀`}
          </pre>
        </div>

        {/* Projects Grid */}
        <div className="w-full">
          <ProjectGrid cards={projectCards} />
        </div>
      </div>
    </main>
  );
}
