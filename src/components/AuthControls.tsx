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
    ? "rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
    : "rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm transition hover:border-accent/40";

  const primaryClass = dark
    ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm transition hover:bg-slate-100"
    : "rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90";

  return (
    <div className="flex items-center gap-2">
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
