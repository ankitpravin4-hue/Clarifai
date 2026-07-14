"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
import { UploadZone } from "@/components/UploadZone";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { MetricCards } from "@/components/MetricCards";
import { RiskGauge } from "@/components/RiskGauge";
import { ClauseCard } from "@/components/ClauseCard";
import { SummaryBox } from "@/components/SummaryBox";
import { ELI18Toggle } from "@/components/ELI18Toggle";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/Toast";
import type { ContractAnalysis } from "@/types/analysis";
import { isContractAnalysis } from "@/types/analysis";
import { writeCompareSession } from "@/lib/compare-session";
import {
  readAnalysisSession,
  writeAnalysisSession,
} from "@/lib/analysis-session";

const ExportActions = dynamic(
  () =>
    import("@/components/ExportButton").then((mod) => ({
      default: mod.ExportActions,
    })),
  { ssr: false, loading: () => null }
);

export default function AnalyzePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { showToast } = useToast();
  const exportRef = useRef<HTMLDivElement>(null);

  const [compareMode, setCompareMode] = useState(false);
  const [primary, setPrimary] = useState<File | null>(null);
  const [secondary, setSecondary] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [eli18, setEli18] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [deepOpen, setDeepOpen] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("view") === "history"
    ) {
      const stored = readAnalysisSession();
      if (stored) setAnalysis(stored);
    }
  }, []);

  const loadSample = async () => {
    try {
      const res = await fetch("/sample-contract.pdf");
      if (!res.ok) throw new Error("Sample file missing");
      const blob = await res.blob();
      const file = new File([blob], "sample-contract.pdf", {
        type: "application/pdf",
      });
      setPrimary(file);
      showToast("Loaded Clarifai sample PDF.", "success");
    } catch {
      showToast("Could not load the sample contract.", "error");
    }
  };

  const runAnalyze = async () => {
    if (!primary) {
      showToast("Upload a PDF contract to begin.", "error");
      return;
    }
    if (compareMode) {
      if (!secondary) {
        showToast("Compare mode needs a second PDF.", "error");
        return;
      }
      if (
        primary.name.toLowerCase().endsWith(".docx") ||
        secondary.name.toLowerCase().endsWith(".docx")
      ) {
        showToast(
          "DOCX is preview-only — convert to PDF before compare.",
          "error"
        );
        return;
      }
    } else if (primary.name.toLowerCase().endsWith(".docx")) {
      showToast(
        "DOCX is preview-only — convert to PDF before analysis.",
        "error"
      );
      return;
    }

    setLoading(true);
    setAnalysis(null);
    try {
      if (compareMode && secondary) {
        const fd = new FormData();
        fd.append("contract1", primary);
        fd.append("contract2", secondary);
        const res = await fetch("/api/compare", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error((data as { error?: string }).error || "Compare failed");
        }
        const c1 = (data as { contract1?: unknown }).contract1;
        const c2 = (data as { contract2?: unknown }).contract2;
        if (!isContractAnalysis(c1) || !isContractAnalysis(c2)) {
          throw new Error("Unexpected compare response.");
        }
        writeCompareSession({
          contract1: c1,
          contract2: c2,
          name1: primary.name,
          name2: secondary.name,
        });
        showToast("Compare ready — opening side-by-side view.", "success");
        router.push("/compare");
        return;
      }

      const fd = new FormData();
      fd.append("file", primary);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const warn = res.headers.get("X-LexScan-Warning");
      const saved = res.headers.get("X-LexScan-Saved") === "true";
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Analysis failed");
      }
      if (!isContractAnalysis(data)) {
        throw new Error("Unexpected analysis response.");
      }
      setAnalysis(data);
      if (warn) {
        try {
          showToast(decodeURIComponent(warn), "info");
        } catch {
          showToast("Analysis completed with warnings.", "info");
        }
      } else if (saved && isSignedIn) {
        showToast("Analysis saved to history.", "success");
      } else {
        showToast("Analysis complete.", "success");
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-5 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Contract analysis
          </span>
          <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Get your risk report in seconds
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Upload a contract and Clarifai will score the risk, flag every
            concerning clause, and explain it in plain English.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Compare mode</p>
              <p className="text-xs text-muted-foreground">
                Upload two PDFs and jump into the side-by-side view.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={compareMode}
              onClick={() => {
                setCompareMode((v) => !v);
                setAnalysis(null);
              }}
              className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition ${
                compareMode ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-card shadow transition ${
                  compareMode ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {compareMode ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadZone
                label="Contract A"
                file={primary}
                onFile={setPrimary}
                onError={(m) => showToast(m, "error")}
                disabled={loading}
                secondaryLabel="Drop PDF or click to browse"
              />
              <UploadZone
                label="Contract B"
                file={secondary}
                onFile={setSecondary}
                onError={(m) => showToast(m, "error")}
                disabled={loading}
                secondaryLabel="Drop PDF or click to browse"
              />
            </div>
          ) : (
            <UploadZone
              label="Upload your contract"
              file={primary}
              onFile={setPrimary}
              onError={(m) => showToast(m, "error")}
              disabled={loading}
              size="hero"
            />
          )}

          {!compareMode && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have a file handy?{" "}
              <button
                type="button"
                onClick={loadSample}
                disabled={loading}
                className="font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-70"
              >
                Try the sample contract
              </button>
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={runAnalyze}
              disabled={loading || !primary || (compareMode && !secondary)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:translate-y-px disabled:opacity-50"
            >
              {loading
                ? "Working…"
                : compareMode
                  ? "Compare contracts"
                  : "Analyze contract"}
              {!loading && (
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12h14m-7-7 7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-14 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <LoadingSkeleton />
          </div>
        )}

        {analysis && !loading && (
          <div className="mt-14 space-y-6" id="lexscan-results">
            <div
              ref={exportRef}
              id="lexscan-export-root"
              className="space-y-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Analysis complete
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                    Your risk report
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {analysis.clausesFlagged} clauses reviewed.
                    {analysis.hiddenPenalties > 0
                      ? ` ${analysis.hiddenPenalties} need your attention before signing.`
                      : " Review the flagged items before signing."}
                  </p>
                </div>
                <ELI18Toggle value={eli18} onChange={setEli18} />
              </div>

              <div className="grid gap-8 lg:grid-cols-[200px_1fr] lg:items-start">
                <div className="flex justify-center lg:justify-start">
                  <RiskGauge score={analysis.riskScore} />
                </div>
                <MetricCards analysis={analysis} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Flagged clauses
                </h3>
                <div className="grid gap-3">
                  {analysis.clauses.map((c, idx) => (
                    <ClauseCard key={idx} clause={c} eli18={eli18} />
                  ))}
                </div>
              </div>

              <SummaryBox
                title={eli18 ? "ELI18 summary" : "Plain English summary"}
                text={eli18 ? analysis.eli18Summary : analysis.summary}
              />
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <ExportActions analysis={analysis} captureRef={exportRef} />
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    writeAnalysisSession(analysis);
                    router.push("/negotiate");
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105"
                >
                  Generate negotiation letter
                </button>
                <button
                  type="button"
                  onClick={() => setTipsOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
                >
                  Negotiation tips
                </button>
                <button
                  type="button"
                  onClick={() => setDeepOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground px-5 text-sm font-semibold text-background shadow-sm transition hover:opacity-90"
                >
                  Deep dive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={tipsOpen && !!analysis}
        title="Negotiation tips"
        onClose={() => setTipsOpen(false)}
      >
        {analysis ? (
          <ul className="list-disc space-y-3 pl-5">
            {analysis.negotiationTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        ) : null}
      </Modal>

      <Modal
        open={deepOpen && !!analysis}
        title="Deep dive — clause detail"
        onClose={() => setDeepOpen(false)}
      >
        {analysis ? (
          <div className="space-y-4">
            {analysis.clauses.map((c, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-secondary/40 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Legal tone
                </p>
                <p className="mt-1 text-sm text-foreground/80">{c.explanation}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ELI18
                </p>
                <p className="mt-1 text-sm text-foreground/80">
                  {c.eli18Explanation}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quote
                </p>
                <p className="mt-1 text-sm italic text-muted-foreground">
                  “{c.originalQuote}”
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
