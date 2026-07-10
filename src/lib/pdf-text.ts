// Polyfills for serverless environment
if (typeof globalThis.DOMMatrix === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).DOMMatrix = class DOMMatrix {};
}
if (typeof globalThis.Path2D === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Path2D = class Path2D {};
}

import type { ContractAnalysis } from "@/types/analysis";

const PDF_MAGIC = Buffer.from("%PDF");

export class PdfParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfParseError";
  }
}

export function isPdfBuffer(buf: Buffer): boolean {
  return buf.length >= 4 && buf.subarray(0, 4).equals(PDF_MAGIC);
}

export async function extractTextFromPdf(
  buffer: Buffer
): Promise<{ text: string; pages: number }> {
  try {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { totalPages, text } = await extractText(pdf, { mergePages: true });
    return {
      text: (text || "").trim(),
      pages: typeof totalPages === "number" && totalPages > 0 ? totalPages : 1,
    };
  } catch (err) {
    const detail =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : "Unknown PDF parse error";
    console.error("PDF parse failed:", detail, err);
    throw new PdfParseError(
      "Could not read this PDF. It may be corrupted, encrypted, or use an unsupported format. Try re-exporting it as a standard PDF."
    );
  }
}

export const extractPdfText = extractTextFromPdf;

export function buildFallbackAnalysis(
  pages: number,
  snippet: string
): ContractAnalysis {
  const preview = snippet.slice(0, 400).replace(/\s+/g, " ").trim();
  return {
    riskScore: 50,
    riskLevel: "medium",
    pagesScanned: pages,
    clausesFlagged: 1,
    hiddenPenalties: 0,
    summary:
      "We could not finish the AI review. Here is a short preview of extracted text so you can still read part of the document.",
    eli18Summary:
      "The AI timed out or hit an error, so we are showing you a basic fallback. Try again with a smaller PDF or check your API key.",
    clauses: [
      {
        name: "Extracted preview",
        riskLevel: "medium",
        explanation:
          "Automatic analysis failed; this card shows a text preview only and is not a legal opinion.",
        eli18Explanation:
          "Something broke on the AI side — what you see below is just raw text we pulled from the PDF.",
        originalQuote: preview.slice(0, 200) || "(no text extracted)",
      },
    ],
    negotiationTips: [
      "Retry the scan after confirming your GROQ_API_KEY is valid.",
      "Try a smaller PDF or fewer pages if timeouts persist.",
      "Consult a licensed attorney for binding advice.",
    ],
  };
}
