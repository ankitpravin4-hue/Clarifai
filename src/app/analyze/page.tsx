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
  { ssr: false }
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
      if (primary.name.toLowerCase().endsWith(".docx") || secondary.name.toLowerCase().endsWith(".docx")) {
        showToast("DOCX is preview-only — convert to PDF before compare.", "error");
        return;
      }
    } else if (primary.name.toLowerCase().endsWith(".docx")) {
      showToast("DOCX is preview-only — convert to PDF before analysis.", "error");
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
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">
              Clarifai workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Contract analyzer
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Upload a PDF, let AI map the risk landscape, and export a polished
              report your team can rally around.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadSample}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm transition hover:border-accent/40 disabled:opacity-50"
            >
              Try sample contract
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-card border border-line bg-white p-5 shadow-card sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-navy">Compare mode</p>
              <p className="text-xs text-slate-500">
                Flip on to upload two PDFs and jump into the dedicated compare view.
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
              className={`relative inline-flex h-9 w-16 items-center rounded-full border transition ${
                compareMode
                  ? "border-accent/40 bg-accent/10"
                  : "border-line bg-slate-100"
              }`}
            >
              <span
                className={`absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow transition ${
                  compareMode ? "translate-x-7" : ""
                }`}
              />
            </button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <UploadZone
              label={compareMode ? "Primary contract (PDF)" : "Contract PDF"}
              file={primary}
              onFile={setPrimary}
              onError={(m) => showToast(m, "error")}
              disabled={loading}
            />
            {compareMode ? (
              <UploadZone
                label="Secondary contract (PDF)"
                file={secondary}
                onFile={setSecondary}
                onError={(m) => showToast(m, "error")}
                disabled={loading}
              />
            ) : (
              <div className="rounded-card border border-dashed border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-600">
                <p className="font-semibold text-navy">Why Clarifai?</p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                  <li>• Clause-level quotes keep provenance obvious.</li>
                  <li>• ELI18 mode helps you brief execs in seconds.</li>
                  <li>• Compare mode aligns redlines before countersign.</li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              PDF required for analysis · DOCX accepted in UI but must be converted to
              PDF server-side.
            </p>
            <button
              type="button"
              onClick={runAnalyze}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Working…"
                : compareMode
                  ? "Compare contracts"
                  : "Analyze contract"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-10 rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
            <LoadingSkeleton />
          </div>
        )}

        {analysis && !loading && (
          <div className="mt-10 space-y-8" id="lexscan-results">
            <div
              ref={exportRef}
              id="lexscan-export-root"
              className="space-y-8 rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Executive readout
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Results overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Model risk band:{" "}
                    <span className="font-semibold capitalize text-navy">
                      {analysis.riskLevel}
                    </span>
                  </p>
                </div>
                <ELI18Toggle value={eli18} onChange={setEli18} />
              </div>

              <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
                <div className="flex justify-center lg:justify-start">
                  <RiskGauge score={analysis.riskScore} />
                </div>
                <MetricCards analysis={analysis} />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-navy">Clause insights</h3>
                  <p className="text-xs text-slate-500">
                    Cards mirror AI output — always verify against the source PDF.
                  </p>
                </div>
                <div className="grid gap-4">
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

            <div className="flex flex-col gap-3 rounded-card border border-line bg-white p-5 shadow-card sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
              <ExportActions analysis={analysis} captureRef={exportRef} />
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    writeAnalysisSession(analysis);
                    router.push("/negotiate");
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent shadow-sm transition hover:bg-accent/10"
                >
                  Generate negotiation letter
                </button>
                <button
                  type="button"
                  onClick={() => setTipsOpen(true)}
                  className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition hover:border-accent/40"
                >
                  Negotiation tips
                </button>
                <button
                  type="button"
                  onClick={() => setDeepOpen(true)}
                  className="inline-flex items-center justify-center rounded-lg border border-line bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
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
          <div className="space-y-6">
            {analysis.clauses.map((c, idx) => (
              <div key={idx} className="rounded-lg border border-line bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-navy">{c.name}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Legal tone
                </p>
                <p className="mt-1 text-sm text-slate-700">{c.explanation}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  ELI18
                </p>
                <p className="mt-1 text-sm text-slate-700">{c.eli18Explanation}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quote
                </p>
                <p className="mt-1 text-sm italic text-slate-600">“{c.originalQuote}”</p>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
