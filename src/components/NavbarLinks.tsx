"use client";

import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/history", label: "History", signedInOnly: true },
  { href: "/compare", label: "Compare" },
];

export function NavbarLinks({
  dark = false,
}: {
  dark?: boolean;
}) {
  const linkClass = `rounded-lg px-3 py-2 text-sm font-medium transition ${
    dark ? "hover:bg-white/10" : "hover:bg-black/5"
  }`;

  return (
    <>
      {links.map((l) => {
        const link = (
          <Link key={l.href} href={l.href} className={linkClass}>
            {l.label}
          </Link>
        );

        if (l.signedInOnly) {
          return <SignedIn key={l.href}>{link}</SignedIn>;
        }

        return link;
      })}
    </>
  );
}
