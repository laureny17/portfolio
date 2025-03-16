"use client";
import Image from "next/image";

export default function About() {
  // edit later; just put in samples
  const languages = ["Python", "JavaScript", "TypeScript", "Java", "C"];
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
      {/* left section will have some personal info*/}
      <div className="space-y-6">
        {/* picture + basic info */}
        <div className="flex items-start space-x-4">
          {/* profile pic */}
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
            <Image
              src="/profile.jpg" // replace later
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
        <ul className="text-xs sm:text-sm md:text-base lg:text-lg list-disc pl-6 space-y-2 pt-5">
          <li>
            My greatest career aspiration is to work for sociocultural impact.
            Some of my current areas of interest include (but are not limited
            to) the following:
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>Education</li>
              <li>Accessibility</li>
              <li>Video games for social change</li>
            </ul>
          </li>
          <li>
            I'm a part of the organizing team for HackMIT, one of the largest
            collegiate hackathons in the nation.
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>I just love to see people have fun! :)</li>
            </ul>
          </li>
          <li>
            In my free time, I like to...
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>Draw, paint, animate, crochet, embroider, etc.</li>
              <li>Go on hikes with my friends and/or dog</li>
              <li>
                Start working on the newest coding project that has been
                plaguing my mind
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* right section */}
      <div className="space-y-10 pl-10">
        {/* placeholder, will put handdrawn graphic/animation later */}
        <div className="w-full h-50 bg-gray-200 rounded-md flex items-center justify-center">
          placeholder
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
            Frameworks and Platforms
          </p>
          <div className="flex flex-wrap gap-2">
            {frameworksPlatforms.map((frameworkOrPlatform) => (
              <span
                key={frameworkOrPlatform}
                className="px-3 py-1 bg-[var(--accent)] text-[var(--black)] rounded-full text-xs sm:text-sm"
              >
                {frameworkOrPlatform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
