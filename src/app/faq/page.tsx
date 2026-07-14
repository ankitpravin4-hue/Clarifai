import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — Clarifai",
  description: "Frequently asked questions about Clarifai contract analysis.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-5 py-14 md:py-20">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          Help
        </span>
        <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Quick answers about what Clarifai is — and what it is not.
        </p>
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </div>
    </div>
  );
}
