export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="grid h-14 w-14 animate-pulse place-items-center rounded-badge bg-primary text-lg font-bold text-primary-foreground shadow-card">
          C
        </div>
        <p className="text-sm font-semibold tracking-tight text-foreground">
          Clarifai
        </p>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-border">
          <div className="h-full w-1/2 animate-shimmer rounded-full bg-primary/60" />
        </div>
      </div>
    </div>
  );
}
