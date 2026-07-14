"use client";

export function SummaryBox({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-foreground">{text}</p>
    </section>
  );
}
