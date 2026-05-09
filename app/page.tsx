import {
  Activity,
  BadgeCheck,
  Ban,
  CircuitBoard,
  LockKeyhole,
  ShieldCheck,
  Swords,
} from "lucide-react";
import { Wordmark } from "@/components/Brand";
import { Badge, Card, Container, Section, SectionTitle } from "@/components/UI";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { ButtonLink } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { flowSteps } from "@/lib/demo-data";

const flowDescriptions = [
  "Continuously score treasury movement, signer identity, privileged instructions, and destination context.",
  "Turn deterministic incident evidence into a reviewable security record for protocol operators.",
  "Route dangerous execution paths through guardian review before funds or authority move.",
  "Deny unsafe operations while policy risk is unresolved and preserve the audit trail.",
];

const consoleRows = [
  ["PERIMETER", "DemoDAO Treasury", "ACTIVE"],
  ["SIGNER", "Unknown signer", "CRITICAL"],
  ["DESTINATION", "Non-allowlisted wallet", "CRITICAL"],
  ["POLICY", "Guardian challenge required", "ARMED"],
];

const trustSignals = [
  "Policy-first controls",
  "Deterministic local simulation",
  "Solana-native incident workflow",
];

export default function Home() {
  return (
    <TooltipProvider>
      <main>
        <Section
          spacing="hero"
          className="min-h-[calc(100vh-5rem)] md:flex md:items-center"
        >
          <Container className="grid gap-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
            <div>
              <FadeUp className="flex flex-wrap gap-3">
                <span className="status-badge-premium inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-teal-100">
                  <span className="live-pulse-dot h-2 w-2 rounded-full bg-secure" />
                  All Systems Online
                </span>
                <span className="status-badge-premium solana-pill inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-arctic">
                  <CircuitBoard
                    className="h-3.5 w-3.5 text-[#14F195]"
                    aria-hidden
                  />
                  Solana Devnet
                </span>
              </FadeUp>
              <FadeUp delay={0.05} className="mt-8 max-w-md">
                <Wordmark />
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="hero-title-gradient mt-8 max-w-5xl text-5xl font-black tracking-[-0.065em] drop-shadow-[0_0_54px_rgba(152,233,255,0.14)] md:text-7xl xl:text-8xl">
                  The onchain ops firewall for Solana protocols.
                </h1>
              </FadeUp>
              <FadeUp delay={0.16}>
                <p className="mt-7 max-w-2xl text-xl leading-9 text-titanium/[0.84]">
                  PRAETOR detects risky privileged actions, attests evidence,
                  routes guardian challenges, and blocks unsafe execution before
                  treasury or authority operations become incidents.
                </p>
              </FadeUp>
              <FadeUp
                delay={0.2}
                className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3"
              >
                {trustSignals.map((signal) => (
                  <span
                    key={signal}
                    className="liquid-glass rounded-2xl px-4 py-3 text-sm text-titanium/[0.84]"
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <ShieldCheck
                        className="h-4 w-4 text-arctic"
                        aria-hidden
                      />
                      {signal}
                    </span>
                  </span>
                ))}
              </FadeUp>
              <FadeUp
                delay={0.25}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <ButtonLink href="/demo" variant="hero" size="hero">
                  Run Guided Demo
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="command" size="hero">
                  View Command Center
                </ButtonLink>
              </FadeUp>
              <FadeUp delay={0.31} className="mt-7">
                <Dialog>
                  <DialogTrigger className="font-mono text-xs uppercase tracking-[0.18em] text-arctic underline decoration-arctic/[0.35] underline-offset-4 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                    What is a protocol?
                  </DialogTrigger>
                  <DialogContent>
                    <Badge tone="blue">Praetor glossary</Badge>
                    <DialogTitle className="mt-5 text-3xl font-black tracking-[-0.03em] text-white">
                      What Praetor protects
                    </DialogTitle>
                    <DialogDescription className="mt-4 text-base leading-7 text-titanium/[0.82]">
                      In Praetor, a protocol means the Solana project, DAO,
                      treasury, app, or smart contract system you want to
                      protect.
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </FadeUp>
            </div>

            <FadeUp delay={0.2}>
              <Card variant="hero" className="premium-shell p-0">
                <div className="border-b border-white/[0.10] p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.26em] text-arctic">
                        Institutional Security Console
                      </p>
                      <p className="mt-2 text-2xl font-black text-white">
                        DemoDAO Treasury Perimeter
                      </p>
                    </div>
                    <Badge tone="green" pulse>
                      <span className="live-pulse-dot h-2 w-2 rounded-full bg-secure" />
                      Monitoring Active
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-5 p-5 md:grid-cols-[0.78fr_1.22fr] md:p-6">
                  <div className="liquid-glass relative min-h-72 rounded-[1.75rem] p-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(152,233,255,0.22),transparent_39%)]" />
                    <div className="console-orbit absolute inset-7 rounded-[2rem] border border-arctic/[0.18]" />
                    <div className="console-orbit absolute inset-14 rounded-full border border-[#14F195]/[0.18] [animation-duration:24s] [animation-direction:reverse]" />
                    <div className="relative flex h-full flex-col items-center justify-center text-center">
                      <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-arctic/[0.30] bg-arctic/[0.08] shadow-glow">
                        <LockKeyhole
                          className="h-12 w-12 text-arctic"
                          aria-hidden
                        />
                      </div>
                      <p className="mt-6 font-mono text-xs uppercase tracking-[0.24em] text-titanium/[0.62]">
                        Policy perimeter
                      </p>
                      <p className="mt-2 text-4xl font-black text-white">
                        91 risk
                      </p>
                      <p className="mt-2 text-sm text-teal-100">
                        Block path armed
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {consoleRows.map(([kind, value, status], index) => (
                      <FadeUp key={kind} delay={0.28 + index * 0.04}>
                        <div className="grid grid-cols-[0.58fr_1fr_auto] items-center gap-4 rounded-2xl border border-white/[0.10] bg-white/[0.045] px-4 py-3 font-mono text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-arctic/[0.28] hover:bg-arctic/[0.07]">
                          <span className="text-titanium/[0.50]">{kind}</span>
                          <span className="text-titanium">{value}</span>
                          <span
                            className={
                              status === "CRITICAL"
                                ? "text-alert"
                                : "text-arctic"
                            }
                          >
                            {status}
                          </span>
                        </div>
                      </FadeUp>
                    ))}
                    <div className="rounded-2xl border border-gold/[0.28] bg-gold/[0.10] p-5 shadow-gold">
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-100">
                        Firewall outcome
                      </p>
                      <p className="mt-3 text-3xl font-black tracking-tight text-white">
                        Execution blocked by Praetor policy.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["Detect", "Attest", "Block"].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-arctic/[0.14] bg-arctic/[0.06] p-3 text-center"
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-arctic">
                            {item}
                          </p>
                          <p className="mt-1 text-sm font-bold text-white">
                            Ready
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </FadeUp>
          </Container>
        </Section>

        <Section
          id="flow"
          className="border-y border-titanium/[0.10] bg-graphite/[0.20] backdrop-blur-sm"
        >
          <SectionTitle
            eyebrow="Core flow"
            title="Detect → Attest → Challenge → Block"
            body="A focused policy loop for treasury withdrawals, upgrade authority interactions, signer anomalies, and non-allowlisted destinations."
          />
          <Container className="relative mt-12 grid gap-4 md:grid-cols-4">
            <div className="flow-connector pointer-events-none absolute left-10 right-10 top-1/2 hidden h-px md:block" />
            {flowSteps.map((step, index) => {
              const icons = [Activity, BadgeCheck, Swords, Ban];
              const Icon = icons[index];
              return (
                <HoverLift key={step} delay={index * 0.05}>
                  <Card
                    variant="subtle"
                    className="min-h-64 hover:border-arctic/[0.28] hover:shadow-[0_28px_90px_rgba(152,233,255,0.10)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-arctic/[0.20] bg-arctic/[0.08]">
                      <Icon className="h-5 w-5 text-arctic" aria-hidden />
                    </div>
                    <p className="mt-6 font-mono text-xs font-bold text-arctic">
                      0{index + 1}
                    </p>
                    <h2 className="mt-3 text-2xl font-black text-white">
                      {step}
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-titanium/[0.72]">
                      {flowDescriptions[index]}
                    </p>
                  </Card>
                </HoverLift>
              );
            })}
          </Container>
        </Section>

        <Section>
          <Container>
            <FadeUp>
              <Card className="premium-shell rounded-[2rem] p-8 md:p-12">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                  <div>
                    <Badge tone="green">Demo-ready MVP</Badge>
                    <h2 className="mt-6 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">
                      Premium command-center UX for live protocol security
                      demos.
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-titanium/[0.78]">
                      The guided demo uses deterministic local logic to simulate
                      a critical treasury withdrawal and show the exact firewall
                      moment: detection, attestation, guardian challenge, and
                      blocked execution.
                    </p>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border border-arctic/[0.20] bg-arctic/[0.08] p-6 shadow-glow">
                    <CircuitBoard className="h-9 w-9 text-arctic" aria-hidden />
                    <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-arctic">
                      Start here
                    </p>
                    <p className="mt-4 text-3xl font-black text-white">
                      Trigger the incident, then block it.
                    </p>
                    <ButtonLink
                      href="/demo"
                      variant="hero"
                      size="hero"
                      className="mt-7"
                    >
                      Run Guided Demo
                    </ButtonLink>
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
