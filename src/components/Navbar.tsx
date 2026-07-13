"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { AuthControls } from "@/components/AuthControls";

const links = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/history", label: "History", signedInOnly: true },
  { href: "/compare", label: "Compare" },
];

export function Navbar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  const [open, setOpen] = useState(false);

  const linkClass = `rounded-lg px-3 py-2 text-sm font-medium transition ${
    dark ? "hover:bg-white/10" : "hover:bg-black/5"
  }`;

  const renderLinks = (onNavigate?: () => void) =>
    links.map((l) => {
      const link = (
        <Link
          key={l.href}
          href={l.href}
          className={linkClass}
          onClick={onNavigate}
        >
          {l.label}
        </Link>
      );

      if (l.signedInOnly) {
        return <SignedIn key={l.href}>{link}</SignedIn>;
      }

      return link;
    });

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        dark
          ? "border-white/10 bg-navy/80 text-white"
          : "border-line bg-white/90 text-navy"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-badge bg-accent text-sm font-bold text-white">
            C
          </span>
          <span className="text-base sm:text-lg">Clarifai</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">{renderLinks()}</nav>
          <AuthControls dark={dark} />
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden ${
              dark ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className={`border-t px-4 py-3 md:hidden ${
            dark ? "border-white/10 bg-navy/95" : "border-line bg-white"
          }`}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {renderLinks(() => setOpen(false))}
          </div>
        </nav>
      )}
    </header>
  );
}
