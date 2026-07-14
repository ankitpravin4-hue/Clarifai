"use client";

export function RiskGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  const stroke =
    clamped >= 70 ? "#d73431" : clamped >= 40 ? "#e49e38" : "#439458";

  const label =
    clamped >= 70 ? "High Risk" : clamped >= 40 ? "Medium Risk" : "Low Risk";
  const labelColor =
    clamped >= 70
      ? "text-risk-high"
      : clamped >= 40
        ? "text-risk-medium"
        : "text-risk-low";

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={r}
            stroke="var(--border)"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={r}
            stroke={stroke}
            strokeWidth="10"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {Math.round(clamped)}
          </span>
          <span className={`text-[11px] font-semibold ${labelColor}`}>
            {label}
          </span>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">Overall risk score</p>
    </div>
  );
}
