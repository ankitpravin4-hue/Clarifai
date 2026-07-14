import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const product = [
  { href: "/analyze", label: "Analyze" },
  { href: "/compare", label: "Compare" },
  { href: "/negotiate", label: "Negotiate" },
  { href: "/history", label: "History" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

const legal = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <BrandLogo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            AI-powered contract clarity for founders, freelancers, and small
            businesses who can&apos;t afford a lawyer on retainer.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {product.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Company
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {company.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Legal
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {legal.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 Clarifai. All rights reserved.</p>
          <p className="text-pretty">
            Clarifai provides informational analysis, not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
