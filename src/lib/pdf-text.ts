// Suppress canvas polyfill warnings in serverless environments
if (typeof globalThis.Path2D === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.Path2D = class Path2D {} as any;
}

import type { ContractAnalysis } from "@/types/analysis";

const PDF_MAGIC = Buffer.from("%PDF");

export function isPdfBuffer(buf: Buffer): boolean {
  return buf.length >= 4 && buf.subarray(0, 4).equals(PDF_MAGIC);
}

export async function extractPdfText(buffer: Buffer): Promise<{
  text: string;
  pages: number;
}> {
  const pdfParseModule = await import("pdf-parse");
  const modWithDefault = pdfParseModule as typeof pdfParseModule & {
    default?: unknown;
  };
  const pdfParse = modWithDefault.default || pdfParseModule;

  if (typeof pdfParse === "function") {
    const data = await (
      pdfParse as (buf: Buffer) => Promise<{ text?: string; numpages?: number }>
    )(buffer);
    const text = (data.text || "").trim();
    const pages = typeof data.numpages === "number" ? data.numpages : 1;
    return { text, pages };
  }

  const { PDFParse } = pdfParseModule;
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const text = (result.text || "").trim();
    const pages =
      typeof result.total === "number" && result.total > 0 ? result.total : 1;
    return { text, pages };
  } finally {
    await parser.destroy();
  }
}

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
      "Retry the scan after confirming your OPENROUTER_API_KEY is valid.",
      "Try a smaller PDF or fewer pages if timeouts persist.",
      "Consult a licensed attorney for binding advice.",
    ],
  };
}
