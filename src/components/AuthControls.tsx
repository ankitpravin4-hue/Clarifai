"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function AuthControls({ dark = false }: { dark?: boolean }) {
  if (dark) {
    return (
      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              Sign in
            </button>
          </SignInButton>
          <Link
            href="/analyze"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105"
          >
            Analyze a contract
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Link
            href="/analyze"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105"
          >
            Analyze a contract
          </Link>
        </SignedIn>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </button>
        </SignInButton>
        <Link
          href="/analyze"
          className="rounded-full bg-primary px-4.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:translate-y-px"
        >
          Analyze a contract
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <Link
          href="/analyze"
          className="hidden rounded-full bg-primary px-4.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:translate-y-px sm:inline-flex"
        >
          Analyze a contract
        </Link>
      </SignedIn>
    </div>
  );
}
