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

  const loadSampleInto = async (slot: "a" | "b") => {
    try {
      const res = await fetch("/sample-contract.pdf");
      if (!res.ok) throw new Error("Sample file missing");
      const blob = await res.blob();
      const file = new File([blob], "sample-contract.pdf", {
        type: "application/pdf",
      });
      if (slot === "a") setFileA(file);
      else setFileB(file);
      showToast(`Loaded sample into Contract ${slot.toUpperCase()}.`, "success");
    } catch {
      showToast("Could not load the sample contract.", "error");
    }
  };

  const runCompare = async () => {
    if (!fileA || !fileB) {
      showToast("Select two PDF contracts to compare.", "error");
      return;
    }
    if (
      fileA.name.toLowerCase().endsWith(".docx") ||
      fileB.name.toLowerCase().endsWith(".docx")
    ) {
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
      <div className="min-h-screen bg-background px-5 py-16 text-foreground">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-8 shadow-sm">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-5 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Compare contracts
          </span>
          <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            See exactly which agreement favors you
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Load two contracts and Clarifai lines up the key terms side by side,
            highlighting the version that protects you better.
          </p>
        </div>

        {session && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={resetWorkspace}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
            >
              New comparison
            </button>
          </div>
        )}

        {!session && (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <UploadZone
                  label="Contract A"
                  file={fileA}
                  onFile={setFileA}
                  onError={(m) => showToast(m, "error")}
                  disabled={loading}
                  secondaryLabel="Click to browse or drop a PDF"
                />
                {!fileA && (
                  <button
                    type="button"
                    onClick={() => loadSampleInto("a")}
                    disabled={loading}
                    className="w-full text-center text-sm font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-70"
                  >
                    Click to load sample
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <UploadZone
                  label="Contract B"
                  file={fileB}
                  onFile={setFileB}
                  onError={(m) => showToast(m, "error")}
                  disabled={loading}
                  secondaryLabel="Click to browse or drop a PDF"
                />
                {!fileB && (
                  <button
                    type="button"
                    onClick={() => loadSampleInto("b")}
                    disabled={loading}
                    className="w-full text-center text-sm font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-70"
                  >
                    Click to load sample
                  </button>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={runCompare}
                disabled={loading || !fileA || !fileB}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:translate-y-px disabled:opacity-50"
              >
                {loading ? "Comparing…" : "Compare contracts"}
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
          </>
        )}

        {loading && (
          <div className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-sm">
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
