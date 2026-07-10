import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { NavShell } from "@/components/NavShell";

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
      <body className="min-h-screen font-sans antialiased">
        <ClerkProvider>
          <ToastProvider>
          <div className="relative z-0 isolate">
          <NavShell />
          {children}
          </div>
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}