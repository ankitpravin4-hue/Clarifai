"use client";

import { useCallback, useState } from "react";
import type { ContractAnalysis } from "@/types/analysis";
import { useToast } from "@/components/Toast";

async function captureToPdf(el: HTMLElement) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save("lexscan-visual-report.pdf");
}

export function ExportActions({
  analysis,
  captureRef,
}: {
  analysis: ContractAnalysis;
  captureRef: React.RefObject<HTMLElement | null>;
}) {
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);

  const exportPdf = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lexscan-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
      showToast("PDF report downloaded.", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not export PDF.";
      if (captureRef.current) {
        try {
          await captureToPdf(captureRef.current);
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
      onClick={exportPdf}
      disabled={busy}
      className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? "Preparing…" : "Export PDF report"}
    </button>
  );
}
