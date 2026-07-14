"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthControls } from "@/components/AuthControls";
import { BrandLogo } from "@/components/BrandLogo";

const links = [
  { href: "/analyze", label: "Analyze" },
  { href: "/compare", label: "Compare" },
  { href: "/negotiate", label: "Negotiate" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  void variant;

  const linkClass =
    "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

  const renderLinks = (onNavigate?: () => void) =>
    links.map((l) => (
      <Link
        key={l.href}
        href={l.href}
        className={linkClass}
        onClick={onNavigate}
      >
        {l.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <BrandLogo />

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">{renderLinks()}</nav>
          <div className="hidden md:flex">
            <AuthControls />
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M4 5h16M4 12h16M4 19h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {renderLinks(() => setOpen(false))}
            <div className="mt-3 border-t border-border pt-3">
              <AuthControls />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
