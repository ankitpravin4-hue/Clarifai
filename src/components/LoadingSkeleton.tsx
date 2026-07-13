export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="h-4 w-48 animate-shimmer rounded-full bg-slate-200" />
        <p className="text-sm font-medium text-slate-600">Analyzing contract…</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-card border border-line bg-white p-4 shadow-card"
          >
            <div className="h-3 w-24 animate-shimmer rounded bg-slate-200" />
            <div className="mt-4 h-8 w-16 animate-shimmer rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-card border border-line bg-white shadow-card"
            >
              <div className="h-full animate-shimmer rounded-card bg-slate-100/70" />
            </div>
          ))}
        </div>
        <div className="h-48 rounded-card border border-line bg-white shadow-card">
          <div className="h-full animate-shimmer rounded-card bg-slate-100/70" />
        </div>
      </div>
    </div>
  );
}
