import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white text-navy">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <nav className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm font-medium text-slate-600">
          {links.map((l, i) => (
            <span key={l.href} className="inline-flex items-center">
              {i > 0 && <span className="mx-2 text-slate-300">·</span>}
              <Link href={l.href} className="transition hover:text-accent">
                {l.label}
              </Link>
            </span>
          ))}
        </nav>
        <p className="text-center text-xs text-slate-500 sm:text-right">
          © 2025 Clarifai. Not legal advice.
        </p>
      </div>
    </footer>
  );
}
