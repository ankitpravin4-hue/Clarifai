"use client";

import { useCallback, useState } from "react";
import type { ContractAnalysis } from "@/types/analysis";
import { useToast } from "@/components/Toast";

export function ExportActions({
  analysis,
  captureRef,
}: {
  analysis: ContractAnalysis;
  captureRef: React.RefObject<HTMLElement | null>;
}) {
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);

  const handleExport = useCallback(async () => {
    if (typeof window === "undefined") return;

    setBusy(true);
    try {
      const { buildAnalysisPdf } = await import("@/lib/client/build-analysis-pdf");
      const doc = await buildAnalysisPdf(analysis);
      if (!doc) return;
      doc.save("analysis-report.pdf");
      showToast("PDF report downloaded.", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not export PDF.";
      if (captureRef.current) {
        try {
          const { captureAnalysisPdf } = await import(
            "@/lib/client/build-analysis-pdf"
          );
          await captureAnalysisPdf(captureRef.current);
          showToast(
            "Structured export failed — saved a styled PDF snapshot instead.",
            "info"
          );
        } catch {
          showToast(msg, "error");
        }
      } else {
        showToast(msg, "error");
      }
    } finally {
      setBusy(false);
    }
  }, [analysis, captureRef, showToast]);

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={busy}
      className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? "Preparing…" : "Export PDF report"}
    </button>
  );
}
