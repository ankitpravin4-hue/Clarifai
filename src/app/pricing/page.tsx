"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/components/Toast";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const freeFeatures = [
  "3 contract analyses per month",
  "Risk score + clause breakdown",
  "Plain English summary",
  "ELI18 mode",
  "Analysis history",
];

const proFeatures = [
  "Unlimited contract analyses",
  "Everything in Free",
  "Negotiation letter generator",
  "Contract comparison",
  "Priority analysis",
  "PDF export",
];

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { showToast } = useToast();
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setCheckoutReady(true);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const handleUpgrade = async () => {
    if (!isSignedIn || !user) {
      router.push("/sign-in?redirect_url=/pricing");
      return;
    }

    if (!checkoutReady || !window.Razorpay) {
      showToast("Payment checkout is still loading. Try again.", "error");
      return;
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
      showToast("Razorpay is not configured.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-order", { method: "POST" });
      const order = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((order as { error?: string }).error || "Could not start checkout.");
      }

      const options = {
        key: keyId,
        amount: (order as { amount: number }).amount,
        currency: (order as { currency: string }).currency,
        name: "Clarifai",
        description: "Pro Plan - Monthly",
        order_id: (order as { id: string }).id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
            }),
          });
          const result = await verify.json().catch(() => ({}));
          if (verify.ok && (result as { success?: boolean }).success) {
            showToast("Welcome to Clarifai Pro!", "success");
            router.push("/analyze?upgraded=true");
          } else {
            showToast(
              (result as { error?: string }).error || "Payment verification failed.",
              "error"
            );
          }
        },
        prefill: {
          email: user.emailAddresses[0]?.emailAddress,
        },
        theme: { color: "#C9963C" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Could not open checkout.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-5 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </span>
          <h1 className="mt-3 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple plans for contract clarity
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Start free, upgrade when you need negotiation letters, comparisons,
            and unlimited analyses.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Free plan
            </p>
            <p className="mt-3 font-display text-4xl font-light text-foreground">
              ₹0
              <span className="text-base font-sans text-muted-foreground">/month</span>
            </p>
            <ul className="mt-8 space-y-3">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/analyze"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
            >
              Get started free
            </Link>
          </div>

          <div className="relative rounded-3xl border-2 border-primary bg-card p-8 shadow-sm">
            <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              Most popular
            </span>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Pro plan
            </p>
            <p className="mt-3 font-display text-4xl font-light text-foreground">
              ₹199
              <span className="text-base font-sans text-muted-foreground">/month</span>
            </p>
            <ul className="mt-8 space-y-3">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:translate-y-px disabled:opacity-50"
            >
              {loading ? "Opening checkout…" : "Get Pro"}
              {!loading && (
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
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
        </div>
      </div>
    </div>
  );
}
