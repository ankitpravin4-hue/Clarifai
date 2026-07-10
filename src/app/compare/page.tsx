"use client";

import { useEffect, useState } from "react";
import { CompareView } from "@/components/CompareView";
import { UploadZone } from "@/components/UploadZone";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { isContractAnalysis } from "@/types/analysis";
import {
  clearCompareSession,
  readCompareSession,
  writeCompareSession,
  type CompareSession,
} from "@/lib/compare-session";
import { useToast } from "@/components/Toast";

export default function ComparePage() {
  const { showToast } = useToast();
  const [session, setSession] = useState<CompareSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = readCompareSession();
    if (existing?.contract1 && existing?.contract2) {
      setSession(existing);
    }
    setHydrated(true);
  }, []);

  const runCompare = async () => {
    if (!fileA || !fileB) {
      showToast("Select two PDF contracts to compare.", "error");
      return;
    }
    if (fileA.name.toLowerCase().endsWith(".docx") || fileB.name.toLowerCase().endsWith(".docx")) {
      showToast("DOCX is preview-only — convert both files to PDF.", "error");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("contract1", fileA);
      fd.append("contract2", fileB);
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
      const next: CompareSession = {
        contract1: c1,
        contract2: c2,
        name1: fileA.name,
        name2: fileB.name,
      };
      writeCompareSession(next);
      setSession(next);
      showToast("Comparison updated.", "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Compare failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetWorkspace = () => {
    clearCompareSession();
    setSession(null);
    setFileA(null);
    setFileB(null);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 text-navy sm:px-6">
        <div className="mx-auto max-w-6xl rounded-card border border-line bg-white p-8 shadow-card">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">
              Clarifai compare
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Side-by-side contract intelligence
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Highlight diverging risk scores, scan clause pairs row-by-row, and walk
              into negotiations with both drafts on equal footing.
            </p>
          </div>
          {session && (
            <button
              type="button"
              onClick={resetWorkspace}
              className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm transition hover:border-accent/40"
            >
              New comparison
            </button>
          )}
        </div>

        {!session && (
          <div className="mt-10 rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <UploadZone
                label="Contract A (PDF)"
                file={fileA}
                onFile={setFileA}
                onError={(m) => showToast(m, "error")}
                disabled={loading}
              />
              <UploadZone
                label="Contract B (PDF)"
                file={fileB}
                onFile={setFileB}
                onError={(m) => showToast(m, "error")}
                disabled={loading}
              />
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={runCompare}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Comparing…" : "Run comparison"}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-10 rounded-card border border-line bg-white p-8 shadow-card">
            <LoadingSkeleton />
          </div>
        )}

        {session && !loading && (
          <div className="mt-10 space-y-6">
            <CompareView
              left={session.contract1}
              right={session.contract2}
              leftTitle={session.name1 || "Contract A"}
              rightTitle={session.name2 || "Contract B"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
