import type { ContractAnalysis } from "@/types/analysis";

export const LEXSCAN_ANALYSIS_KEY = "lexscan-analysis";

export function writeAnalysisSession(analysis: ContractAnalysis) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(LEXSCAN_ANALYSIS_KEY, JSON.stringify(analysis));
}

export function readAnalysisSession(): ContractAnalysis | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(LEXSCAN_ANALYSIS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ContractAnalysis;
  } catch {
    return null;
  }
}
