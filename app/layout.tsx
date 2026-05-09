import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Brand";
import { PraetorNetworkBackground } from "@/components/background/PraetorNetworkBackground";
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
      <body className="min-h-screen bg-[var(--praetor-deep-navy)] text-slate-100 antialiased">
        <PraetorNetworkBackground />
        <Header />
        {children}
      </body>
    </html>
  );
}
