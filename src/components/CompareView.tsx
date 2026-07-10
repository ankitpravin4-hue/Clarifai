"use client";

import type { ContractAnalysis } from "@/types/analysis";
import { MetricCards } from "@/components/MetricCards";
import { RiskGauge } from "@/components/RiskGauge";
import { ClauseCard } from "@/components/ClauseCard";

function deltaBadge(a: number, b: number) {
  const d = Math.round(a - b);
  if (d === 0) return { label: "Tied", cls: "bg-slate-100 text-slate-700" };
  if (d > 0)
    return { label: `+${d} vs B`, cls: "bg-red-50 text-risk-high ring-1 ring-red-100" };
  return { label: `${d} vs B`, cls: "bg-emerald-50 text-risk-low ring-1 ring-emerald-100" };
}

export function CompareView({
  left,
  right,
  leftTitle = "Contract A",
  rightTitle = "Contract B",
}: {
  left: ContractAnalysis;
  right: ContractAnalysis;
  leftTitle?: string;
  rightTitle?: string;
}) {
  const l = deltaBadge(left.riskScore, right.riskScore);
  const r = deltaBadge(right.riskScore, left.riskScore);

  const maxRows = Math.max(left.clauses.length, right.clauses.length);

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-card border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {leftTitle}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-navy">Risk profile</h2>
            </div>
            <span
              className={`rounded-badge px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${l.cls}`}
            >
              {l.label}
            </span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr] md:items-start">
            <RiskGauge score={left.riskScore} />
            <MetricCards analysis={left} />
          </div>
        </section>

        <section className="rounded-card border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {rightTitle}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-navy">Risk profile</h2>
            </div>
            <span
              className={`rounded-badge px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${r.cls}`}
            >
              {r.label}
            </span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr] md:items-start">
            <RiskGauge score={right.riskScore} />
            <MetricCards analysis={right} />
          </div>
        </section>
      </div>

      <section className="rounded-card border border-line bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-navy">Clause comparison</h2>
            <p className="text-sm text-slate-600">
              Row alignment follows model output order — use it as a conversation starter, not a legal diff.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-semibold">#</th>
                <th className="px-3 py-2 font-semibold">{leftTitle}</th>
                <th className="px-3 py-2 font-semibold">{rightTitle}</th>
                <th className="px-3 py-2 font-semibold">Delta</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxRows }).map((_, idx) => {
                const lc = left.clauses[idx];
                const rc = right.clauses[idx];
                const score = (c?: (typeof left.clauses)[number]) =>
                  c?.riskLevel === "high" ? 3 : c?.riskLevel === "medium" ? 2 : 1;
                const dl =
                  !lc || !rc ? 0 : score(lc) - score(rc);
                const delta =
                  !lc || !rc
                    ? "—"
                    : dl === 0
                      ? "Same band"
                      : dl > 0
                        ? "Left riskier"
                        : "Right riskier";

                return (
                  <tr key={idx} className="align-top">
                    <td className="rounded-l-lg border-y border-l border-line bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="border-y border-line bg-white px-3 py-3">
                      {lc ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-navy">{lc.name}</p>
                          <p className="text-xs text-slate-600">
                            {lc.riskLevel} · {lc.explanation.slice(0, 140)}
                            {lc.explanation.length > 140 ? "…" : ""}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="border-y border-line bg-white px-3 py-3">
                      {rc ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-navy">{rc.name}</p>
                          <p className="text-xs text-slate-600">
                            {rc.riskLevel} · {rc.explanation.slice(0, 140)}
                            {rc.explanation.length > 140 ? "…" : ""}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="rounded-r-lg border-y border-r border-line bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-700">
                      {delta}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            {leftTitle} · clauses
          </h3>
          {left.clauses.map((c, i) => (
            <ClauseCard key={`l-${i}`} clause={c} eli18={false} />
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            {rightTitle} · clauses
          </h3>
          {right.clauses.map((c, i) => (
            <ClauseCard key={`r-${i}`} clause={c} eli18={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
