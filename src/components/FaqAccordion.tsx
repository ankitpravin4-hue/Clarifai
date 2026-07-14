"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is Clarifai a law firm?",
    a: "No. Clarifai is an AI-powered contract analysis tool. It is not a law firm and does not provide legal advice, representation, or attorney-client privilege. Always consult a qualified lawyer for binding decisions.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Clarifai uses large language models to surface likely risks, clauses, and negotiation points. Accuracy depends on document quality and model reasoning. Treat results as a first-pass signal — always verify against the source PDF and professional counsel.",
  },
  {
    q: "What file types are supported?",
    a: "Analysis currently runs on PDF files up to 20MB. The UI may accept DOCX for convenience, but you should convert DOCX to PDF before analyzing.",
  },
  {
    q: "Is my contract data stored?",
    a: "When you are signed in, analysis summaries can be saved to your History for later review. Uploaded PDF files are processed for analysis and are not intended as a long-term document vault. Review our Privacy page for details.",
  },
  {
    q: "How does the risk score work?",
    a: "The risk score is a 0–100 model estimate based on flagged clauses, liability language, payment terms, and related signals. Higher scores indicate more caution is warranted — not a definitive legal finding.",
  },
  {
    q: "What is ELI18 mode?",
    a: "ELI18 (“Explain Like I’m 18”) rewrites summaries and clause explanations into plainer English so non-lawyers can follow the gist quickly without losing the core risk story.",
  },
  {
    q: "Can I use this for court?",
    a: "No. Clarifai outputs are informational and are not court filings, expert testimony, or legal opinions. Do not rely on them as evidence or advice for litigation.",
  },
  {
    q: "Is Clarifai free?",
    a: "Clarifai is currently offered as a demo / private beta experience. Features, limits, and pricing may change as the product evolves.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.q}
            className="rounded-2xl border border-border bg-card shadow-sm"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span className="text-sm font-semibold text-foreground sm:text-base">
                {item.q}
              </span>
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-lg font-semibold text-primary"
                aria-hidden
              >
                {open ? "−" : "+"}
              </span>
            </button>
            {open && (
              <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
