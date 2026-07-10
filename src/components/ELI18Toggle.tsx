"use client";

export function ELI18Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-line bg-slate-50 px-3 py-2 shadow-sm">
      <span
        className={`text-xs font-semibold ${!value ? "text-navy" : "text-slate-400"}`}
      >
        Legal tone
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-7 w-12 rounded-full transition ${
          value ? "bg-accent" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            value ? "left-5" : "left-0.5"
          }`}
        />
      </button>
      <span
        className={`text-xs font-semibold ${value ? "text-navy" : "text-slate-400"}`}
      >
        ELI18
      </span>
    </div>
  );
}
