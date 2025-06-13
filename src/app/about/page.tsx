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
        {/* GitHub-style profile header */}
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src="/assets/ProfilePhoto.jpeg"
              alt="Profile Picture"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-semibold">Lauren</h1>
              <span className="px-2 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                she/her
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              CS/Math + Media Studies @ MIT
            </p>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-gray-600">
              <span>📍 New Jersey</span>
              <span>💻 Full-stack developer</span>
              <span>🎨 Artist</span>
            </div>
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
            I&#39;m the current head of the marketing committee within
            HackMIT&#39;s organizing team!
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>
                {`I led the ideation and design of this year's theme, merged and polished all drafts into a single Figma
              deliverable, and tackled debugging with the DevOps team to smooth the transition from design to `}
                <a
                  href="https://hackmit.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2 hover-body-link"
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
        {/* sky clouds drawing */}
        <div className="w-full rounded-md overflow-hidden max-h-[350px]">
          <Image
            src="/assets/sky clouds.jpg"
            alt="Sky Clouds Drawing"
            width={500}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>

        {/* languages */}
        <div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl pb-3">
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
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl pb-3 pt-5">
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
