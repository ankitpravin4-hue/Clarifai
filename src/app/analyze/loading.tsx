import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="h-4 w-36 animate-shimmer rounded bg-slate-200" />
        <div className="mt-4 h-10 w-64 max-w-full animate-shimmer rounded bg-slate-200" />
        <div className="mt-3 h-4 w-96 max-w-full animate-shimmer rounded bg-slate-200" />
        <div className="mt-10 rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
          <LoadingSkeleton />
        </div>
      </div>
    </div>
  );
}
