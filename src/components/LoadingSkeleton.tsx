export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="h-4 w-48 animate-shimmer rounded-full bg-secondary" />
        <p className="text-sm font-medium text-muted-foreground">
          Analyzing contract…
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-border bg-background p-4 shadow-sm"
          >
            <div className="h-3 w-24 animate-shimmer rounded bg-secondary" />
            <div className="mt-4 h-8 w-16 animate-shimmer rounded bg-secondary" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-border bg-background shadow-sm"
            >
              <div className="h-full animate-shimmer rounded-2xl bg-secondary/70" />
            </div>
          ))}
        </div>
        <div className="h-48 rounded-2xl border border-border bg-background shadow-sm">
          <div className="h-full animate-shimmer rounded-2xl bg-secondary/70" />
        </div>
      </div>
    </div>
  );
}
