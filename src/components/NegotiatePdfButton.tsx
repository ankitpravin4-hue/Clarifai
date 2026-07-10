"use client";

import { useCallback, useState } from "react";

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

export function NegotiatePdfButton({
  letter,
  form,
  letterDate,
  onDownloaded,
}: {
  letter: NegotiationLetter;
  form: NegotiateFormData;
  letterDate: string;
  onDownloaded: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const handleDownload = useCallback(async () => {
    if (typeof window === "undefined") return;

    setBusy(true);
    try {
      const { buildNegotiationPdf } = await import(
        "@/lib/client/build-negotiation-pdf"
      );
      const safeRef = form.contractRef.replace(/[^a-zA-Z0-9-_]/g, "_");
      const doc = await buildNegotiationPdf(letter, form, letterDate);
      if (!doc) return;
      doc.save(`negotiation_letter_${safeRef}.pdf`);
      onDownloaded();
    } finally {
      setBusy(false);
    }
  }, [form, letter, letterDate, onDownloaded]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className="rounded-lg border border-line bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? "Preparing…" : "Download PDF"}
    </button>
  );
}
