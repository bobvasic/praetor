import { Activity, AlertTriangle, BadgeCheck, Coins, KeyRound, LockKeyhole, Radar, ShieldCheck } from "lucide-react";
import { Badge, Card, MetricCard } from "@/components/UI";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { ButtonLink } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Tooltip, TooltipProvider } from "@/src/components/ui/tooltip";
import { demoIncident, protectedAddresses } from "@/lib/demo-data";

const signals = [
  { label: "Treasury Policy", value: "10 SOL max", icon: Coins, tip: "Treasury Policy defines value movement that must be reviewed before execution." },
  { label: "Upgrade Authority", value: "Guarded", icon: KeyRound, tip: "Upgrade Authority interactions are privileged actions and should be reviewed before they can alter protocol code." },
  { label: "Guardian Challenge", value: "Required", icon: LockKeyhole, tip: "Guardian Challenge routes critical actions into manual security review before execution." },
];

export default function DashboardPage() {
  return (
    <TooltipProvider>
      <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <FadeUp className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge>Security command center</Badge>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-white md:text-6xl">
              PRAETOR monitoring console
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-titanium/[0.78]">
              Institutional operations view for protected addresses, critical incidents, risk posture, and guided demo readiness.
            </p>
          </div>
          <ButtonLink href="/demo" variant="command" size="compact">Open Guided Demo</ButtonLink>
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
                        <div className="rounded-2xl border border-titanium/[0.10] bg-obsidian/[0.58] p-5 transition hover:border-arctic/[0.22] hover:bg-arctic/[0.045]">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="h-5 w-5 text-arctic" aria-hidden />
                              <p className="font-black text-white">{item.label}</p>
                            </div>
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
                  <div className="grid gap-4 sm:grid-cols-3">
                    {signals.map((signal) => {
                      const Icon = signal.icon;
                      return (
                        <Tooltip key={signal.label} content={signal.tip}>
                          <div tabIndex={0} className="rounded-2xl border border-arctic/[0.16] bg-arctic/[0.08] p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                            <Icon className="h-5 w-5 text-arctic" aria-hidden />
                            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-titanium/[0.58]">{signal.label}</p>
                            <p className="mt-2 text-xl font-black text-white">{signal.value}</p>
                          </div>
                        </Tooltip>
                      );
                    })}
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
                      <p className="mt-2 text-4xl font-black text-red-100">{demoIncident.riskScore}</p>
                    </div>
                    <AlertTriangle className="h-10 w-10 text-alert" aria-hidden />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-red-50/80">
                    {demoIncident.amount} requested by {demoIncident.signer.toLowerCase()} to a {demoIncident.destination.toLowerCase()}.
                  </p>
                </div>
                <ButtonLink href="/demo" variant="danger" size="command" className="mt-6 w-full">Investigate in Demo</ButtonLink>
              </Card>
            </FadeUp>

            <FadeUp delay={0.18}>
              <Card>
                <div className="flex items-center gap-3">
                  <Radar className="h-5 w-5 text-arctic" aria-hidden />
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-arctic">Monitoring Status</p>
                </div>
                <div className="mt-6 space-y-3">
                  {["Webhooks receiving", "Policy engine armed", "Guardian challenge ready"].map((row) => (
                    <div key={row} className="flex items-center justify-between rounded-xl border border-titanium/[0.10] bg-obsidian/[0.55] px-4 py-3">
                      <span className="text-titanium/[0.78]">{row}</span>
                      <Badge tone="green">OK</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeUp>
          </div>
        </section>

        <FadeUp delay={0.22} className="mt-6">
          <Card className="p-7">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <Badge tone="blue">Operational assurance</Badge>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-white">Command-center readiness for treasury and authority events.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Detect", "Attest", "Block"].map((item) => (
                  <div key={item} className="rounded-2xl border border-titanium/[0.10] bg-obsidian/[0.52] p-4">
                    <Activity className="h-5 w-5 text-arctic" aria-hidden />
                    <p className="mt-4 font-black text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </FadeUp>
      </main>
    </TooltipProvider>
  );
}
