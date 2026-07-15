"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/Toast";
import type { ClauseItem, ContractAnalysis } from "@/types/analysis";
import { isContractAnalysis } from "@/types/analysis";

const LEXSCAN_ANALYSIS_KEY = "lexscan-analysis";

const NegotiatePdfButton = dynamic(
  () =>
    import("@/components/NegotiatePdfButton").then((mod) => ({
      default: mod.NegotiatePdfButton,
    })),
  { ssr: false, loading: () => null }
);

const CONTRACT_TYPES = [
  "NDA",
  "Service Agreement",
  "Employment Contract",
  "Vendor Agreement",
  "SaaS Agreement",
] as const;

type NegotiateFormData = {
  name: string;
  company: string;
  email: string;
  recipientName: string;
  recipientCompany: string;
  contractRef: string;
  contractType: string;
};

type NegotiationLetter = {
  subject: string;
  opening: string;
  clauses: { number: number; title: string; body: string }[];
  closing: string;
  valediction: string;
};

const emptyForm: NegotiateFormData = {
  name: "",
  company: "",
  email: "",
  recipientName: "",
  recipientCompany: "",
  contractRef: "",
  contractType: "NDA",
};

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

function formatLetterDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function riskBadgeClass(risk: string): string {
  if (risk === "high") return "bg-risk-high/10 text-risk-high";
  if (risk === "medium") return "bg-risk-medium/10 text-risk-medium";
  return "bg-risk-low/10 text-risk-low";
}

function buildPlainLetter(
  letter: NegotiationLetter,
  form: NegotiateFormData,
  dateStr: string
): string {
  const lines: string[] = [
    "WITHOUT PREJUDICE",
    "",
    form.name,
    form.company,
    form.email,
    "",
    dateStr,
    "",
    `Contract reference: ${form.contractRef}`,
    "",
    form.recipientName,
    form.recipientCompany,
    "",
    `Re: ${letter.subject}`,
    "",
    `Dear ${form.recipientName},`,
    "",
    letter.opening,
    "",
  ];
  for (const c of letter.clauses) {
    lines.push(`${c.number}. ${c.title}`);
    lines.push(c.body);
    lines.push("");
  }
  lines.push(
    letter.closing,
    "",
    letter.valediction + ",",
    "",
    "________________________",
    "",
    form.name,
    form.company
  );
  return lines.join("\n");
}

export default function NegotiatePage() {
  const { showToast } = useToast();
  const [hydrated, setHydrated] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [form, setForm] = useState<NegotiateFormData>(emptyForm);
  const [clauseChecked, setClauseChecked] = useState<boolean[]>([]);
  const [letter, setLetter] = useState<NegotiationLetter | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const letterDate = useMemo(() => formatLetterDate(new Date()), []);

  useEffect(() => {
    const raw = sessionStorage.getItem(LEXSCAN_ANALYSIS_KEY);
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (isContractAnalysis(parsed)) {
          setAnalysis(parsed);
          setClauseChecked(parsed.clauses.map((c) => c.riskLevel === "high"));
        }
      } catch {
        /* ignore */
      }
    }
    setHydrated(true);
  }, []);

  const toggleClause = useCallback((index: number) => {
    setClauseChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const formValid = useMemo(() => {
    return (
      form.name.trim() &&
      form.company.trim() &&
      form.email.trim() &&
      form.recipientName.trim() &&
      form.recipientCompany.trim() &&
      form.contractRef.trim() &&
      form.contractType
    );
  }, [form]);

  const generateLetter = async () => {
    if (!analysis) return;
    if (!formValid) {
      showToast("Please complete all form fields.", "error");
      return;
    }
    const selected = analysis.clauses.filter((_, i) => clauseChecked[i]);
    if (selected.length === 0) {
      showToast("Select at least one clause for the letter.", "error");
      return;
    }

    setGenerating(true);
    setLetter(null);
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: form,
          selectedClauses: selected,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (
          res.status === 403 &&
          (data as { upgrade?: boolean }).upgrade
        ) {
          setShowUpgradeModal(true);
          return;
        }
        throw new Error((data as { error?: string }).error || "Generation failed");
      }
      setLetter(data as NegotiationLetter);
      showToast("Negotiation letter generated.", "success");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Could not generate letter.",
        "error"
      );
    } finally {
      setGenerating(false);
    }
  };

  const copyLetter = async () => {
    if (!letter) return;
    const text = buildPlainLetter(letter, form, letterDate);
    try {
      await navigator.clipboard.writeText(text);
      showToast("Letter copied to clipboard.", "success");
    } catch {
      showToast("Could not copy to clipboard.", "error");
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background px-5 py-16 text-foreground">
        <div className="mx-auto max-w-5xl animate-pulse rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="h-6 w-48 rounded bg-secondary" />
          <div className="mt-4 h-10 w-2/3 rounded bg-secondary" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background px-5 py-16 text-foreground">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden>
              <path
                d="M13 21h8M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Analyze a contract first
          </h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Run a contract scan, then open the negotiation letter from your
            results.
          </p>
          <Link
            href="/analyze"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105"
          >
            Go to Analyze
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
              <path
                d="M5 12h14m-7-7 7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-5 py-14 md:py-20">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Negotiation letter
          </span>
          <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ask for better terms — professionally
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Pick the clauses you want changed and Clarifai drafts a polished
            letter you can send in seconds.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Your name
                </label>
                <input
                  placeholder="Jordan Lee"
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Your company
                </label>
                <input
                  placeholder="Acme Labs"
                  className={inputClass}
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Your email
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Counterparty name
                </label>
                <input
                  placeholder="Alex Rivera"
                  className={inputClass}
                  value={form.recipientName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, recipientName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Counterparty
                </label>
                <input
                  placeholder="Acme Corp"
                  className={inputClass}
                  value={form.recipientCompany}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      recipientCompany: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Contract reference
                </label>
                <input
                  placeholder="e.g. NDA-2025-001"
                  className={inputClass}
                  value={form.contractRef}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contractRef: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Contract type
                </label>
                <select
                  className={`${inputClass} bg-background`}
                  value={form.contractType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contractType: e.target.value }))
                  }
                >
                  {CONTRACT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-foreground">
                Clauses to negotiate
              </span>
              <div className="space-y-2">
                {analysis.clauses.map((c: ClauseItem, idx: number) => {
                  const checked = clauseChecked[idx] ?? false;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleClause(idx)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        checked
                          ? "border-primary/50 bg-primary/5"
                          : "border-border bg-background hover:border-primary/30"
                      }`}
                    >
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card"
                        }`}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 24 24"
                            className="size-3.5"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M20 6 9 17l-5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground">
                          {c.name}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${riskBadgeClass(c.riskLevel)}`}
                      >
                        {c.riskLevel} risk
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={generateLetter}
              disabled={generating || !formValid}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:translate-y-px disabled:opacity-50"
            >
              {generating ? "Generating…" : "Generate letter"}
              {!generating && (
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12h14m-7-7 7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Your letter</h2>
            {!letter ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Fill in the details and hit generate. Your negotiation letter
                will appear here, ready to copy and send.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyLetter}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
                  >
                    Copy letter
                  </button>
                  <NegotiatePdfButton
                    letter={letter}
                    form={form}
                    letterDate={letterDate}
                    onDownloaded={() => showToast("PDF downloaded.", "success")}
                  />
                </div>

                <article className="rounded-xl border border-border bg-background p-6 sm:p-8">
                  <div className="font-serif text-foreground">
                    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Without prejudice
                    </p>

                    <div className="mt-8 flex justify-between gap-6 text-sm leading-relaxed">
                      <div>
                        <p className="font-semibold">{form.name}</p>
                        <p>{form.company}</p>
                        <p className="text-muted-foreground">{form.email}</p>
                      </div>
                      <div className="text-right text-muted-foreground">
                        {letterDate}
                      </div>
                    </div>

                    <p className="mt-8 text-sm">
                      <span className="font-semibold">Contract reference:</span>{" "}
                      {form.contractRef}
                    </p>

                    <div className="mt-6 text-sm leading-relaxed">
                      <p className="font-semibold">{form.recipientName}</p>
                      <p>{form.recipientCompany}</p>
                    </div>

                    <p className="mt-6 text-sm">
                      <span className="font-semibold">Re:</span> {letter.subject}
                    </p>

                    <p className="mt-6 text-sm leading-relaxed">
                      Dear {form.recipientName},
                    </p>

                    <p className="mt-4 text-[10pt] leading-relaxed text-foreground/90">
                      {letter.opening}
                    </p>

                    <div className="mt-6 space-y-5">
                      {letter.clauses.map((c) => (
                        <section
                          key={c.number}
                          className="text-[10pt] leading-relaxed"
                        >
                          <h3 className="text-[11pt] font-semibold text-foreground">
                            {c.number}. {c.title}
                          </h3>
                          <p className="mt-2 text-foreground/90">{c.body}</p>
                        </section>
                      ))}
                    </div>

                    <p className="mt-6 text-[10pt] leading-relaxed text-foreground/90">
                      {letter.closing}
                    </p>

                    <p className="mt-6 text-sm">{letter.valediction},</p>

                    <hr className="mt-8 border-border" />

                    <p className="mt-6 text-sm font-semibold">{form.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {form.company}
                    </p>
                  </div>

                  <p className="mt-10 text-center text-[9px] text-muted-foreground">
                    This letter is generated by Clarifai and does not constitute
                    legal advice.
                  </p>
                </article>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showUpgradeModal}
        title="Upgrade to Pro"
        onClose={() => setShowUpgradeModal(false)}
      >
        <p>
          Negotiation letters are a Pro feature. Upgrade to Pro for ₹199/month
          to generate polished letters from your analysis.
        </p>
        <Link
          href="/pricing"
          onClick={() => setShowUpgradeModal(false)}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105"
        >
          Upgrade to Pro
        </Link>
      </Modal>
    </div>
  );
}
