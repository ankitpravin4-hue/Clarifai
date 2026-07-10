import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HistoryList } from "@/components/HistoryList";
import { supabaseAdmin } from "@/lib/supabase";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { data, error } = await supabaseAdmin
    .from("analyses")
    .select(
      "id, file_name, risk_score, risk_level, clauses_flagged, hidden_penalties, pages_scanned, summary, eli18_summary, clauses, negotiation_tips, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch analysis history:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-accent">
            Clarifai workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Analysis history
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Every contract you analyze while signed in is saved here for quick
            review.
          </p>
        </div>

        <div className="mt-10">
          <HistoryList analyses={data ?? []} />
        </div>
      </div>
    </div>
  );
}
