export type RiskLevel = "low" | "medium" | "high";

export interface ClauseItem {
  name: string;
  riskLevel: RiskLevel;
  explanation: string;
  eli18Explanation: string;
  originalQuote: string;
}

export interface ContractAnalysis {
  riskScore: number;
  riskLevel: RiskLevel;
  pagesScanned: number;
  clausesFlagged: number;
  hiddenPenalties: number;
  summary: string;
  eli18Summary: string;
  clauses: ClauseItem[];
  negotiationTips: string[];
}

export function isContractAnalysis(value: unknown): value is ContractAnalysis {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.riskScore === "number" &&
    typeof v.riskLevel === "string" &&
    typeof v.pagesScanned === "number" &&
    typeof v.clausesFlagged === "number" &&
    typeof v.hiddenPenalties === "number" &&
    typeof v.summary === "string" &&
    typeof v.eli18Summary === "string" &&
    Array.isArray(v.clauses) &&
    Array.isArray(v.negotiationTips)
  );
}
