export default function NegotiateLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="h-4 w-36 animate-shimmer rounded bg-slate-200" />
        <div className="mt-4 h-10 w-72 max-w-full animate-shimmer rounded bg-slate-200" />
        <div className="mt-10 space-y-4 rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-shimmer rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
