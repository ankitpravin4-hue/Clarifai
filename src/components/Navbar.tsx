import Link from "next/link";
import { AuthControls } from "@/components/AuthControls";
import { NavbarLinks } from "@/components/NavbarLinks";

export function Navbar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        dark
          ? "border-white/10 bg-navy/80 text-white"
          : "border-line bg-white/90 text-navy"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            className={`grid h-9 w-9 place-items-center rounded-badge text-sm font-bold ${
              dark ? "bg-accent text-white" : "bg-accent text-white"
            }`}
          >
            C
          </span>
          <span className="text-base sm:text-lg">Clarifai</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavbarLinks dark={dark} />
          <AuthControls dark={dark} />
        </nav>
      </div>
    </header>
  );
}
