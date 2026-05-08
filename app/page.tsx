import Link from "next/link";
import { Wordmark } from "@/components/Brand";
import { Badge, Card, SectionTitle } from "@/components/UI";
import { flowSteps } from "@/lib/demo-data";

const flowDescriptions = [
  "Observe protected wallets, signer identity, threshold breaches, and privileged instructions.",
  "Package deterministic evidence into a security attestation for public review.",
  "Route critical actions into a guardian challenge before execution completes.",
  "Deny unsafe operations while policy risk remains unresolved.",
];

const consoleRows = [
  ["MONITOR", "DemoDAO Treasury", "ACTIVE"],
  ["SIGNER", "Unknown signer", "CRITICAL"],
  ["DESTINATION", "Non-allowlisted wallet", "CRITICAL"],
  ["POLICY", "Guardian challenge required", "ARMED"],
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 md:pt-24 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div>
          <Badge tone="gold">Institutional On-Chain Ops Firewall</Badge>
          <div className="mt-8 max-w-md">
            <Wordmark />
          </div>
          <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-[-0.055em] text-white md:text-7xl">
            Onchain Ops Firewall for Solana Protocols
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-titanium/[0.82]">
            PRAETOR detects risky privileged actions, attests evidence, enables
            guardian challenges, and blocks unsafe execution before protocol
            operations become incidents.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="rounded-md bg-gradient-to-r from-sovereign to-arctic px-7 py-4 text-center font-mono text-sm font-black uppercase tracking-[0.18em] text-obsidian shadow-glow transition hover:scale-[1.015]"
            >
              Run guided demo
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-titanium/[0.15] bg-titanium/[0.05] px-7 py-4 text-center font-mono text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-arctic/[0.35] hover:bg-arctic/[0.10]"
            >
              View command center
            </Link>
          </div>
        </div>

        <Card className="p-0">
          <div className="border-b border-titanium/[0.10] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-arctic">
                  Live Security Console
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  DemoDAO Treasury
                </p>
              </div>
              <Badge tone="green">Monitoring Active</Badge>
            </div>
          </div>
          <div className="space-y-3 p-5">
            {consoleRows.map(([kind, value, status]) => (
              <div
                key={kind}
                className="grid grid-cols-[0.5fr_1fr_auto] items-center gap-4 rounded-xl border border-titanium/[0.10] bg-obsidian/[0.62] px-4 py-3 font-mono text-xs"
              >
                <span className="text-titanium/[0.48]">{kind}</span>
                <span className="text-titanium">{value}</span>
                <span
                  className={
                    status === "CRITICAL" ? "text-alert" : "text-arctic"
                  }
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
          <div className="mx-5 mb-5 rounded-xl border border-gold/[0.25] bg-gold/[0.10] p-5 shadow-gold">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-100">
              Firewall outcome
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              Execution blocked by Praetor policy.
            </p>
          </div>
        </Card>
      </section>

      <section id="flow" className="border-y border-titanium/[0.10] bg-graphite/[0.25] px-6 py-24">
        <SectionTitle
          eyebrow="Core flow"
          title="Detect → Attest → Challenge → Block"
          body="A focused policy loop for treasury withdrawals, upgrade authority interactions, signer anomalies, and non-allowlisted destinations."
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-4">
          {flowSteps.map((step, index) => (
            <Card key={step} className="min-h-56">
              <p className="font-mono text-xs font-bold text-arctic">
                0{index + 1}
              </p>
              <h2 className="mt-5 text-2xl font-black text-white">{step}</h2>
              <p className="mt-4 text-sm leading-6 text-titanium/[0.72]">
                {flowDescriptions[index]}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <Card className="p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <Badge tone="green">Demo-ready MVP</Badge>
              <h2 className="mt-6 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">
                Premium security UX for the Colosseum demo.
              </h2>
              <p className="mt-5 text-lg leading-8 text-titanium/[0.78]">
                The guided demo uses deterministic local logic to simulate a
                critical treasury withdrawal and show the exact firewall moment:
                detection, attestation, guardian challenge, and blocked
                execution.
              </p>
            </div>
            <div className="rounded-2xl border border-arctic/[0.20] bg-arctic/[0.08] p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-arctic">
                Start here
              </p>
              <p className="mt-4 text-3xl font-black text-white">
                Trigger the incident, then block it.
              </p>
              <Link
                href="/demo"
                className="mt-7 inline-flex rounded-md bg-white px-6 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-obsidian"
              >
                Open /demo
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
