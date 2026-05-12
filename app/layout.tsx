import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/Brand";
import AgenticHeroBackground from "@/components/background/AgenticHeroBackground";
import "./globals.css";

// Route Segment Config: production on DigitalOcean/Cloudflare has repeatedly
// served stale prerendered root HTML across deploys. Keep the shell dynamic and
// no-store so `/` cannot be pinned to an old `/app` artifact.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRAETOR | Onchain Ops Firewall for Solana Protocols",
  description:
    "Detect, attest, challenge, and block high-risk privileged actions for Solana protocols.",
  applicationName: "PRAETOR",
  metadataBase: new URL("https://praetores.com"),
  // Icons are emitted by file conventions (app/icon.tsx, app/apple-icon.tsx)
  // and the manifest is wired by app/manifest.ts. Phantom and other Solana
  // wallets pick the dApp logo up from the auto-injected <link rel="icon">
  // and <link rel="apple-touch-icon"> tags.
  openGraph: {
    title: "PRAETOR",
    description: "Onchain Ops Firewall for Solana Protocols",
    url: "https://praetores.com",
    siteName: "PRAETOR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="relative isolate min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
        >
          <AgenticHeroBackground />
        </div>
        <div className="relative z-10">
          <Header />
          {children}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 left-0 right-0 z-[60] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      </body>
    </html>
  );
}
