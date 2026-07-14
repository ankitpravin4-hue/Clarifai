import Link from "next/link";

function ScribbleUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 20"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      className={`absolute -bottom-2 left-0 h-3 w-full text-primary ${className}`}
    >
      <path
        d="M4 13.5C52 8.5 108 6 152 7.5C196 9 248 12 296 8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M10 17C60 14 120 13 176 14C220 14.8 262 16 292 14.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

const features = [
  {
    title: "Risky clause detection",
    body: "Every clause is scanned and flagged red, amber, or green so you instantly know where the danger is hiding.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Plain-English summaries",
    body: "Dense legalese rewritten into clear language, plus an ELI18 mode that explains it like you are eighteen.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 2v6h6M10 9H8M16 13H8M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Hidden penalty finder",
    body: "Auto-renewals, late fees, and uncapped liability surfaced before they cost you real money.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Side-by-side comparison",
    body: "Drop in two contracts and see exactly which terms differ and which agreement favors you.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7M11 18H8a2 2 0 0 1-2-2V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const steps = [
  {
    n: "1",
    title: "Upload your PDF",
    body: "Drop in any contract — an NDA, MSA, lease, or vendor agreement. Nothing leaves your control.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path d="M12 3v12m5-7-5-5-5 5M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: "2",
    title: "Get your risk report",
    body: "In seconds, see the overall score, flagged clauses, hidden penalties, and a plain-English summary.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="m16 16-1.9-1.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: "3",
    title: "Negotiate or sign",
    body: "Generate a negotiation letter for the terms you want changed, or sign knowing exactly what you agreed to.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path d="M13 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const audiences = [
  {
    title: "Founders",
    body: "Review investor terms, SAFEs, and vendor MSAs before your lawyer even opens their inbox.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Freelancers",
    body: "Catch scope creep, IP grabs, and payment traps in client agreements you sign every week.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="2" />
        <rect width="20" height="14" x="2" y="6" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Small businesses",
    body: "Understand leases, supplier deals, and service contracts without paying hourly legal fees.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
        <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" stroke="currentColor" strokeWidth="2" />
        <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" stroke="currentColor" strokeWidth="2" />
        <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Home() {
  const circumference = 2 * Math.PI * 84;
  const score = 68;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden paper-grain">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
            backgroundSize: "30px 30px",
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent 78%)",
          }}
        />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-risk-low opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-risk-low" />
              </span>
              Reads the fine print so you don&apos;t have to
            </span>

            <h1 className="mt-6 font-display text-[2.6rem] font-light leading-[1.02] tracking-tight text-foreground sm:text-6xl">
              Know what you&apos;re
              <br />
              signing{" "}
              <span className="relative inline-block font-medium italic text-foreground">
                before
                <ScribbleUnderline />
              </span>{" "}
              you sign.
            </h1>

            <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Paste in that contract nobody wants to read. Clarifai flags the
              clauses that could bite you, scores the risk out of 100, and{" "}
              <span className="highlight-swipe font-medium text-foreground">
                explains it like a friend who happens to be a lawyer.
              </span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/analyze"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:translate-y-px"
              >
                Analyze my contract
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  aria-hidden
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-base font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
              >
                Compare two versions
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <svg
                viewBox="0 0 120 90"
                fill="none"
                aria-hidden
                className="h-7 w-7 shrink-0 -scale-x-100"
                style={{ color: "var(--ink)" }}
              >
                <path
                  d="M8 8C40 20 78 34 96 66"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M96 66L74 60M96 66L88 44"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
              </svg>
              <p
                className="font-hand text-xl leading-none"
                style={{ color: "var(--ink)" }}
              >
                sign in to analyze your first contract free
              </p>
            </div>
          </div>

          {/* Preview card */}
          <div className="relative">
            <div className="tilt-right absolute -right-3 -top-6 z-10 hidden max-w-[9rem] rounded-sm bg-highlight/70 px-3 py-2 shadow-md sm:block">
              <p className="font-hand text-lg leading-tight text-foreground/80">
                read this part twice!
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-foreground/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Analysis complete
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    Master_Services_Agreement.pdf
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-risk-low/10 text-risk-low">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              <div className="mt-6 flex items-center gap-5 rounded-2xl bg-secondary/60 p-5">
                <div className="relative inline-flex items-center justify-center">
                  <svg width="120" height="120" viewBox="0 0 192 192" className="-rotate-90 sm:h-40 sm:w-40" aria-hidden>
                    <circle cx="96" cy="96" r="84" fill="none" strokeWidth="12" className="stroke-border" />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      fill="none"
                      strokeWidth="12"
                      strokeLinecap="round"
                      stroke="var(--risk-high)"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-4xl font-bold sm:text-5xl">{score}</span>
                    <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-risk-high">
                      High Risk
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Overall risk score
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    6 clauses reviewed. 2 need your attention before signing.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="relative flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                  <svg
                    viewBox="0 0 220 110"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-2 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+1rem)]"
                  >
                    <path
                      d="M138 8C86 2 40 10 20 34C2 56 14 84 62 96C112 108 176 104 200 78C220 56 210 26 168 12C142 4 108 3 84 9"
                      stroke="var(--ink)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                  </svg>
                  <span className="mt-0.5 h-full w-1 shrink-0 self-stretch rounded-full bg-risk-high" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        Unlimited Liability
                      </p>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-risk-high px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-risk-high-foreground">
                        <span className="size-1.5 rounded-full bg-current opacity-80" />
                        High Risk
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No cap on damages — you could owe far more than the
                      contract is worth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                  <span className="mt-0.5 h-full w-1 shrink-0 self-stretch rounded-full bg-risk-medium" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        Automatic Renewal
                      </p>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-risk-medium px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-risk-medium-foreground">
                        <span className="size-1.5 rounded-full bg-current opacity-80" />
                        Medium Risk
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Renews for 12 months unless cancelled 90 days early.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            What you get
          </span>
          <h2 className="mt-3 text-pretty font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            A full legal review,{" "}
            <span className="relative inline-block font-medium italic">
              minus the lawyer
              <ScribbleUnderline className="-bottom-1.5 h-2.5" />
            </span>
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Everything you need to sign with confidence — built for people who
            read contracts between meetings, not billable hours.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {f.icon}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </span>
            <h2 className="mt-3 text-pretty font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              From upload to understanding in three steps
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="relative rounded-2xl border border-border bg-card p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {s.icon}
                  </span>
                  <span className="font-hand text-5xl font-bold leading-none text-primary/35">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Who it&apos;s for
          </span>
          <h2 className="mt-3 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for people who can&apos;t keep a lawyer on speed dial
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {a.icon}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {a.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-16 text-center md:px-16 md:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-pretty text-3xl font-semibold tracking-tight text-background sm:text-4xl">
              Stop signing contracts you don&apos;t fully understand
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-background/70">
              Upload your first contract free and get a full risk report in
              seconds. No credit card, no legalese.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:translate-y-px"
              >
                Analyze a contract free
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  aria-hidden
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/faq"
                className="inline-flex h-12 items-center justify-center rounded-full border border-background/20 px-6 text-base font-semibold text-background transition-colors hover:bg-background/10"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
