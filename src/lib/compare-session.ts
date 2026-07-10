import type { ContractAnalysis } from "@/types/analysis";

export const LEXSCAN_COMPARE_KEY = "lexscan:compare";

export type CompareSession = {
  contract1: ContractAnalysis;
  contract2: ContractAnalysis;
  name1: string;
  name2: string;
};

export function readCompareSession(): CompareSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(LEXSCAN_COMPARE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CompareSession;
  } catch {
    return null;
  }
}

export function writeCompareSession(data: CompareSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(LEXSCAN_COMPARE_KEY, JSON.stringify(data));
}

export function clearCompareSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(LEXSCAN_COMPARE_KEY);
}
