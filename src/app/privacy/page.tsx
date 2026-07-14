import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Clarifai",
  description: "How Clarifai handles account and contract analysis data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-5 py-14 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Legal
        </p>
        <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: 13 July 2026 ·{" "}
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms
          </Link>
        </p>

        <div className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 text-sm leading-relaxed text-muted-foreground">
          <p>
            Clarifai uses authentication providers to manage sign-in. When you
            are signed in, analysis summaries (scores, clause insights, and
            related metadata) may be stored so you can reopen them from History.
          </p>
          <p>
            Uploaded PDFs are processed to extract text and generate analysis.
            We do not sell your contract contents. Do not upload documents you
            are not authorized to share with analysis tooling.
          </p>
          <p>
            Third-party services (hosting, authentication, AI inference, and
            databases) process data as needed to operate the Service under their
            own policies.
          </p>
          <p>
            For product questions, see our{" "}
            <Link href="/faq" className="font-medium text-primary hover:underline">
              FAQ
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
