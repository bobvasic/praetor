import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Coins,
  KeyRound,
  LockKeyhole,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { Badge, Card } from "@/components/UI";
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

const metrics = [
  {
    label: "Monitoring",
    value: "Active",
    status: "Live perimeter",
    icon: Radar,
    tone: "green",
    description: "Webhook intake and signer telemetry are streaming.",
  },
  {
    label: "Protected Addresses",
    value: "4",
    status: "Covered",
    icon: ShieldCheck,
    tone: "cyan",
    description: "Privileged treasury and authority routes under policy.",
    tip: "Protected Addresses are monitored Solana addresses where privileged or treasury actions are evaluated by Praetor policy.",
  },
  {
    label: "Critical Incidents",
    value: "1",
    status: "Review now",
    icon: AlertTriangle,
    tone: "red",
    description: "One high-risk event is awaiting investigation.",
  },
  {
    label: "Latest Risk",
    value: "91",
    status: "Severe",
    icon: Activity,
    tone: "gold",
    description: "Deterministic score across signer and policy signals.",
    tip: "Risk Score is a deterministic severity signal based on threshold breach, signer reputation, destination allowlist status, and policy context.",
  },
];

const metricTone = {
  cyan: {
    border: "border-arctic/[0.18]",
    bg: "bg-arctic/[0.075]",
    icon: "text-arctic",
    value: "text-arctic",
  },
  red: {
    border: "border-alert/[0.30]",
    bg: "bg-alert/[0.10]",
    icon: "text-alert",
    value: "text-red-100",
  },
  green: {
    border: "border-secure/[0.28]",
    bg: "bg-secure/[0.10]",
    icon: "text-teal-100",
    value: "text-teal-100",
  },
  gold: {
    border: "border-gold/[0.28]",
    bg: "bg-gold/[0.10]",
    icon: "text-amber-100",
    value: "text-amber-100",
  },
};

export default function DashboardPage() {
  return (
    <TooltipProvider>
      <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <FadeUp>
          <section className="rounded-[2rem] border border-arctic/[0.14] bg-[linear-gradient(135deg,rgba(152,233,255,0.09),rgba(8,11,18,0.84)_48%,rgba(255,197,92,0.07))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] md:p-8">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>Security command center</Badge>
                  <Badge tone="green">Monitoring Active</Badge>
                  <Badge tone="gold">1 Critical</Badge>
                </div>
                <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-white md:text-6xl">
                  PRAETOR command center
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-titanium/[0.78]">
                  Institutional operations view for protected addresses, critical incidents, risk posture, and guided demo readiness.
                </p>
              </div>

        <section className="mt-10 grid gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <HoverLift key={i} delay={i * 0.05}>
              {i === 0 && <MetricCard label="Monitoring" value="Active" tone="green" icon={<Radar className="h-5 w-5" aria-hidden />} description="Webhook intake and policy scoring are online." trend="Live" status="Healthy" />}
              {i === 1 && (
                <Tooltip content="Protected Addresses are monitored Solana addresses where privileged or treasury actions are evaluated by Praetor policy.">
                  <div tabIndex={0} className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                    <MetricCard label="Protected Addresses" value="4" tone="cyan" icon={<ShieldCheck className="h-5 w-5" aria-hidden />} description="Treasury and authority accounts under policy." trend="All covered" status="Perimeter" />
                  </div>
                </Tooltip>
              )}
              {i === 2 && <MetricCard label="Critical Incidents" value="1" tone="red" variant="incident" icon={<AlertTriangle className="h-5 w-5" aria-hidden />} description="True incident requiring guardian review." trend="Critical" status="Open" />}
              {i === 3 && (
                <Tooltip content="Risk Score is a deterministic severity signal based on threshold breach, signer reputation, destination allowlist status, and policy context.">
                  <div tabIndex={0} className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                    <MetricCard label="Latest Risk" value="91" tone="gold" icon={<Activity className="h-5 w-5" aria-hidden />} description="Deterministic severity for latest event." trend="Above threshold" status="Policy" />
                  </div>
                  <span className="rounded-full border border-titanium/[0.12] bg-titanium/[0.06] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-titanium/[0.70]">
                    {metric.status}
                  </span>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-titanium/[0.60]">{metric.label}</p>
                  <p className={`mt-3 text-4xl font-black ${tones.value}`}>{metric.value}</p>
                  <p className="mt-3 text-sm leading-6 text-titanium/[0.68]">{metric.description}</p>
                </div>
              </Card>
            );

            return (
              <HoverLift key={metric.label} delay={index * 0.05}>
                {metric.tip ? (
                  <Tooltip content={metric.tip}>
                    <div tabIndex={0} className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                      {card}
                    </div>
                  </Tooltip>
                ) : (
                  card
                )}
              </HoverLift>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <FadeUp delay={0.08}>
            <Card className="border-alert/[0.24] bg-[linear-gradient(180deg,rgba(239,68,68,0.12),rgba(8,11,18,0.72))]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-alert">Latest Incident</p>
                  <h2 className="mt-3 text-2xl font-black text-white">Treasury withdrawal above threshold</h2>
                </div>
                <Badge tone="red" pulse>Critical</Badge>
              </div>

              <div className="mt-6 rounded-2xl border border-alert/[0.30] bg-alert/[0.10] p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl border border-alert/[0.30] bg-alert/[0.14] p-3">
                      <AlertTriangle className="h-6 w-6 text-alert" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm text-titanium/[0.62]">{demoIncident.protocolName}</p>
                      <div className="mt-2 flex flex-wrap items-end gap-3">
                        <p className="text-4xl font-black text-red-100">{demoIncident.riskScore}</p>
                        <span className="pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-red-50/70">Risk score</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <Badge tone="red">Severity: Critical</Badge>
                    <ButtonLink href="/demo" variant="danger">Investigate</ButtonLink>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-red-50/80">
                  {demoIncident.amount} requested by {demoIncident.signer.toLowerCase()} to a {demoIncident.destination.toLowerCase()}.
                </p>
              </div>
            </Card>
          </FadeUp>

          <FadeUp delay={0.12}>
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
                        <Card variant="subtle" className="p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="h-5 w-5 text-arctic" aria-hidden />
                              <p className="font-black text-white">{item.label}</p>
                            </div>
                            <span className="shrink-0 rounded-md border border-secure/[0.35] bg-secure/[0.15] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                              {item.status}
                            </span>
                          </div>
                          <p className="mt-3 break-all font-mono text-sm text-arctic/[0.78]">{item.address}</p>
                          <p className="mt-3 text-sm text-titanium/[0.68]">{item.policy}</p>
                        </Card>
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
                          <Card variant="subtle" tabIndex={0} className="p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                            <Icon className="h-5 w-5 text-arctic" aria-hidden />
                            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-titanium/[0.58]">{signal.label}</p>
                            <p className="mt-2 text-xl font-black text-white">{signal.value}</p>
                          </Card>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </FadeUp>
        </section>

          <div className="space-y-6">
            <FadeUp delay={0.12}>
              <Card variant="incident">
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
                ))}
              </div>
            </Card>
          </FadeUp>

          <FadeUp delay={0.22}>
            <Card className="p-7">
              <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <Badge tone="blue">Operational assurance</Badge>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-white">Command-center readiness for treasury and authority events.</h2>
                </div>
                <div className="mt-6 space-y-3">
                  {["Webhooks receiving", "Policy engine armed", "Guardian challenge ready"].map((row) => (
                    <Card key={row} variant="subtle" className="rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between">
                      <span className="text-titanium/[0.78]">{row}</span>
                      <Badge tone="green">OK</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </FadeUp>
          </div>
        </section>

        <FadeUp delay={0.22} className="mt-6">
          <Card variant="subtle" className="p-7">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <Badge tone="blue">Operational assurance</Badge>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-white">Command-center readiness for treasury and authority events.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Detect", "Attest", "Block"].map((item) => (
                  <Card key={item} variant="subtle" className="p-4">
                    <Activity className="h-5 w-5 text-arctic" aria-hidden />
                    <p className="mt-4 font-black text-white">{item}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </FadeUp>
      </main>
    </TooltipProvider>
  );
}
