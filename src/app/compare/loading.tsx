export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="h-4 w-36 animate-shimmer rounded bg-slate-200" />
        <div className="mt-4 h-10 w-56 max-w-full animate-shimmer rounded bg-slate-200" />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-card border border-line bg-white shadow-card"
            >
              <div className="h-full animate-shimmer rounded-card bg-slate-100/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
