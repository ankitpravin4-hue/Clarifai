import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

function validatePdfFile(file: File): NextResponse | null {
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 20MB." },
      { status: 400 }
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Invalid file type. Only PDF files are supported." },
      { status: 415 }
    );
  }

  return null;
}

async function analyzeFile(file: File): Promise<ContractAnalysis> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length === 0) {
    throw new Error("File is empty.");
  }

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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const a = formData.get("contract1");
    const b = formData.get("contract2");

    if (!a || !b || !(a instanceof File) || !(b instanceof File)) {
      return NextResponse.json(
        { error: "Missing contract1 or contract2 PDF fields." },
        { status: 400 }
      );
    }

    const invalidA = validatePdfFile(a);
    if (invalidA) return invalidA;
    const invalidB = validatePdfFile(b);
    if (invalidB) return invalidB;

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
