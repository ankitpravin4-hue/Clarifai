"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function AuthControls({ dark = false }: { dark?: boolean }) {
  const btnClass = dark
    ? "rounded-lg border border-white/20 px-2.5 py-2 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/10 sm:px-3 sm:text-sm"
    : "rounded-lg border border-line bg-white px-2.5 py-2 text-xs font-semibold text-navy shadow-sm transition hover:border-accent/40 sm:px-3 sm:text-sm";

  const primaryClass = dark
    ? "rounded-lg bg-white px-2.5 py-2 text-xs font-semibold text-navy shadow-sm transition hover:bg-slate-100 sm:px-3 sm:text-sm"
    : "rounded-lg bg-accent px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-accent/90 sm:px-3 sm:text-sm";

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <SignedOut>
        <SignInButton mode="modal">
          <button type="button" className={btnClass}>
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className={primaryClass}>
            Sign up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
