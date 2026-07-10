import { NextResponse } from "next/server";
import {
  extractPdfText,
  isPdfBuffer,
  buildFallbackAnalysis,
  PdfParseError,
} from "@/lib/pdf-text";
import { analyzeContractText } from "@/lib/openrouter";
import type { ContractAnalysis } from "@/types/analysis";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 20 * 1024 * 1024;

async function analyzeFile(file: File): Promise<ContractAnalysis> {
  if (file.size > MAX_BYTES) {
    throw new Error("One of the files exceeds 20MB.");
  }

  const name = file.name?.toLowerCase() || "";
  if (name.endsWith(".docx")) {
    throw new Error("DOCX is not supported. Use PDF for both contracts.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!isPdfBuffer(buffer)) {
    throw new Error("Invalid PDF upload.");
  }

  const { text, pages } = await extractPdfText(buffer).catch((err) => {
    if (err instanceof PdfParseError) throw err;
    throw new PdfParseError(
      "Could not read one of the PDFs. Re-export both files as standard PDFs and try again."
    );
  });
  if (!text || text.length < 40) {
    throw new Error("Could not extract enough text from a PDF.");
  }

  try {
    return await analyzeContractText(text, pages);
  } catch {
    return buildFallbackAnalysis(pages, text);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const a = formData.get("contract1");
    const b = formData.get("contract2");

    if (!a || !b || !(a instanceof File) || !(b instanceof File)) {
      return NextResponse.json(
        { error: "Missing contract1 or contract2 PDF fields." },
        { status: 400 }
      );
    }

    const [contract1, contract2] = await Promise.all([
      analyzeFile(a),
      analyzeFile(b),
    ]);

    return NextResponse.json({ contract1, contract2 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Compare failed unexpectedly.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
