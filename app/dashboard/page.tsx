import { Badge, Card, MetricCard } from "@/components/UI";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { ButtonLink } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Tooltip, TooltipProvider } from "@/src/components/ui/tooltip";
import { demoIncident, protectedAddresses } from "@/lib/demo-data";

export default function DashboardPage() {
  return (
    <TooltipProvider>
      <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <FadeUp className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
          <ButtonLink href="/demo">Open Guided Demo</ButtonLink>
        </FadeUp>

        <section className="mt-10 grid gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <HoverLift key={i} delay={i * 0.05}>
              {i === 0 && <MetricCard label="Monitoring" value="Active" tone="green" />}
              {i === 1 && (
                <Tooltip content="Protected Addresses are monitored Solana addresses where privileged or treasury actions are evaluated by Praetor policy.">
                  <div tabIndex={0} className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                    <MetricCard label="Protected Addresses" value="4" tone="cyan" />
                  </div>
                </Tooltip>
              )}
              {i === 2 && <MetricCard label="Critical Incidents" value="1" tone="red" />}
              {i === 3 && (
                <Tooltip content="Risk Score is a deterministic severity signal based on threshold breach, signer reputation, destination allowlist status, and policy context.">
                  <div tabIndex={0} className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                    <MetricCard label="Latest Risk" value="91" tone="gold" />
                  </div>
                </Tooltip>
              )}
            </HoverLift>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <FadeUp delay={0.08}>
            <Card>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-arctic">Perimeter</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Protected addresses</h2>
                </div>
                <Badge tone="green">Monitoring Active</Badge>
              </div>
              <Tabs defaultValue="addresses" className="mt-6">
                <TabsList aria-label="Dashboard sections">
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="policy">Policy</TabsTrigger>
                </TabsList>
                <TabsContent value="addresses">
                  <div className="space-y-4">
                    {protectedAddresses.map((item, index) => (
                      <FadeUp key={item.address} delay={index * 0.04}>
                        <div className="rounded-2xl border border-titanium/[0.10] bg-obsidian/[0.58] p-5 transition hover:border-arctic/[0.20]">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="font-black text-white">{item.label}</p>
                            <span className="rounded-md border border-secure/[0.35] bg-secure/[0.15] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                              {item.status}
                            </span>
                          </div>
                          <p className="mt-3 break-all font-mono text-sm text-arctic/[0.78]">{item.address}</p>
                          <p className="mt-3 text-sm text-titanium/[0.68]">{item.policy}</p>
                        </div>
                      </FadeUp>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="policy">
                  <div className="rounded-2xl border border-arctic/[0.16] bg-arctic/[0.08] p-5 text-sm leading-7 text-titanium/[0.78]">
                    Praetor highlights treasury withdrawals, upgrade authority interactions,
                    signer anomalies, and non-allowlisted destinations before execution.
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </FadeUp>

          <div className="space-y-6">
            <FadeUp delay={0.12}>
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-alert">Latest Incident</p>
                    <h2 className="mt-3 text-2xl font-black text-white">Treasury withdrawal above threshold</h2>
                  </div>
                  <Badge tone="red" pulse>Critical</Badge>
                </div>
                <div className="mt-6 rounded-2xl border border-alert/[0.30] bg-alert/[0.10] p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-titanium/[0.62]">{demoIncident.protocolName}</p>
                      <p className="mt-2 font-mono text-sm text-red-50">{demoIncident.actionType} · {demoIncident.amount}</p>
                    </div>
                    <Tooltip content="Risk Score ranks incident severity from policy signals; higher values demand guardian review before execution.">
                      <p tabIndex={0} className="rounded-md text-5xl font-black text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                        {demoIncident.riskScore}
                      </p>
                    </Tooltip>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-red-50">
                    {demoIncident.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                  </ul>
                </div>
              </Card>
            </FadeUp>

            <FadeUp delay={0.16}>
              <Card>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-gold">Public security profile preview</p>
                <h2 className="mt-4 text-2xl font-black text-white">DemoDAO Treasury</h2>
                <p className="mt-3 text-titanium/[0.74]">
                  PRAETOR protected Solana protocol with live treasury monitoring,
                  critical incident attestations, and guardian challenge enforcement.
                </p>
                <div className="mt-5 rounded-xl border border-arctic/[0.20] bg-arctic/[0.10] p-4 font-mono text-sm text-arctic">
                  praetores.com/profiles/demodao-treasury
                </div>
                <ButtonLink href="/demo" variant="gold" className="mt-5">Run incident flow</ButtonLink>
              </Card>
            </FadeUp>
          </div>
        </section>
      </main>
    </TooltipProvider>
  );
}
