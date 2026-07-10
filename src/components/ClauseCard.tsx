import type { ClauseItem } from "@/types/analysis";

const styles = {
  high: {
    border: "border-red-200",
    bg: "bg-red-50/60",
    badge: "bg-risk-high/10 text-risk-high ring-1 ring-risk-high/20",
  },
  medium: {
    border: "border-amber-200",
    bg: "bg-amber-50/50",
    badge: "bg-risk-medium/10 text-risk-medium ring-1 ring-risk-medium/25",
  },
  low: {
    border: "border-emerald-200",
    bg: "bg-emerald-50/40",
    badge: "bg-risk-low/10 text-risk-low ring-1 ring-risk-low/25",
  },
} as const;

export function ClauseCard({
  clause,
  eli18,
}: {
  clause: ClauseItem;
  eli18: boolean;
}) {
  const s = styles[clause.riskLevel];
  const body = eli18 ? clause.eli18Explanation : clause.explanation;

  return (
    <article
      className={`rounded-card border ${s.border} ${s.bg} p-4 shadow-sm sm:p-5`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-navy">{clause.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{body}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-badge px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${s.badge}`}
        >
          {clause.riskLevel} risk
        </span>
      </div>
      <blockquote className="mt-4 rounded-lg border border-white/60 bg-white/70 px-3 py-2 text-sm italic text-slate-600">
        “{clause.originalQuote}”
      </blockquote>
    </article>
  );
}
