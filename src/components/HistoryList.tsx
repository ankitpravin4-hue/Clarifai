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
  if (score > 70) return "text-risk-high";
  if (score >= 40) return "text-risk-medium";
  return "text-risk-low";
}

function riskLevelBadge(level: string | null) {
  const normalized = (level || "medium").toLowerCase() as RiskLevel;
  const styles: Record<RiskLevel, string> = {
    high: "bg-risk-high/10 text-risk-high",
    medium: "bg-risk-medium/10 text-risk-medium",
    low: "bg-risk-low/10 text-risk-low",
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
      <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden>
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="mt-5 text-xl font-semibold text-foreground">
          No analyses yet
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload your first contract to start building your history.
        </p>
        <button
          type="button"
          onClick={() => router.push("/analyze")}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105"
        >
          Analyze a contract
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {analyses.map((row) => {
        const score = row.risk_score ?? 0;
        return (
          <article
            key={row.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold text-foreground">
                    {row.file_name || "Untitled contract"}
                  </h2>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${riskLevelBadge(
                      row.risk_level
                    )}`}
                  >
                    {row.risk_level || "medium"} risk
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span>
                    Risk score:{" "}
                    <span className={`font-semibold ${riskScoreColor(score)}`}>
                      {score}
                    </span>
                  </span>
                  <span>
                    Clauses flagged:{" "}
                    <span className="font-semibold text-foreground">
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
                className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary sm:w-auto"
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
