export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="grid h-14 w-14 animate-pulse place-items-center rounded-badge bg-accent text-lg font-bold text-white shadow-card">
          C
        </div>
        <p className="text-sm font-semibold tracking-tight text-navy">Clarifai</p>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-shimmer rounded-full bg-accent/60" />
        </div>
      </div>
    </div>
  );
}
