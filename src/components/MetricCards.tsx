import type { ContractAnalysis } from "@/types/analysis";

const items = (a: ContractAnalysis) =>
  [
    {
      label: "Risk score",
      value: `${Math.round(a.riskScore)}`,
      hint: "0–100 model estimate",
    },
    {
      label: "Clauses flagged",
      value: `${a.clausesFlagged}`,
      hint: "Items worth review",
    },
    {
      label: "Hidden penalties",
      value: `${a.hiddenPenalties}`,
      hint: "Fees & triggers",
    },
    {
      label: "Pages scanned",
      value: `${a.pagesScanned}`,
      hint: "From PDF parser",
    },
  ] as const;

export function MetricCards({ analysis }: { analysis: ContractAnalysis }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items(analysis).map((m) => (
        <div
          key={m.label}
          className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {m.label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {m.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
        </div>
      ))}
    </div>
  );
}
