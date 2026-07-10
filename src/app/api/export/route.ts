import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { isContractAnalysis } from "@/types/analysis";

export const runtime = "nodejs";

function addWrappedText(
  doc: jsPDF,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const analysis = body?.analysis as unknown;
    if (!isContractAnalysis(analysis)) {
      return NextResponse.json(
        { error: "Invalid analysis payload." },
        { status: 400 }
      );
    }

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
      y = addWrappedText(doc, `${c.name} — ${c.riskLevel.toUpperCase()}`, margin, y, maxW, 15);
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

    const out = doc.output("arraybuffer");
    return new Response(out, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="lexscan-report.pdf"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate PDF export." },
      { status: 500 }
    );
  }
}
