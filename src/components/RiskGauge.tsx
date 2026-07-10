"use client";

export function RiskGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  const stroke =
    clamped >= 70 ? "#E24B4A" : clamped >= 40 ? "#EF9F27" : "#639922";

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={r}
            stroke="#e2e8f0"
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
          <span className="text-3xl font-bold tracking-tight text-navy">
            {Math.round(clamped)}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Risk score
          </span>
        </div>
      </div>
      <p className="text-center text-xs text-slate-500">
        Higher scores highlight more potential exposure — not a legal verdict.
      </p>
    </div>
  );
}
