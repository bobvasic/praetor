import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Brand";
import { SecurityBackground } from "@/src/components/background/security-background";
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
        <SecurityBackground />
        <Header />
        {children}
      </body>
    </html>
  );
}
