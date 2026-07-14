import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Caveat, Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { NavShell } from "@/components/NavShell";
import { Footer } from "@/components/Footer";
import { GlobalLoader } from "@/components/GlobalLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clarifai — AI Legal Contract Analyzer",
  description:
    "Upload any contract and get an instant risk score, flagged clauses, hidden penalties, and a plain-English summary. Legal clarity for founders, freelancers, and small businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${caveat.variable} bg-background`}
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <ClerkProvider>
          <ToastProvider>
            <div className="relative z-0 isolate flex min-h-screen flex-col">
              <NavShell />
              <main className="flex-1">
                <Suspense fallback={<GlobalLoader />}>{children}</Suspense>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
