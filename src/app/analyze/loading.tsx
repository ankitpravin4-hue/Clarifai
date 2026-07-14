import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-5 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-4 w-36 animate-shimmer rounded-full bg-secondary" />
          <div className="mx-auto mt-4 h-10 w-72 max-w-full animate-shimmer rounded-full bg-secondary" />
          <div className="mx-auto mt-4 h-4 w-96 max-w-full animate-shimmer rounded-full bg-secondary" />
        </div>
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <LoadingSkeleton />
        </div>
      </div>
    </div>
  );
}
