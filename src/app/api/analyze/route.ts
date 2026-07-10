import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  extractPdfText,
  isPdfBuffer,
  buildFallbackAnalysis,
} from "@/lib/pdf-text";
import { analyzeContractText } from "@/lib/openrouter";
import { supabaseAdmin } from "@/lib/supabase";
import type { ContractAnalysis } from "@/types/analysis";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 20 * 1024 * 1024;

async function saveAnalysisToSupabase(
  userId: string,
  fileName: string,
  analysis: ContractAnalysis
): Promise<boolean> {
  const { error } = await supabaseAdmin.from("analyses").insert({
    user_id: userId,
    file_name: fileName,
    risk_score: analysis.riskScore,
    risk_level: analysis.riskLevel,
    clauses_flagged: analysis.clausesFlagged,
    hidden_penalties: analysis.hiddenPenalties,
    pages_scanned: analysis.pagesScanned,
    summary: analysis.summary,
    eli18_summary: analysis.eli18Summary,
    clauses: analysis.clauses,
    negotiation_tips: analysis.negotiationTips,
  });

  if (error) {
    console.error("Failed to save analysis to Supabase:", error);
    return false;
  }

  return true;
}

async function responseWithOptionalSave(
  analysis: ContractAnalysis,
  fileName: string,
  extraHeaders?: Record<string, string>
) {
  const { userId } = await auth();
  let saved = false;

  if (userId) {
    saved = await saveAnalysisToSupabase(userId, fileName, analysis);
  }

  const headers: Record<string, string> = { ...extraHeaders };
  if (saved) {
    headers["X-LexScan-Saved"] = "true";
  }

  return NextResponse.json(analysis, { headers });
}

export async function POST(request: Request) {
  console.log("=== ANALYZE ROUTE CALLED ===");

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data with a PDF file." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file field." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 20MB limit." },
        { status: 413 }
      );
    }

    const name = file.name?.toLowerCase() || "";
    if (name.endsWith(".docx")) {
      return NextResponse.json(
        {
          error:
            "DOCX is not supported yet. Please export or print to PDF and try again.",
        },
        { status: 415 }
      );
    }

    if (!name.endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported for analysis." },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!isPdfBuffer(buffer)) {
      return NextResponse.json(
        { error: "Invalid PDF file or corrupted upload." },
        { status: 422 }
      );
    }

    const { text, pages } = await extractPdfText(buffer);

    if (!text || text.length < 40) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from this PDF. It may be scanned images or encrypted.",
        },
        { status: 422 }
      );
    }

    try {
      const analysis = await analyzeContractText(text, pages);
      return responseWithOptionalSave(analysis, file.name);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Analysis failed unexpectedly.";
      const fallback = buildFallbackAnalysis(pages, text);
      return responseWithOptionalSave(fallback, file.name, {
        "X-LexScan-Warning": encodeURIComponent(message.slice(0, 800)),
      });
    }
  } catch (error) {
    console.error("=== ANALYZE ERROR ===", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
