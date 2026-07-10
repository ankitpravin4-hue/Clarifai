"use client";

import { useCallback, useState } from "react";
import type { ContractAnalysis } from "@/types/analysis";
import { useToast } from "@/components/Toast";

type JsPDFDoc = InstanceType<
  Awaited<typeof import("jspdf")>["jsPDF"]
>;

function addWrappedText(
  doc: JsPDFDoc,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

async function buildAnalysisPdf(analysis: ContractAnalysis): Promise<JsPDFDoc> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxW = pageWidth - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Clarifai — Contract Analysis Report", margin, y);
  y += 28;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  y = addWrappedText(
    doc,
    `Generated ${new Date().toLocaleString()} · This report is informational only and not legal advice.`,
    margin,
    y,
    maxW,
    14
  );
  y += 18;
  doc.setTextColor(15, 23, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Overview", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = addWrappedText(
    doc,
    `Risk score: ${analysis.riskScore}/100 (${analysis.riskLevel})\nPages scanned: ${analysis.pagesScanned}\nClauses flagged: ${analysis.clausesFlagged}\nHidden penalties flagged: ${analysis.hiddenPenalties}`,
    margin,
    y,
    maxW,
    16
  );
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  y = addWrappedText(doc, analysis.summary, margin, y, maxW, 15);
  y += 14;

  doc.setFont("helvetica", "bold");
  doc.text("ELI18 summary", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  y = addWrappedText(doc, analysis.eli18Summary, margin, y, maxW, 15);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.text("Flagged clauses", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");

  for (const c of analysis.clauses) {
    if (y > doc.internal.pageSize.getHeight() - 120) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    y = addWrappedText(
      doc,
      `${c.name} — ${c.riskLevel.toUpperCase()}`,
      margin,
      y,
      maxW,
      15
    );
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y = addWrappedText(doc, c.explanation, margin, y, maxW, 14);
    y += 6;
    doc.setTextColor(71, 85, 105);
    y = addWrappedText(doc, `Quote: “${c.originalQuote}”`, margin, y, maxW, 14);
    doc.setTextColor(15, 23, 42);
    y += 14;
  }

  if (y > doc.internal.pageSize.getHeight() - 100) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Negotiation tips", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  analysis.negotiationTips.forEach((tip, i) => {
    if (y > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      y = margin;
    }
    y = addWrappedText(doc, `${i + 1}. ${tip}`, margin, y, maxW, 14);
    y += 6;
  });

  return doc;
}

async function captureToPdf(el: HTMLElement) {
  if (typeof window === "undefined") return;

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

  pdf.save("analysis-report.pdf");
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

  const handleExport = useCallback(async () => {
    if (typeof window === "undefined") return;

    setBusy(true);
    try {
      const doc = await buildAnalysisPdf(analysis);
      doc.save("analysis-report.pdf");
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
      onClick={handleExport}
      disabled={busy}
      className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? "Preparing…" : "Export PDF report"}
    </button>
  );
}
