"use client";

import { useRouter } from "next/navigation";
import type { ContractAnalysis, RiskLevel } from "@/types/analysis";
import { writeAnalysisSession } from "@/lib/analysis-session";

export type StoredAnalysis = {
  id: string;
  file_name: string | null;
  risk_score: number | null;
  risk_level: string | null;
  clauses_flagged: number | null;
  hidden_penalties: number | null;
  pages_scanned: number | null;
  summary: string | null;
  eli18_summary: string | null;
  clauses: ContractAnalysis["clauses"] | null;
  negotiation_tips: string[] | null;
  created_at: string;
};

function riskScoreColor(score: number) {
  if (score > 70) return "text-red-600";
  if (score >= 40) return "text-amber-600";
  return "text-emerald-600";
}

function riskLevelBadge(level: string | null) {
  const normalized = (level || "medium").toLowerCase() as RiskLevel;
  const styles: Record<RiskLevel, string> = {
    high: "border-red-200 bg-red-50 text-red-800",
    medium: "border-amber-200 bg-amber-50 text-amber-900",
    low: "border-emerald-200 bg-emerald-50 text-emerald-900",
  };
  return styles[normalized] ?? styles.medium;
}

function formatAnalyzedAt(iso: string) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
  return formatted.replace(/\b(am|pm)\b/g, (m) => m.toUpperCase());
}

function toContractAnalysis(row: StoredAnalysis): ContractAnalysis {
  return {
    riskScore: row.risk_score ?? 0,
    riskLevel: (row.risk_level as RiskLevel) ?? "medium",
    pagesScanned: row.pages_scanned ?? 0,
    clausesFlagged: row.clauses_flagged ?? 0,
    hiddenPenalties: row.hidden_penalties ?? 0,
    summary: row.summary ?? "",
    eli18Summary: row.eli18_summary ?? "",
    clauses: row.clauses ?? [],
    negotiationTips: row.negotiation_tips ?? [],
  };
}

export function HistoryList({ analyses }: { analyses: StoredAnalysis[] }) {
  const router = useRouter();

  if (analyses.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-white p-12 text-center shadow-card">
        <p className="text-lg font-semibold text-navy">
          No analyses yet — upload your first contract
        </p>
        <button
          type="button"
          onClick={() => router.push("/analyze")}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90"
        >
          Analyze a contract
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {analyses.map((row) => {
        const score = row.risk_score ?? 0;
        return (
          <article
            key={row.id}
            className="rounded-card border border-line bg-white p-5 shadow-card transition hover:border-accent/30 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold text-navy">
                    {row.file_name || "Untitled contract"}
                  </h2>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${riskLevelBadge(
                      row.risk_level
                    )}`}
                  >
                    {row.risk_level || "medium"} risk
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                  <span>
                    Risk score:{" "}
                    <span className={`font-bold ${riskScoreColor(score)}`}>
                      {score}
                    </span>
                  </span>
                  <span>
                    Clauses flagged:{" "}
                    <span className="font-semibold text-navy">
                      {row.clauses_flagged ?? 0}
                    </span>
                  </span>
                  <span>{formatAnalyzedAt(row.created_at)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  writeAnalysisSession(toContractAnalysis(row));
                  router.push("/analyze?view=history");
                }}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent shadow-sm transition hover:bg-accent/10"
              >
                View full analysis
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
