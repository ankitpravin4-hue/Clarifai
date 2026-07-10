"use client";

export function SummaryBox({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="rounded-card border border-line bg-gradient-to-br from-white to-slate-50 p-5 shadow-card sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-slate-800">{text}</p>
    </section>
  );
}
