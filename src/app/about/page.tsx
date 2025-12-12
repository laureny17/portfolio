"use client";
import Image from "next/image";

export default function About() {
  const languages = ["Python", "TypeScript", "JavaScript", "Java", "C", "C#"];
  const frameworksPlatforms = [
    "React",
    "Next.js",
    "Vue.js",
    "Angular",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "MongoDB",
    "Firebase",
    "Figma",
    "Unity",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 py-10 px-0 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      {/* left section will have some personal info*/}
      <div className="space-y-6">
        {/* GitHub-style profile header */}
        <div className="flex items-start gap-6">
          <div className="w-36 h-36 rounded-lg overflow-hidden">
            <Image
              src="/assets/profile/profile-photo.jpeg"
              alt="Profile Picture"
              width={152}
              height={152}
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-lg">Lauren</h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                  she/her
                </span>
                <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                  2027
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Image
                src="/assets/profile/institution-emoji.webp"
                alt="Institution"
                width={20}
                height={20}
                className="inline-block -mt-2 select-none"
                draggable={false}
              />
              CS + Design @ MIT
            </p>
            <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
              <Image
                src="/assets/profile/pin-emoji.webp"
                alt="Location"
                width={20}
                height={20}
                className="inline-block -mt-1 select-none"
                draggable={false}
              />
              New Jersey
            </p>
          </div>
        </div>

        {/* fun facts */}
        <ul className="text-sm sm:text-sm md:text-base lg:text-lg list-disc pl-6 space-y-2">
          <li>
            {`My greatest career motivation is to work for sociocultural impact; in particular, I'm passionate about education, accessibility, and purpose-driven game design`}
          </li>
          <li>
            I'm a member of both the Marketing and DevOps committees within
            HackMIT's organizing team, and was Marketing Head in 2025
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>
                {`I directed theme ideation, tackled debugging with the DevOps team to smooth the transition from design to `}
                <a
                  href="https://hackmit.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2 hover-body-link"
                >
                  deployment
                </a>
                {`, and led the design and production of merch, posters, banners, social media, and all venue decorations`}
              </li>
            </ul>
          </li>
          <li>
            In my free time, I like to...
            <ul className="text-xs sm:text-xs md:text-sm lg:text-base list-disc pl-6 space-y-2 pt-3 pb-3">
              <li>Draw, paint, animate, crochet, etc.</li>
              <li>
                Cross off more books from my reading list (on a related note,{" "}
                <em>A Thousand Splendid Suns</em> has been my favorite book for
                almost 10 years now and I will never stop recommending it to
                anyone I can at any given opportunity)
              </li>
              <li>
                Work on the newest project that's been plaguing my mind :D
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
            src="/assets/profile/sky-clouds.jpg"
            alt="Sky Clouds Drawing"
            width={500}
            height={200}
            className="w-full h-full object-cover select-none"
            draggable={false}
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
                className="px-3 py-0.5 bg-[var(--accent)] text-[var(--black)] rounded-full text-xs sm:text-sm"
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
                className="px-3 py-0.5 bg-[var(--accent)] text-[var(--black)] rounded-full text-xs sm:text-sm"
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
