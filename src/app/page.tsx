import Link from "next/link";

const features = [
  {
    title: "Risk detection",
    body: "Surface one-sided indemnities, aggressive termination, and payment traps before they become your problem.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Plain English",
    body: "Every scan pairs precise legal tone with an ELI18 view so stakeholders stay aligned without a law degree.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M7 8h10M7 12h6M7 16h10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Compare contracts",
    body: "Upload two drafts, align clause risk side-by-side, and walk into negotiations with a clear delta story.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M9 4h6v16H9zM4 7h4v10H4zM16 7h4v10h-4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="bg-navy text-white">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(24,95,165,0.45),_transparent_55%)]" />
        <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:flex-row lg:items-center lg:gap-12 lg:pt-24">
          <div className="flex-1 space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
              Clarifai
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Private beta
            </p>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Scan your contract before you sign
              </h1>
              <p className="max-w-xl text-lg text-slate-200 sm:text-xl">
                Clarifai pairs secure PDF ingestion with AI reasoning to flag
                risky clauses, translate legalese, and keep your team aligned in
                minutes — not weeks.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-navy shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Start a scan
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Compare two contracts
              </Link>
            </div>
            <dl className="grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm text-slate-200">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Model
                </dt>
                <dd className="mt-1 font-semibold text-white">AI</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Files
                </dt>
                <dd className="mt-1 font-semibold text-white">PDF · DOCX UI*</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Footprint
                </dt>
                <dd className="mt-1 font-semibold text-white">No auth · no DB</dd>
              </div>
            </dl>
            <p className="text-[11px] text-slate-400">
              *DOCX uploads are accepted in the UI; analysis currently runs on PDF
              text extraction only.
            </p>
          </div>

          <div className="flex-1">
            <div className="relative rounded-card border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/40 blur-2xl" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Live preview</p>
                  <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                    Low touch
                  </span>
                </div>
                <div className="space-y-3 rounded-lg border border-white/10 bg-navy/60 p-4 text-sm text-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Risk score</span>
                    <span className="font-semibold text-amber-200">68 / 100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-red-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    “Unlimited liability” and “net 90” show up together — classic
                    cash-flow squeeze patterns we highlight automatically.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
                    <p className="font-semibold text-white">Clause cards</p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Color-coded risk bands with verbatim quotes for audit trails.
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
                    <p className="font-semibold text-white">Exports</p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Structured PDFs plus optional visual snapshots for busy execs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gradient-to-b from-navy to-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need for a crisp first pass
            </h2>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Clarifai is not a law firm — it is an accelerator for legal, finance,
              and founders who need structured signal fast.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col rounded-card border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-sky-100">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950 py-10 text-center text-xs text-slate-500">
        Clarifai is a demo experience — always involve qualified counsel before
        you sign.
      </footer>
    </main>
  );
}
