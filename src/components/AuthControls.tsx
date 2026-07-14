"use client";

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
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
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
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
