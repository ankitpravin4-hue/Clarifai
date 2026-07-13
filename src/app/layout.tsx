import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { NavShell } from "@/components/NavShell";
import { Footer } from "@/components/Footer";
import { GlobalLoader } from "@/components/GlobalLoader";

export const metadata: Metadata = {
  title: "Clarifai — Contract intelligence before you sign",
  description:
    "Clarifai helps teams spot risky clauses, translate legalese, and compare agreements with AI-powered analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
