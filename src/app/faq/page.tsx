import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — Clarifai",
  description: "Frequently asked questions about Clarifai contract analysis.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">
          Help
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Quick answers about what Clarifai is — and what it is not.
        </p>
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </div>
    </div>
  );
}
