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
    <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-10 lg:gap-20 py-10 px-0 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      {/* left section will have some personal info*/}
      <div className="space-y-6">
        {/* GitHub-style profile header */}
        {/* > 1100px: 2 cols, pfp big, pronouns next to name, institution below name */}
        {/* 900-1100px: 2 cols, pfp big, pronouns below name, institution below pfp+pronouns */}
        {/* 430-900px: 1 col, pfp big, pronouns next to name, institution below name */}
        {/* < 430px: 1 col, pfp small, pronouns below name, institution below pfp+pronouns */}

        {/* Layout for > 1100px: pronouns next to name, institution below name */}
        <div className="hidden min-[1100px]:flex flex-row items-start gap-6">
          <div className="flex flex-col items-start gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src="/assets/profile/profile-photo.jpeg"
                alt="Profile Picture"
                width={152}
                height={152}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="flex flex-row items-center gap-4 mb-6">
              <h1 className="text-lg">Lauren</h1>
              <div className="hidden min-[320px]:flex items-center gap-2">
                <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                  she/her
                </span>
                <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                  2027
                </span>
              </div>
              <span className="block min-[320px]:hidden text-xs text-gray-600 italic">
                she/her, 2027
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
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
        </div>

        {/* Layout for 430-640px: 1 col, pfp bigger, pronouns next to name, institution below name */}
        <div className="hidden min-[430px]:flex min-[640px]:hidden flex-col items-start gap-4">
          <div className="flex flex-row items-start gap-4 w-full">
            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src="/assets/profile/profile-photo.jpeg"
                alt="Profile Picture"
                width={152}
                height={152}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2">
              <div className="flex flex-row items-center gap-4">
                <h1 className="text-lg">Lauren</h1>
                <div className="hidden min-[320px]:flex items-center gap-2">
                  <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                    she/her
                  </span>
                  <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                    2027
                  </span>
                </div>
                <span className="block min-[320px]:hidden text-xs text-gray-600 italic">
                  she/her, 2027
                </span>
              </div>
              <div className="space-y-1">
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
                <p className="text-sm text-gray-600 flex items-center gap-2">
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
          </div>
        </div>

        {/* Layout for 640-900px: 1 col, pfp responsive, pronouns next to name, institution below name */}
        <div className="hidden min-[640px]:flex min-[900px]:hidden flex-col items-start gap-4">
          <div className="flex flex-row items-start gap-4 w-full">
            <div className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src="/assets/profile/profile-photo.jpeg"
                alt="Profile Picture"
                width={152}
                height={152}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2">
              <div className="flex flex-row items-center gap-4">
                <h1 className="text-lg">Lauren</h1>
                <div className="hidden min-[320px]:flex items-center gap-2">
                  <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                    she/her
                  </span>
                  <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                    2027
                  </span>
                </div>
                <span className="block min-[320px]:hidden text-xs text-gray-600 italic">
                  she/her, 2027
                </span>
              </div>
              <div className="space-y-1">
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
                <p className="text-sm text-gray-600 flex items-center gap-2">
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
          </div>
        </div>

        {/* Layout for 900-1100px: 2 cols, pfp big, pronouns below name, institution below pfp+pronouns */}
        <div className="hidden min-[900px]:flex min-[1100px]:hidden flex-col items-start gap-4">
          <div className="flex flex-row items-start gap-4 w-full">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src="/assets/profile/profile-photo.jpeg"
                alt="Profile Picture"
                width={152}
                height={152}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg">Lauren</h1>
                <div className="hidden min-[320px]:flex items-center gap-2">
                  <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                    she/her
                  </span>
                  <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                    2027
                  </span>
                </div>
                <span className="block min-[320px]:hidden text-xs text-gray-600 italic">
                  she/her, 2027
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
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
            <p className="text-sm text-gray-600 flex items-center gap-2">
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

        {/* Layout for < 430px: 1 col, pfp bigger, pronouns below name, institution below pfp+pronouns */}
        <div className="flex min-[430px]:hidden flex-col items-start gap-4">
          <div className="flex flex-row items-start gap-4 w-full">
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src="/assets/profile/profile-photo.jpeg"
                alt="Profile Picture"
                width={152}
                height={152}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg">Lauren</h1>
                <div className="hidden min-[320px]:flex items-center gap-2">
                  <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                    she/her
                  </span>
                  <span className="px-3 py-0.5 text-xs bg-[var(--accent)] text-[var(--black)] rounded-full">
                    2027
                  </span>
                </div>
                <span className="block min-[320px]:hidden text-xs text-gray-600 italic">
                  she/her, 2027
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
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
            <p className="text-sm text-gray-600 flex items-center gap-2">
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
        <ul className="text-xs min-[430px]:text-sm sm:text-sm md:text-base lg:text-lg list-disc pl-6 space-y-2">
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
                  className="text-xs min-[430px]:text-sm text-accent underline underline-offset-2 hover-body-link"
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
          <div className="hidden min-[320px]:flex flex-wrap gap-2">
            {languages.map((language) => (
              <span
                key={language}
                className="px-3 py-0.5 bg-[var(--accent)] text-[var(--black)] rounded-full text-xs sm:text-sm"
              >
                {language}
              </span>
            ))}
          </div>
          <p className="block min-[320px]:hidden text-xs text-gray-600 italic">
            {languages.join(", ")}
          </p>
        </div>

        {/* frameworks and platforms */}
        <div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl pb-3 pt-5">
            Frameworks and Tools
          </p>
          <div className="hidden min-[320px]:flex flex-wrap gap-2">
            {frameworksPlatforms.map((frameworkOrTool) => (
              <span
                key={frameworkOrTool}
                className="px-3 py-0.5 bg-[var(--accent)] text-[var(--black)] rounded-full text-xs sm:text-sm"
              >
                {frameworkOrTool}
              </span>
            ))}
          </div>
          <p className="block min-[320px]:hidden text-xs text-gray-600 italic">
            {frameworksPlatforms.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
