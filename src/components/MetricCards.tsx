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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items(analysis).map((m) => (
        <div
          key={m.label}
          className="rounded-card border border-line bg-white p-4 shadow-card"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {m.label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-navy">{m.value}</p>
          <p className="mt-1 text-xs text-slate-500">{m.hint}</p>
        </div>
      ))}
    </div>
  );
}
