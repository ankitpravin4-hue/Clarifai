"use client";

import type { ContractAnalysis } from "@/types/analysis";
import { MetricCards } from "@/components/MetricCards";
import { RiskGauge } from "@/components/RiskGauge";
import { ClauseCard } from "@/components/ClauseCard";

function deltaBadge(a: number, b: number) {
  const d = Math.round(a - b);
  if (d === 0)
    return { label: "Tied", cls: "bg-secondary text-muted-foreground" };
  if (d > 0)
    return {
      label: `+${d} vs B`,
      cls: "bg-risk-high/10 text-risk-high",
    };
  return {
    label: `${d} vs B`,
    cls: "bg-risk-low/10 text-risk-low",
  };
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
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {leftTitle}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                Risk profile
              </h2>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${l.cls}`}
            >
              {l.label}
            </span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr] md:items-start">
            <RiskGauge score={left.riskScore} />
            <MetricCards analysis={left} />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {rightTitle}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                Risk profile
              </h2>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${r.cls}`}
            >
              {r.label}
            </span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr] md:items-start">
            <RiskGauge score={right.riskScore} />
            <MetricCards analysis={right} />
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Clause comparison
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Row alignment follows model output — use it as a conversation
            starter, not a legal diff.
          </p>
        </div>

        <div className="mt-4 hidden overflow-x-auto lg:block">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
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
                  c?.riskLevel === "high"
                    ? 3
                    : c?.riskLevel === "medium"
                      ? 2
                      : 1;
                const dl = !lc || !rc ? 0 : score(lc) - score(rc);
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
                    <td className="rounded-l-xl border-y border-l border-border bg-secondary/50 px-3 py-3 text-xs font-semibold text-muted-foreground">
                      {idx + 1}
                    </td>
                    <td className="border-y border-border bg-card px-3 py-3">
                      {lc ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">
                            {lc.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lc.riskLevel} · {lc.explanation.slice(0, 140)}
                            {lc.explanation.length > 140 ? "…" : ""}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="border-y border-border bg-card px-3 py-3">
                      {rc ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">
                            {rc.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rc.riskLevel} · {rc.explanation.slice(0, 140)}
                            {rc.explanation.length > 140 ? "…" : ""}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="rounded-r-xl border-y border-r border-border bg-secondary/50 px-3 py-3 text-xs font-semibold text-foreground">
                      {delta}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-3 lg:hidden">
          {Array.from({ length: maxRows }).map((_, idx) => {
            const lc = left.clauses[idx];
            const rc = right.clauses[idx];
            return (
              <div
                key={idx}
                className="space-y-3 rounded-2xl border border-border bg-secondary/40 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Clause {idx + 1}
                </p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {leftTitle}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {lc?.name ?? "—"}
                  </p>
                  {lc && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {lc.riskLevel} · {lc.explanation.slice(0, 120)}
                      {lc.explanation.length > 120 ? "…" : ""}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {rightTitle}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {rc?.name ?? "—"}
                  </p>
                  {rc && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {rc.riskLevel} · {rc.explanation.slice(0, 120)}
                      {rc.explanation.length > 120 ? "…" : ""}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {leftTitle} · clauses
          </h3>
          {left.clauses.map((c, i) => (
            <ClauseCard key={`l-${i}`} clause={c} eli18={false} />
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
