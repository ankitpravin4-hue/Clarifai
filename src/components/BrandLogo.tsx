import Link from "next/link";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Clarifai home" className={`shrink-0 ${className}`}>
      <span className="inline-flex items-center gap-2">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
            aria-hidden
          >
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
            <path d="m9 14 1.8 1.8L14 12" />
          </svg>
        </span>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Clarif<span className="text-primary">ai</span>
        </span>
      </span>
    </Link>
  );
}
