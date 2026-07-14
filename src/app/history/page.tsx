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
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-5 py-14 md:py-20">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Analysis history
          </span>
          <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your past contracts
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Every contract you analyze while signed in is saved here so you can
            revisit any report anytime.
          </p>
        </div>

        <div className="mt-10">
          <HistoryList analyses={data ?? []} />
        </div>
      </div>
    </div>
  );
}
