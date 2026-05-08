import { Badge, Card } from "@/components/UI";
import { demoIncident, protectedAddresses } from "@/lib/demo-data";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Badge>Security dashboard</Badge>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
            Praetor command center
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            A clean operational view for protected addresses, incidents, risk
            posture, monitoring status, and the public security profile.
          </p>
        </div>
        <Badge tone="green">All monitors online</Badge>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-400">Protected addresses</p>
          <p className="mt-3 text-4xl font-black text-white">3</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Open incidents</p>
          <p className="mt-3 text-4xl font-black text-white">1</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Highest risk score</p>
          <p className="mt-3 text-4xl font-black text-red-100">91</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Monitoring status</p>
          <p className="mt-3 text-4xl font-black text-emerald-100">Live</p>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-white">
              Protected addresses
            </h2>
            <Badge tone="green">Monitoring</Badge>
          </div>
          <div className="mt-6 space-y-4">
            {protectedAddresses.map((item) => (
              <div
                key={item.address}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-white">{item.label}</p>
                  <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 break-all font-mono text-sm text-cyan-100">
                  {item.address}
                </p>
                <p className="mt-3 text-sm text-slate-400">{item.policy}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-black text-white">Incidents</h2>
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">
                    Critical
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {demoIncident.actionType}
                  </p>
                </div>
                <p className="text-4xl font-black text-red-100">
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
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyanfire">
              Public security profile preview
            </p>
            <h2 className="mt-4 text-2xl font-black text-white">
              Demo Protocol
            </h2>
            <p className="mt-3 text-slate-300">
              Praetor protected Solana protocol with live treasury monitoring,
              critical incident attestations, and guardian challenge
              enforcement.
            </p>
            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
              praetores.com/profiles/demo-protocol
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
