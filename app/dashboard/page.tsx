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

              <div className="rounded-2xl border border-titanium/[0.12] bg-obsidian/[0.58] p-4 lg:min-w-[20rem]">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-titanium/[0.62]">Action cluster</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <ButtonLink href="/demo" size="lg" className="w-full">Open Guided Demo</ButtonLink>
                  <div className="flex items-center gap-3 rounded-xl border border-arctic/[0.12] bg-arctic/[0.06] px-4 py-3">
                    <BadgeCheck className="h-5 w-5 text-arctic" aria-hidden />
                    <span className="text-sm font-semibold text-titanium/[0.78]">Demo path includes detect, attest, and block steps.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeUp>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const tones = metricTone[metric.tone as keyof typeof metricTone];
            const card = (
              <Card className={`flex min-h-[13.5rem] flex-col justify-between border ${tones.border}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-2xl border ${tones.border} ${tones.bg} p-3`}>
                    <Icon className={`h-5 w-5 ${tones.icon}`} aria-hidden />
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
                        <div className="rounded-2xl border border-titanium/[0.10] bg-obsidian/[0.58] p-5 transition hover:border-arctic/[0.22] hover:bg-arctic/[0.045]">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="mt-0.5 shrink-0 rounded-xl border border-arctic/[0.18] bg-arctic/[0.08] p-2">
                                <ShieldCheck className="h-4 w-4 text-arctic" aria-hidden />
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-white">{item.label}</p>
                                <p className="mt-2 break-words [overflow-wrap:anywhere] font-mono text-sm leading-6 text-arctic/[0.78]">{item.address}</p>
                              </div>
                            </div>
                            <span className="shrink-0 rounded-md border border-secure/[0.35] bg-secure/[0.15] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                              {item.status}
                            </span>
                          </div>
                          <p className="mt-4 text-sm leading-6 text-titanium/[0.68]">{item.policy}</p>
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
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
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

          <FadeUp delay={0.22}>
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
        </section>
      </main>
    </TooltipProvider>
  );
}
