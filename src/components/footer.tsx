export default function Footer() {
  return (
    <footer className="flex flex-col space-y-3 py-5">
      {/* Links */}
      <div className="flex items-center space-x-3 pb-10">
        <a
          href="mailto:laureny@mit.edu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4 underline-green font-medium"
        >
          Email
        </a>
        <span className="font-medium">/</span>
        <a
          href="https://www.linkedin.com/in/lauren-yoo-454437287/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4 underline-green font-medium"
        >
          LinkedIn
        </a>
        <span className="font-medium">/</span>
        <a
          href="https://github.com/laureny17"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4 underline-green font-medium"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
