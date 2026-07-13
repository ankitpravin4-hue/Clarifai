import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions — Clarifai",
  description: "Terms governing use of the Clarifai AI contract analysis platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using Clarifai (“Service”), you agree to these Terms and Conditions. If you do not agree, do not use the Service. Continued use after updates constitutes acceptance of the revised terms.`,
  },
  {
    title: "2. Description of Service",
    body: `Clarifai provides AI-assisted contract analysis tools, including PDF upload, risk scoring, clause flagging, plain-English summaries (including ELI18 mode), comparison views, negotiation letter drafts, and optional analysis history for signed-in users. Features may change as we improve the product.`,
  },
  {
    title: "3. Disclaimer — Not Legal Advice",
    body: `Clarifai is not a law firm and does not provide legal advice, legal opinions, or attorney-client representation. Outputs are informational only and may contain errors or omissions. You must independently verify all results and consult a licensed attorney before signing, negotiating, or relying on any contract.`,
  },
  {
    title: "4. User Responsibilities",
    body: `You are responsible for (a) the legality of documents you upload; (b) securing your account credentials; (c) not uploading malware or content you lack rights to process; (d) ensuring sensitive personal data is handled lawfully; and (e) using the Service in compliance with applicable laws. You must not reverse engineer, abuse rate limits, or use the Service to harm others.`,
  },
  {
    title: "5. Intellectual Property",
    body: `Clarifai branding, software, UI, and documentation remain our property or that of our licensors. You retain rights to your uploaded contracts. By using the Service, you grant us a limited license to process your documents solely to provide analysis and related features you request.`,
  },
  {
    title: "6. Limitation of Liability",
    body: `To the fullest extent permitted by law, Clarifai and its operators are not liable for indirect, incidental, special, consequential, or punitive damages, or for any loss arising from reliance on AI outputs, downtime, data loss, or third-party services (including AI providers, auth, and hosting). The Service is provided “as is” without warranties of merchantability, fitness for a particular purpose, or non-infringement.`,
  },
  {
    title: "7. Privacy",
    body: `Our handling of account and analysis data is described in the Privacy page. When signed in, analysis summaries may be stored for History. Do not upload documents you are not authorized to process. Review Privacy for more detail.`,
  },
  {
    title: "8. Changes to Terms",
    body: `We may update these Terms from time to time. Material changes will be reflected on this page with an updated effective date. Your continued use of Clarifai after changes take effect constitutes acceptance of the updated Terms.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms and Conditions
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Last updated: 13 July 2026 ·{" "}
          <Link href="/privacy" className="font-medium text-accent hover:underline">
            Privacy
          </Link>
        </p>

        <div className="mt-10 space-y-8 rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-navy">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
