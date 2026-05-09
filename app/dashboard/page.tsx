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
import { Badge, Card, Container, MetricCard, Section } from "@/components/UI";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { ButtonLink } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Tooltip, TooltipProvider } from "@/src/components/ui/tooltip";
import { demoIncident, protectedAddresses } from "@/lib/demo-data";

const signals = [
  {
    label: "Treasury Policy",
    value: "10 SOL max",
    icon: Coins,
    tip: "Treasury Policy defines value movement that must be reviewed before execution.",
  },
  {
    label: "Upgrade Authority",
    value: "Guarded",
    icon: KeyRound,
    tip: "Upgrade Authority interactions are privileged actions and should be reviewed before they can alter protocol code.",
  },
  {
    label: "Guardian Challenge",
    value: "Required",
    icon: LockKeyhole,
    tip: "Guardian Challenge routes critical actions into manual security review before execution.",
  },
];

const metrics = [
  {
    label: "Monitoring",
    value: "Active",
    status: "Live perimeter",
    tone: "green" as const,
    description: "Webhook intake and signer telemetry are streaming.",
  },
  {
    label: "Protected Addresses",
    value: "4",
    status: "Covered",
    tone: "cyan" as const,
    description: "Privileged treasury and authority routes under policy.",
    tip: "Protected Addresses are monitored Solana addresses where privileged or treasury actions are evaluated by Praetor policy.",
  },
  {
    label: "Critical Incidents",
    value: "1",
    status: "Review now",
    tone: "red" as const,
    description: "One high-risk event is awaiting investigation.",
  },
  {
    label: "Latest Risk",
    value: "91",
    status: "Severe",
    tone: "gold" as const,
    description: "Deterministic score across signer and policy signals.",
    tip: "Risk Score is a deterministic severity signal based on threshold breach, signer reputation, destination allowlist status, and policy context.",
  },
];

export default function DashboardPage() {
  return (
    <TooltipProvider>
      <main>
        <Section spacing="compact">
          <Container>
            <FadeUp className="premium-shell demo-theater rounded-[2rem] p-6 md:p-8">
              <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Security command center</Badge>
                    <span className="status-badge-premium inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-teal-100">
                      <span className="live-pulse-dot h-2 w-2 rounded-full bg-secure" />
                      All Systems Online
                    </span>
                    <span className="status-badge-premium solana-pill inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-arctic">
                      Solana Devnet
                    </span>
                  </div>
                  <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.045em] text-white md:text-6xl">
                    PRAETOR monitoring console
                  </h1>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-titanium/[0.80]">
                    Institutional operations view for protected addresses,
                    critical incidents, risk posture, and guided demo readiness.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-end">
                  <Badge tone="green" pulse>
                    <span className="live-pulse-dot h-2 w-2 rounded-full bg-secure" />
                    Live monitoring
                  </Badge>
                  <ButtonLink href="/demo">Open Guided Demo</ButtonLink>
                </div>
              </div>
            </FadeUp>

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric, i) => {
                const card = (
                  <MetricCard
                    label={metric.label}
                    value={metric.value}
                    tone={metric.tone}
                    status={metric.status}
                    description={metric.description}
                  />
                );

                return (
                  <HoverLift key={metric.label} delay={i * 0.05}>
                    {metric.tip ? (
                      <Tooltip content={metric.tip}>
                        <div
                          tabIndex={0}
                          className="h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70"
                        >
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

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <FadeUp delay={0.08}>
                <Card className="min-h-full">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-arctic">
                        Protocol Perimeter
                      </p>
                      <h2 className="mt-3 text-3xl font-black text-white">
                        DemoDAO Treasury posture
                      </h2>
                    </div>
                    <Badge tone="green">Armed</Badge>
                  </div>

                  <Tabs defaultValue="addresses" className="mt-7">
                    <TabsList>
                      <TabsTrigger value="addresses">Addresses</TabsTrigger>
                      <TabsTrigger value="incident">Incident</TabsTrigger>
                      <TabsTrigger value="policy">Policy</TabsTrigger>
                    </TabsList>
                    <TabsContent value="addresses">
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {protectedAddresses.map((address) => (
                          <div
                            key={address.label}
                            className="group rounded-2xl border border-titanium/[0.10] bg-obsidian/[0.58] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-arctic/[0.24] hover:bg-arctic/[0.055]"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-bold text-white">
                                {address.label}
                              </p>
                              <Badge tone="green">{address.status}</Badge>
                            </div>
                            <p className="mt-3 break-all font-mono text-xs leading-5 text-arctic/[0.76]">
                              {address.address}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="incident">
                      <div className="mt-5 rounded-2xl border border-alert/[0.32] bg-alert/[0.10] p-5">
                        <div className="flex items-start justify-between gap-5">
                          <div>
                            <Badge tone="red" pulse>
                              Critical risk
                            </Badge>
                            <h3 className="mt-4 text-2xl font-black text-white">
                              Treasury withdrawal above threshold
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-red-50/80">
                              {demoIncident.amount} requested by{" "}
                              {demoIncident.signer.toLowerCase()} to a{" "}
                              {demoIncident.destination.toLowerCase()}.
                            </p>
                          </div>
                          <p className="risk-glow text-5xl font-black text-red-100">
                            {demoIncident.riskScore}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="policy">
                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        {signals.map((signal) => {
                          const Icon = signal.icon;
                          return (
                            <Tooltip key={signal.label} content={signal.tip}>
                              <div
                                tabIndex={0}
                                className="liquid-glass rounded-2xl p-5 transition hover:border-arctic/[0.30] hover:bg-arctic/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70"
                              >
                                <Icon
                                  className="h-5 w-5 text-arctic"
                                  aria-hidden
                                />
                                <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-titanium/[0.58]">
                                  {signal.label}
                                </p>
                                <p className="mt-2 text-xl font-black text-white">
                                  {signal.value}
                                </p>
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
                  <Card variant="incident">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-alert">
                          Latest Incident
                        </p>
                        <h2 className="mt-3 text-2xl font-black text-white">
                          Treasury withdrawal above threshold
                        </h2>
                      </div>
                      <Badge tone="red" pulse>
                        Critical
                      </Badge>
                    </div>
                    <div className="mt-6 rounded-2xl border border-alert/[0.30] bg-alert/[0.10] p-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-sm text-titanium/[0.62]">
                            {demoIncident.protocolName}
                          </p>
                          <p className="risk-glow mt-2 text-5xl font-black text-red-100">
                            {demoIncident.riskScore}
                          </p>
                        </div>
                        <AlertTriangle
                          className="h-10 w-10 text-alert"
                          aria-hidden
                        />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-red-50/80">
                        Unsafe operation is held until guardian review clears
                        the policy risk.
                      </p>
                    </div>
                    <ButtonLink
                      href="/demo"
                      variant="danger"
                      className="mt-6 w-full"
                    >
                      Investigate in Demo
                    </ButtonLink>
                  </Card>
                </FadeUp>

                <FadeUp delay={0.18}>
                  <Card>
                    <div className="flex items-center gap-3">
                      <Radar className="h-5 w-5 text-arctic" aria-hidden />
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-arctic">
                        Monitoring Status
                      </p>
                    </div>
                    <div className="mt-6 space-y-3">
                      {[
                        "Webhooks receiving",
                        "Policy engine armed",
                        "Guardian challenge ready",
                      ].map((row) => (
                        <div
                          key={row}
                          className="liquid-glass flex items-center justify-between rounded-xl px-4 py-3"
                        >
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
              <Card className="premium-shell rounded-[2rem] p-7">
                <div className="relative z-10 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                  <div>
                    <Badge tone="blue">Operational assurance</Badge>
                    <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-white">
                      Command-center readiness for treasury and authority
                      events.
                    </h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Detect", "Attest", "Block"].map((item) => (
                      <div key={item} className="liquid-glass rounded-2xl p-4">
                        {item === "Block" ? (
                          <ShieldCheck
                            className="h-5 w-5 text-teal-100"
                            aria-hidden
                          />
                        ) : (
                          <Activity
                            className="h-5 w-5 text-arctic"
                            aria-hidden
                          />
                        )}
                        <p className="mt-4 font-black text-white">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </FadeUp>
          </Container>
        </Section>
      </main>
    </TooltipProvider>
  );
}
