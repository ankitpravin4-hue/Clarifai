import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Clarifai",
  description:
    "Making legal clarity accessible to everyone with AI-powered contract analysis.",
};

const steps = [
  {
    title: "Upload",
    body: "Drop in a PDF contract. Clarifai extracts the text securely for analysis.",
  },
  {
    title: "Analyze",
    body: "AI maps risk scores, flagged clauses, hidden penalties, and plain-English summaries.",
  },
  {
    title: "Act",
    body: "Export reports, compare drafts, draft negotiation letters, and revisit History when signed in.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">
          About Clarifai
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Making legal clarity accessible to everyone
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Contracts should not require a week of redlines before you understand the
          risk. Clarifai helps founders, operators, and counsel get a structured
          first pass — fast.
        </p>

        <section className="mt-10 rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-semibold text-navy">What Clarifai does</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Clarifai scans PDF agreements, surfaces risky clauses with source
            quotes, translates legalese into ELI18 summaries, compares two drafts
            side by side, and helps you generate without-prejudice negotiation
            letters. It is an accelerator — not a substitute for a lawyer.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-navy">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="rounded-card border border-line bg-white p-5 shadow-card"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-accent">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-semibold text-navy">Built with AI</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Clarifai uses modern large language models to reason over extracted
            contract text. AI can miss nuance or invent structure — always verify
            against the original PDF and involve qualified counsel before you sign.
          </p>
          <Link
            href="/analyze"
            className="mt-6 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90"
          >
            Start a scan
          </Link>
        </section>
      </div>
    </div>
  );
}
