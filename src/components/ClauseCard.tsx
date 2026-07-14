import type { ClauseItem } from "@/types/analysis";

const styles = {
  high: {
    border: "border-risk-high/25",
    bg: "bg-risk-high/5",
    badge: "bg-risk-high/10 text-risk-high",
  },
  medium: {
    border: "border-risk-medium/25",
    bg: "bg-risk-medium/5",
    badge: "bg-risk-medium/10 text-risk-medium",
  },
  low: {
    border: "border-risk-low/25",
    bg: "bg-risk-low/5",
    badge: "bg-risk-low/10 text-risk-low",
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
      className={`rounded-2xl border ${s.border} ${s.bg} p-4 sm:p-5`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">{clause.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${s.badge}`}
        >
          {clause.riskLevel} risk
        </span>
      </div>
      <blockquote className="mt-4 rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-sm italic text-muted-foreground">
        “{clause.originalQuote}”
      </blockquote>
    </article>
  );
}
