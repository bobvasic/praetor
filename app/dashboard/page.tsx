import Link from "next/link";
import { Badge, Card, MetricCard } from "@/components/UI";
import { demoIncident, protectedAddresses } from "@/lib/demo-data";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Badge>Security command center</Badge>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">
            PRAETOR monitoring console
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-titanium/[0.78]">
            Institutional operations view for protected addresses, critical
            incidents, risk posture, and guided demo readiness.
          </p>
        </div>
        <Link
          href="/demo"
          className="rounded-md bg-gradient-to-r from-sovereign to-arctic px-6 py-3 text-center font-mono text-xs font-black uppercase tracking-[0.18em] text-obsidian shadow-glow"
        >
          Open guided demo
        </Link>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <MetricCard label="Monitoring" value="Active" tone="green" />
        <MetricCard label="Protected Addresses" value="4" tone="cyan" />
        <MetricCard label="Critical Incidents" value="1" tone="red" />
        <MetricCard label="Latest Risk" value="91" tone="gold" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-arctic">
                Perimeter
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Protected addresses
              </h2>
            </div>
            <Badge tone="green">Monitoring Active</Badge>
          </div>
          <div className="mt-6 space-y-4">
            {protectedAddresses.map((item) => (
              <div
                key={item.address}
                className="rounded-2xl border border-titanium/[0.10] bg-obsidian/[0.58] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-white">{item.label}</p>
                  <span className="rounded-md border border-secure/[0.35] bg-secure/[0.15] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 break-all font-mono text-sm text-arctic/[0.78]">
                  {item.address}
                </p>
                <p className="mt-3 text-sm text-titanium/[0.68]">{item.policy}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-alert">
                  Latest Incident
                </p>
                <h2 className="mt-3 text-2xl font-black text-white">
                  Treasury withdrawal above threshold
                </h2>
              </div>
              <Badge tone="red">Critical</Badge>
            </div>
            <div className="mt-6 rounded-2xl border border-alert/[0.30] bg-alert/[0.10] p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-titanium/[0.62]">
                    {demoIncident.protocolName}
                  </p>
                  <p className="mt-2 font-mono text-sm text-red-50">
                    {demoIncident.actionType} · {demoIncident.amount}
                  </p>
                </div>
                <p className="text-5xl font-black text-red-100">
                  {demoIncident.riskScore}
                </p>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-red-50">
                {demoIncident.reasons.map((reason) => (
                  <li key={reason}>• {reason}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-gold">
              Public security profile preview
            </p>
            <h2 className="mt-4 text-2xl font-black text-white">
              DemoDAO Treasury
            </h2>
            <p className="mt-3 text-titanium/[0.74]">
              PRAETOR protected Solana protocol with live treasury monitoring,
              critical incident attestations, and guardian challenge
              enforcement.
            </p>
            <div className="mt-5 rounded-xl border border-arctic/[0.20] bg-arctic/[0.10] p-4 font-mono text-sm text-arctic">
              praetores.com/profiles/demodao-treasury
            </div>
            <Link
              href="/demo"
              className="mt-5 inline-flex rounded-md border border-gold/[0.45] bg-gold/[0.10] px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-amber-100"
            >
              Run incident flow
            </Link>
          </Card>
        </div>
      </section>
    </main>
  );
}
