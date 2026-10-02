const links = [
  { href: "mailto:laureny@mit.edu", label: "email" },
  { href: "https://www.linkedin.com/in/lauren-yoo-454437287/", label: "linkedin" },
  { href: "https://github.com/laureny17", label: "github" },
];

export default function Footer() {
  return (
    <footer className="col flex justify-between pt-24 pb-10 text-[13px] muted">
      <span>© {new Date().getFullYear()}</span>
      <div className="flex gap-4">
        {links.map(({ href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-muted"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
