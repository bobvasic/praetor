<p align="center">
  <a href="https://praetores.com">
    <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a0a,50:7a0710,100:e10600&height=210&section=header&text=PRAETOR&fontColor=ffffff&fontSize=78&fontAlignY=38&desc=Onchain%20Ops%20Firewall%20for%20Solana%20Protocols&descSize=18&descAlignY=62&animation=fadeIn" alt="PRAETOR — Onchain Ops Firewall for Solana Protocols" />
  </a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-FF2020.svg?style=for-the-badge" alt="MIT License" /></a>
  <a href="https://explorer.solana.com/address/HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk?cluster=devnet"><img src="https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Solana Devnet" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" /></a>
  <a href="https://www.anchor-lang.com"><img src="https://img.shields.io/badge/Anchor-1.0-E10600?style=for-the-badge&logoColor=white" alt="Anchor 1.0" /></a>
  <a href="https://praetores.com/app"><img src="https://img.shields.io/badge/Status-Live%20on%20Devnet-5DE0BB?style=for-the-badge" alt="Live on Devnet" /></a>
</p>

<p align="center">
  <a href="https://praetores.com">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1200&color=FF2020&center=true&vCenter=true&width=720&height=45&lines=Detect+%E2%86%92+Attest+%E2%86%92+Challenge+%E2%86%92+Block;Onchain+Ops+Firewall+for+Solana+Protocols;Wallet-signed+%E2%80%A2+QuickNode-powered+%E2%80%A2+Live+on+Devnet" alt="Detect → Attest → Challenge → Block" />
  </a>
</p>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind,rust,docker" alt="Built with Next.js, TypeScript, React, Tailwind, Rust, Docker" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/bobvasic/praetor">
    <img src="https://github-readme-stats.vercel.app/api/pin/?username=bobvasic&repo=praetor&theme=dark&bg_color=0A0A0A&border_color=FF2020&title_color=FF2020&icon_color=FF6B6B&text_color=ffffff" alt="bobvasic/praetor on GitHub" />
  </a>
</p>

---

# Praetor

**Onchain ops firewall for Solana protocols.**

Praetor monitors privileged Solana protocol operations, detects suspicious treasury, governance, signer, and upgrade-authority actions, produces deterministic risk decisions, and creates real Solana devnet attestation proof for guardian challenge and blocked execution workflows.

```txt
Detect → Attest → Challenge → Block
```

Praetor is live, Solana devnet-enabled, QuickNode-powered, wallet-connectable, and built for Colosseum demo review. It is not mainnet, not custodial, and not fake-signature based.

## Live Links

- Website: https://praetores.com
- Devnet App: https://praetores.com/app
- Dashboard: https://praetores.com/dashboard
- Guided Walkthrough: https://praetores.com/demo
- GitHub: https://github.com/bobvasic/praetor
- X: https://x.com/PraetorHQ

## What It Does

Praetor is a security control plane for high-risk Solana protocol operations:

- Monitors privileged protocol actions such as treasury withdrawals, governance changes, signer activity, and upgrade-authority operations.
- Detects suspicious treasury, governance, signer, and upgrade-authority actions using deterministic risk rules.
- Scores the operation and emits a clear decision path for operators and guardians.
- Creates a real Solana devnet attestation transaction using the Memo Program.
- Ships a live Anchor v1.0 devnet program for protocol profiles, attestation records, and guardian challenges.
- Sends and confirms the signed transaction through QuickNode RPC.
- Shows a Solana Explorer devnet link for the resulting transaction.
- Supports a guardian challenge / blocked execution workflow so unsafe operations are visibly denied by Praetor policy.

## Core Flow

```txt
Detect → Attest → Challenge → Block
```

1. **Detect** a risky privileged operation.
2. **Attest** to the deterministic risk decision on Solana devnet.
3. **Challenge** the attempted operation through the guardian workflow.
4. **Block** execution under Praetor policy.

## Product Routes

- `/` — landing page with Praetor positioning, live status badges, and CTAs for the devnet app and dashboard.
- `/app` — primary wallet-connected devnet workflow for triggering a suspicious operation, signing a real Memo Program attestation, submitting through QuickNode RPC, and viewing the Solana Explorer devnet link.
- `/dashboard` — live command center with devnet status, latest slot when available, protected protocol profile, latest incident, and latest local attestation evidence.
- `/demo` — guided non-wallet walkthrough for judges who want to review the flow without connecting a wallet. This route is secondary to `/app`.

## Solana Devnet Workflow

1. User opens `/app` and connects a Solana wallet on devnet.
2. Praetor simulates a suspicious protocol operation against the DemoDAO Treasury profile.
3. Praetor scores the operation as risk score `91` with risk level `critical`.
4. User creates a Memo Program devnet attestation.
5. Wallet signs the transaction client-side.
6. QuickNode RPC sends and confirms the signed transaction.
7. App shows the signature and Solana Explorer devnet link.
8. Execution is marked blocked by Praetor policy.

## Anchor Program (Devnet)

Praetor now includes a deployed Anchor v1.0 devnet program for the onchain MVP primitive:

- Program ID: `HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk`
- Explorer: https://explorer.solana.com/address/HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk?cluster=devnet
- Workspace: `solana/praetor_program`

Current instructions:

- `initialize_protocol_profile` — creates the protected protocol profile PDA
- `record_attestation` — writes a risk attestation PDA for a privileged action
- `submit_guardian_challenge` — opens a guardian challenge PDA and flips the attestation into blocked state

Current PDAs:

- Protocol profile PDA
- Attestation PDA (one per incident sequence)
- Guardian challenge PDA (one per attestation and guardian)

The web app still uses Memo Program attestations for the fastest demo-safe live path. The Anchor program is the shipped onchain primitive that demonstrates the upgrade path from logging-only proof to native protocol security state on Solana.

## QuickNode

`QUICKNODE_RPC_URL` powers Praetor's server-side Solana devnet RPC access. It is used by API routes for:

- Devnet health and slot status.
- Latest blockhash retrieval.
- Signed attestation transaction submission.
- Transaction confirmation.

QuickNode endpoint secrets must be configured as environment variables and must not be hardcoded in the repository.

## Security Model

- The server never handles private keys.
- The server never signs transactions.
- Wallet signing happens client-side through the connected Solana wallet.
- `/api/solana/send-attestation` accepts only a base64 signed transaction and the known Praetor incident id.
- The current MVP is devnet only.
- The Memo Program is used for MVP attestation proof.
- Mainnet deployment, production policy enforcement, and audited protocol integrations are roadmap items.

## API Routes

- `GET /api/health` returns clean JSON service health.
- `GET /api/incidents/simulate` and `POST /api/incidents/simulate` return deterministic demo incident data.
- `POST /api/webhooks/quicknode` accepts QuickNode webhook payloads and verifies `x-quicknode-secret` when `QUICKNODE_WEBHOOK_SECRET` is configured.
- `GET /api/solana/status` returns QuickNode-backed Solana devnet status, slot, health, and blockhash preview.
- `GET /api/solana/blockhash` returns a fresh Solana devnet blockhash from QuickNode RPC.
- `POST /api/solana/send-attestation` rejects invalid payloads, rejects private-key shaped payload fields, never signs server-side, and submits the signed transaction bytes through QuickNode RPC.

Example health response:

```json
{ "ok": true, "service": "praetor-api" }
```

Example simulated incident response:

```json
{
  "ok": true,
  "incident": {
    "id": "inc_demo_001",
    "protocolName": "DemoDAO Treasury",
    "actionType": "treasury_withdrawal",
    "amount": "25 SOL",
    "threshold": "10 SOL",
    "signer": "Unknown signer",
    "destination": "Non-allowlisted wallet",
    "riskScore": 91,
    "riskLevel": "critical",
    "status": "detected",
    "reasons": [
      "Treasury transfer above threshold",
      "Unknown signer",
      "Destination not allowlisted",
      "Policy mismatch"
    ],
    "createdAt": "ISO timestamp"
  }
}
```

## Environment Variables

```txt
QUICKNODE_RPC_URL=
NEXT_PUBLIC_SOLANA_RPC_URL= optional
QUICKNODE_WEBHOOK_SECRET=
PRAETOR_PROGRAM_ID=HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk
NEXT_PUBLIC_PRAETOR_PROGRAM_ID=HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk
DEMO_VAULT_PROGRAM_ID=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
```

Notes:

- `QUICKNODE_RPC_URL` should point to a Solana devnet QuickNode endpoint.
- `NEXT_PUBLIC_SOLANA_CLUSTER` should remain `devnet` for this MVP.
- `NEXT_PUBLIC_SOLANA_RPC_URL` is optional; server-side Solana routes use `QUICKNODE_RPC_URL`.
- `PRAETOR_PROGRAM_ID` and `NEXT_PUBLIC_PRAETOR_PROGRAM_ID` should point to the deployed Praetor Anchor program on devnet.
- Do not commit real secrets.

## Local Development

```bash
npm install
npm run dev
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) while `npm run dev` is running.

For the onchain workspace:

```bash
cd solana/praetor_program
anchor build
cargo test
anchor deploy --provider.cluster devnet
```

## Colosseum Demo Script

```txt
1. Open /app
2. Connect Solana wallet on devnet
3. Trigger suspicious operation
4. Review risk score
5. Create devnet attestation
6. Sign with wallet
7. Open Solana Explorer link
8. Confirm blocked execution state
```

## Risk Engine

`lib/risk-engine.ts` contains deterministic local scoring for demo incidents:

- Treasury transfer above threshold: `+30`
- Unknown signer: `+25`
- Non-allowlisted destination: `+25`
- Upgrade authority interaction: `+40`
- Policy mismatch: `+20`
- Repeated suspicious attempt: `+15`

Risk levels:

- `0-29` low
- `30-59` medium
- `60-79` high
- `80-100` critical

## Built With

- Next.js App Router
- TypeScript
- Tailwind CSS
- Solana Web3.js
- QuickNode Solana devnet RPC

## Deployment Notes

1. Push this repository to GitHub on the `main` branch.
2. Configure production environment variables in the hosting provider.
3. Use these commands:
   - Build command: `npm install && npm run build`
   - Run command: `npm run start`
   - HTTP port: `3000`
4. Point `praetores.com` to the deployed app through the hosting provider's custom domain flow.

## Team

**Jelena** — Founder and CEO, Strategy, Partnerships  
**Bob** — Co-founder, CTO, Security Architect

## Hero Animation

Praetor includes an optional premium hero animation system for the landing page.

- Source scene: `components/hero/PraetorHeroScene.tsx`.
- Landing page video/live-scene wrapper: `components/hero/PraetorHeroMedia.tsx`.
- Recorder route: `/render/hero-animation`.

To export the hero video:

1. Run the app locally with `npm run dev`.
2. Open `/render/hero-animation` in a browser that supports `HTMLCanvasElement.captureStream` and `MediaRecorder`.
3. Click **Record WebM**.
4. The browser downloads `praetor-hero.webm`.
5. Place the exported file at `public/brand/praetor-hero.webm`.

The recording step is manual and optional. `npm run build` does not generate or require the WebM file. If `public/brand/praetor-hero.webm` is absent or fails to load, the homepage gracefully falls back to the live browser-rendered Praetor hero scene.
