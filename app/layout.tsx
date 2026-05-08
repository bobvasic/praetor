import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRAETOR | Onchain Ops Firewall for Solana Protocols",
  description:
    "Detect, attest, challenge, and block high-risk privileged actions for Solana protocols.",
  metadataBase: new URL("https://praetores.com"),
  openGraph: {
    title: "PRAETOR",
    description: "Onchain Ops Firewall for Solana Protocols",
    url: "https://praetores.com",
    siteName: "PRAETOR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-slate-100 antialiased">
        <div className="fixed inset-0 -z-10 bg-radial-grid" />
        <div className="grid-mask fixed inset-0 -z-10 opacity-70" />
        <Header />
        {children}
      </body>
    </html>
  );
}
