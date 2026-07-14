import Link from "next/link";

function DiamondMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Outer diamond */}
      <path
        d="M24 3.5 L44.5 24 L24 44.5 L3.5 24 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Inner diamond */}
      <path
        d="M24 9 L39 24 L24 39 L9 24 Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      {/* Serif C monogram */}
      <text
        x="24"
        y="25.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="18"
        fontWeight="700"
      >
        C
      </text>
    </svg>
  );
}

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Clarifai home" className={`shrink-0 ${className}`}>
      <span className="inline-flex items-center gap-2.5">
        <DiamondMark className="h-8 w-8 text-primary" />
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Clarif<span className="text-primary">ai</span>
        </span>
      </span>
    </Link>
  );
}
