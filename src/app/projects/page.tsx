"use client";

import ProjectGrid from "@/components/project-grid";
import { projectCards } from "../../../public/assets/projectCards";

export default function Projects() {
  return (
    <main className="pt-20">
      <div className="relative px-0 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Simple Header */}
        <div className="mb-8">
          <pre
            className="text-[4vw] md:text-lg lg:text-2xl font-light"
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
        <div className="w-full mb-16">
          <ProjectGrid cards={projectCards} />
        </div>
      </div>
    </main>
  );
}
