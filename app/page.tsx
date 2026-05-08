import Link from "next/link";
import { Badge, Card, SectionTitle } from "@/components/UI";

const flow = ["Detect", "Attest", "Challenge", "Block"];
const problemSolution = [
  {
    title: "Privileged ops are still a blind spot",
    body: "Treasury transfers, upgrade authority use, admin signer actions, and governance execution can move faster than security teams can review.",
  },
  {
    title: "Praetor turns ops risk into enforceable signals",
    body: "Policies score actions, produce verifiable attestations, open guardian challenges, and stop unsafe execution before funds move.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-20 text-center md:pt-28">
        <Badge>Solana security operations</Badge>
        <h1 className="mt-8 max-w-5xl text-5xl font-black tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
          Praetor is the onchain ops firewall for Solana protocols.
        </h1>
        <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-300 md:text-2xl">
          Detect risky privileged actions, attest evidence, enable guardian
          challenges, and block execution when protocol operations become
          unsafe.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/demo"
            className="rounded-full bg-cyanfire px-7 py-4 text-base font-black text-slate-950 shadow-glow transition hover:scale-[1.02]"
          >
            Run guided demo
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-bold text-white transition hover:bg-white/10"
          >
            View dashboard
          </Link>
        </div>
        <div
          id="flow"
          className="mt-16 grid w-full grid-cols-1 gap-4 md:grid-cols-4"
        >
          {flow.map((step, index) => (
            <Card key={step} className="relative overflow-hidden text-left">
              <p className="text-sm font-bold text-cyanfire">0{index + 1}</p>
              <h2 className="mt-4 text-2xl font-black text-white">{step}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {index === 0 &&
                  "Watch protected wallets and privileged instructions in real time."}
                {index === 1 &&
                  "Package risk evidence into a deterministic security attestation."}
                {index === 2 &&
                  "Let guardians challenge suspicious operations before they settle."}
                {index === 3 &&
                  "Prevent execution for integrated protocols while risk is unresolved."}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-6 py-24">
        <SectionTitle
          eyebrow="Problem / Solution"
          title="A security control plane for protocol operations"
          body="Praetor gives founders, DAOs, and security teams a clean public profile plus an enforcement path for the actions that matter most."
        />
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2">
          {problemSolution.map((item) => (
            <Card key={item.title}>
              <h3 className="text-2xl font-black text-white">{item.title}</h3>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                {item.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <Card className="overflow-hidden p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <Badge tone="green">Demo-ready MVP</Badge>
              <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
                Show judges the firewall moment.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                The guided demo simulates a high-risk treasury withdrawal,
                creates an attestation, opens a guardian challenge, and ends
                with execution blocked by Praetor.
              </p>
            </div>
            <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyanfire">
                Core flow
              </p>
              <p className="mt-4 text-3xl font-black text-white">
                Detect → Attest → Challenge → Block
              </p>
              <Link
                href="/demo"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-black text-slate-950"
              >
                Start interactive demo
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
