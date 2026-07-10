export default function HistoryLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="h-4 w-40 animate-shimmer rounded bg-slate-200" />
        <div className="mt-4 h-10 w-72 max-w-full animate-shimmer rounded bg-slate-200" />
        <div className="mt-3 h-4 w-96 max-w-full animate-shimmer rounded bg-slate-200" />
        <div className="mt-10 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-card border border-line bg-white shadow-card"
            >
              <div className="h-full animate-shimmer rounded-card bg-slate-100/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
