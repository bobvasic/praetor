import { Activity, BadgeCheck, Ban, CircuitBoard, LockKeyhole, ShieldCheck, Swords } from "lucide-react";
import { Wordmark } from "@/components/Brand";
import { Badge, Card, SectionTitle } from "@/components/UI";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { ButtonLink } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
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

const trustSignals = ["Policy-first controls", "Deterministic local simulation", "Solana-native incident workflow"];

export default function Home() {
  return (
    <TooltipProvider>
      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 md:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <FadeUp><Badge tone="gold">Institutional onchain ops firewall</Badge></FadeUp>
            <FadeUp delay={0.05} className="mt-8 max-w-md"><Wordmark /></FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mt-8 max-w-5xl text-5xl font-black tracking-[-0.06em] text-white md:text-7xl">
                Institutional onchain ops firewall for Solana protocols.
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-titanium/[0.82]">
                PRAETOR detects risky privileged actions, attests evidence, enables guardian challenges, and blocks unsafe execution before protocol operations become incidents.
              </p>
            </FadeUp>
            <FadeUp delay={0.22} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/demo" variant="hero" size="hero">Run Guided Demo</ButtonLink>
              <ButtonLink href="/dashboard" variant="command" size="hero">View Command Center</ButtonLink>
            </FadeUp>
            <FadeUp delay={0.28} className="mt-8 flex flex-wrap gap-3">
              {trustSignals.map((signal) => (
                <span key={signal} className="inline-flex items-center gap-2 rounded-full border border-titanium/[0.12] bg-titanium/[0.05] px-3 py-2 text-sm text-titanium/[0.74]">
                  <ShieldCheck className="h-4 w-4 text-arctic" aria-hidden />
                  {signal}
                </span>
              ))}
            </FadeUp>
            <FadeUp delay={0.34} className="mt-7">
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
                    In Praetor, a protocol means the Solana project, DAO, treasury, app, or smart contract system you want to protect.
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </FadeUp>
          </div>

          <FadeUp delay={0.2}>
            <Card className="p-0">
              <div className="border-b border-titanium/[0.10] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-arctic">Live Security Console</p>
                    <p className="mt-2 text-2xl font-black text-white">DemoDAO Treasury</p>
                  </div>
                  <Badge tone="green">Monitoring Active</Badge>
                </div>
              </div>
              <div className="grid gap-5 p-5 md:grid-cols-[0.82fr_1.18fr]">
                <div className="relative min-h-64 overflow-hidden rounded-2xl border border-arctic/[0.18] bg-obsidian/[0.72] p-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(152,233,255,0.20),transparent_38%)]" />
                  <div className="absolute inset-8 rounded-[2rem] border border-arctic/[0.14]" />
                  <div className="absolute inset-14 rounded-full border border-gold/[0.18]" />
                  <div className="relative flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-arctic/[0.28] bg-arctic/[0.08] shadow-glow">
                      <LockKeyhole className="h-11 w-11 text-arctic" aria-hidden />
                    </div>
                    <p className="mt-6 font-mono text-xs uppercase tracking-[0.24em] text-titanium/[0.58]">Policy perimeter</p>
                    <p className="mt-2 text-3xl font-black text-white">91 risk</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {consoleRows.map(([kind, value, status], index) => (
                    <FadeUp key={kind} delay={0.28 + index * 0.04}>
                      <div className="grid grid-cols-[0.58fr_1fr_auto] items-center gap-4 rounded-xl border border-titanium/[0.10] bg-obsidian/[0.62] px-4 py-3 font-mono text-xs transition hover:border-arctic/[0.22]">
                        <span className="text-titanium/[0.48]">{kind}</span>
                        <span className="text-titanium">{value}</span>
                        <span className={status === "CRITICAL" ? "text-alert" : "text-arctic"}>{status}</span>
                      </div>
                    </FadeUp>
                  ))}
                  <div className="rounded-xl border border-gold/[0.25] bg-gold/[0.10] p-5 shadow-gold">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-100">Firewall outcome</p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-white">Execution blocked by Praetor policy.</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeUp>
        </section>

        <section id="flow" className="border-y border-titanium/[0.10] bg-graphite/[0.22] px-6 py-24 backdrop-blur-sm">
          <SectionTitle
            eyebrow="Core flow"
            title="Detect → Attest → Challenge → Block"
            body="A focused policy loop for treasury withdrawals, upgrade authority interactions, signer anomalies, and non-allowlisted destinations."
          />
          <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-4">
            {flowSteps.map((step, index) => {
              const icons = [Activity, BadgeCheck, Swords, Ban];
              const Icon = icons[index];
              return (
                <HoverLift key={step} delay={index * 0.05}>
                  <Card className="min-h-64 hover:border-arctic/[0.28]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-arctic/[0.20] bg-arctic/[0.08]">
                      <Icon className="h-5 w-5 text-arctic" aria-hidden />
                    </div>
                    <p className="mt-6 font-mono text-xs font-bold text-arctic">0{index + 1}</p>
                    <h2 className="mt-3 text-2xl font-black text-white">{step}</h2>
                    <p className="mt-4 text-sm leading-6 text-titanium/[0.72]">{flowDescriptions[index]}</p>
                  </Card>
                </HoverLift>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <FadeUp>
            <Card className="p-8 md:p-12">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <Badge tone="green">Demo-ready MVP</Badge>
                  <h2 className="mt-6 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">
                    Premium command-center UX for live protocol security demos.
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-titanium/[0.78]">
                    The guided demo uses deterministic local logic to simulate a critical treasury withdrawal and show the exact firewall moment: detection, attestation, guardian challenge, and blocked execution.
                  </p>
                </div>
                <div className="rounded-2xl border border-arctic/[0.20] bg-arctic/[0.08] p-6">
                  <CircuitBoard className="h-9 w-9 text-arctic" aria-hidden />
                  <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-arctic">Start here</p>
                  <p className="mt-4 text-3xl font-black text-white">Trigger the incident, then block it.</p>
                  <ButtonLink href="/demo" variant="white" size="command" className="mt-7">Open /demo</ButtonLink>
                </div>
              </div>
            </Card>
          </FadeUp>
        </section>
      </main>
    </TooltipProvider>
  );
}
