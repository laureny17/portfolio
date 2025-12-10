export default function Footer() {
  return (
    <footer className="flex flex-col space-y-3 py-5">
      {/* Links */}
      <div className="flex items-center space-x-3">
        <a
          href="https://www.linkedin.com/in/lauren-yoo-454437287/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4 underline-green text-base sm:text-lg md:text-xl"
        >
          LinkedIn
        </a>
        <span className="text-base sm:text-lg md:text-xl">/</span>
        <a
          href="https://github.com/laureny17"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4 underline-green text-base sm:text-lg md:text-xl"
        >
          GitHub
        </a>
        <span className="text-base sm:text-lg md:text-xl">/</span>
        <a className="hover:underline hover:underline-offset-4 underline-green text-base sm:text-lg md:text-xl">
          laureny at mit dot edu
        </a>
      </div>

      {/* Credit */}
      <p className="text-xs sm:text-sm pb-10" style={{ whiteSpace: "nowrap" }}>
        ˖ ݁☘︎. Designed and developed by Lauren Yoo .☘︎ ݁˖
      </p>
    </footer>
  );
}
