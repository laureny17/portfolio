"use client";
import Image from "next/image";

export default function About() {
  // edit later; just put in samples
  const languages = ["Python", "TypeScript", "JavaScript", "Java", "C", "C#"];
  const frameworksPlatforms = [
    "React",
    "Next.js",
    "Tailwind CSS",
    "Angular",
    "Node.js",
    "Express.js",
    "Django",
    "MongoDB",
    "Firebase",
    "Figma",
    "Unity",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 py-10 px-0 md:px-10">
      {/* left section will have some personal info*/}
      <div className="space-y-6">
        {/* picture + basic info */}
        <div className="flex items-start space-x-4">
          {/* profile pic */}
          <div className="w-32 h-32 rounded-lg overflow-hidden">
            <Image
              src="/assets/ProfilePhoto.jpeg"
              alt="Profile Picture"
              width={128}
              height={128}
            />
          </div>
          {/* name and basic info */}
          <div className="pl-10">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl pb-3">
              ❤︎ She/her
              <br></br>⚲ New Jersey
            </p>
            <a
              href="/resume.pdf" // replace later w resume
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base md:text-lg lg:text-xl text-accent underline underline-offset-4 underline-green"
              // className="text-accent hover:underline hover:underline-offset-4 underline-green"
            >
              Resume
            </a>
          </div>
        </div>

        {/* fun facts? change bullet pts later */}
        <ul className="text-sm sm:text-sm md:text-base lg:text-lg list-disc pl-6 space-y-2 pt-5">
          <li>
            {`My greatest career aspiration is to work for sociocultural impact;
            some of my current areas of interest include (but are not limited
            to) the following:`}
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>Education</li>
              <li>Accessibility</li>
              <li>Video games for social change</li>
            </ul>
          </li>
          <li>
            I'm the current head of the marketing committee within HackMIT's
            organizing team!
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>
                {`I led the ideation and design of this year's theme, merged and polished all drafts into a single Figma
              deliverable, and tackled debugging with the DevOps team to smooth the transition from design to `}
                <a
                  href="https://hackmit.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2 underline-green"
                >
                  deployment
                </a>
              </li>
            </ul>
          </li>
          <li>
            In my free time, I like to...
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>Draw, paint, animate, crochet, embroider, etc.</li>
              <li>Go on hikes with my friends and/or dog</li>
              <li>
                {`Work on the newest coding project that has been
                plaguing my mind :D`}
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* right section */}
      <div className="space-y-10">
        {/* placeholder, will put handdrawn graphic/animation later */}
        <div className="w-full h-50 bg-gray-200 rounded-md flex items-center justify-center text-center text-xs sm:text-sm md:text-base lg:text-lg p-5">
          Animated graphic coming soon ❤︎
        </div>

        {/* languages */}
        <div>
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl pb-3"
            // className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2"
            // style={{ fontFamily: "Pecita" }}
          >
            Languages
          </p>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <span
                key={language}
                className="px-3 py-1 bg-[var(--accent)] text-[var(--black)] rounded-full text-xs sm:text-sm"
              >
                {language}
              </span>
            ))}
          </div>
        </div>

        {/* frameworks and platforms */}
        <div>
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl pb-3 pt-5"
            // className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2"
            // style={{ fontFamily: "Pecita" }}
          >
            Frameworks and Tools
          </p>
          <div className="flex flex-wrap gap-2">
            {frameworksPlatforms.map((frameworkOrTool) => (
              <span
                key={frameworkOrTool}
                className="px-3 py-1 bg-[var(--accent)] text-[var(--black)] rounded-full text-xs sm:text-sm"
              >
                {frameworkOrTool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
