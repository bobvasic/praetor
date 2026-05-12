# PRAETOR — Master Brief

> Single source of truth for downstream LLMs (ChatGPT, etc.) producing demo videos, pitch decks, and submission copy. Last updated 2026-05-10.

---

## 0. One-Line Identity

**Praetor is an onchain ops firewall for Solana protocols that detects, attests, challenges, and blocks high-risk privileged actions on Solana devnet — live, wallet-signed, QuickNode-powered, with a deployed Anchor v1.0 program.**

Tagline: *Detect → Attest → Challenge → Block*

Domain: **praetores.com**
GitHub: **https://github.com/bobvasic/praetor**
X / Twitter: **@PraetorHQ**

---

## 1. Hackathon Target

- Competition: **Solana Frontier Hackathon** (Colosseum, presented by Solana Foundation)
- Dates: **April 6 – May 11, 2026**
- Submission deadline: **May 11, 2026, 11:59 PM PT** (Colosseum's clock is official)
- Judges announced winners: by ~June 23, 2026
- Prizes targeted:
  - **$30,000** Grand Champion
  - **$10,000 × 20** standout teams
  - **$10,000** Public Goods Award (secondary target — Anchor program + risk engine are open-source primitives)
  - Accelerator: **$250,000 pre-seed** + SF mentorship + Demo Day for selected winners
- Track: no tracks; bring your own product. Required: Solana integration (✅ done — devnet program + wallet flow).
- Required submission artifacts:
  1. Project name, short description, tags
  2. Solana integration explanation
  3. Public GitHub repo or judge access
  4. Live demo URL (`https://praetores.com/app`)
  5. **Pitch video** ≤ 3 min (Loom or YouTube, public)
  6. **Technical demo video** 2–3 min (architecture + Solana implementation walkthrough)
  7. Team background
- Judging criteria (verbatim from official rules):
  1. Functionality (does it work, code quality)
  2. Potential Impact (TAM, Solana ecosystem)
  3. Novelty
  4. UX leveraging Solana's perf
  5. Open-source / composability
  6. Business Plan

---

## 2. Team

- **Bob (BOB Vasic)** — Co-founder, CTO, Security Architect. Builder of Praetor's core, owns Solana/Anchor program, Next.js app, infra, brand. Operating from CyberLink Security org.
- **Jelena** — CEO, Strategy, Partnerships.

Team size: 2 (technical + business). Solo-engineer-led MVP shipped in hackathon window.

---

## 3. Problem Statement

Solana protocols routinely lose millions to **privileged-operation attacks**: compromised treasury signers, unauthorized upgrade-authority calls, malicious governance proposals, and signer-set takeovers. Existing tooling (Solscan, generic wallet UIs, multisig dashboards) gives operators **after-the-fact visibility**, not **pre-execution policy enforcement**.

Recent ecosystem context (drives the pitch hook):
- Drift exploit (2026 Q2) — privileged-action exposure
- Repeated DAO treasury drains across Solana / EVM ecosystems
- Multisig misconfigurations and upgrade-authority misuse remain top exploit vector

**Gap:** there is no Solana-native security control plane that converts policy decisions into onchain attestations, runs a guardian challenge workflow, and blocks unsafe execution **before** funds move.

---

## 4. Solution — What Praetor Does

Praetor is a **security control plane for high-risk Solana protocol operations**. Four-step workflow:

1. **Detect** — score privileged actions (treasury withdrawals, upgrade-authority touches, signer-set changes, governance changes) against deterministic risk rules tied to a Protocol Profile.
2. **Attest** — convert the risk decision into an onchain proof. MVP path: a real Solana **devnet Memo Program transaction**, signed client-side by the user's wallet, sent through QuickNode RPC, verified on Solana Explorer. Native path: the deployed **Praetor Anchor program** writes an `AttestationRecord` PDA.
3. **Challenge** — open a **guardian challenge PDA** on the Anchor program; flips the attestation into `Blocked` state.
4. **Block** — unsafe execution is denied under Praetor policy. Funds remain inside the protected perimeter, incident trail preserved.

**Defining product traits:**
- Devnet-real, not mocked — every attestation produces a verifiable Solana Explorer link.
- Wallet-signed only. Praetor never handles, stores, or signs with private keys server-side.
- Deterministic, auditable risk rules (no black-box ML for MVP).
- Open-source primitives (Anchor program + risk engine) usable by any Solana protocol.

---

## 5. Live Product Surfaces (Routes)

All routes deployed at **https://praetores.com** on DigitalOcean App Platform.

### 5.1 `/` — Landing Page
- Hero with `Wordmark` + lava-gradient H1 ("Praetor is live for Solana devnet protocols.")
- Operational badges row: `All Systems Online`, `Solana Devnet`, `QuickNode RPC Connected`, `Onchain Attestation Ready`
- Right-column **Security Console** card showing DemoDAO Treasury perimeter, risk score 91, blocked-state outcome
- 4-step flow grid: Detect / Attest / Challenge / Block (icon + copy each)
- Premium CTAs: `Launch Devnet App`, `View Dashboard`, `Guided Walkthrough`
- Animated background: `AgenticHeroBackground` (Three.js fiber scene + particle field + beam stack)

### 5.2 `/app` — **Primary Devnet Workflow** (judge-critical path)
- Wallet connect (Phantom auto-detect via `window.solana`)
- Live QuickNode status panel (network, slot, blockhash preview, Anchor program link)
- Protected protocol profile card: DemoDAO Treasury, treasury PK `Dk22YaGKhnsaD7pLvCJyejHo3xj6NkSuvaCgbMVZLYgy`, 10 SOL threshold, guardian-required policy
- Incident simulation panel: action `treasury_withdrawal`, amount `25 SOL`, signer `Unknown`, destination `Non-allowlisted wallet`, threshold `10 SOL`
- **Trigger Suspicious Operation** button → reveals Risk Decision panel
- Risk Decision panel: huge "91" score, level "Critical", four reason chips:
  1. Treasury transfer above threshold
  2. Unknown signer
  3. Destination not allowlisted
  4. Policy mismatch
- **Create Devnet Attestation** button:
  1. fetches `/api/solana/blockhash` (QuickNode-backed)
  2. builds Memo Program transaction client-side with the deterministic JSON payload
  3. asks wallet to sign
  4. POSTs base64 signed tx to `/api/solana/send-attestation`
  5. server submits via QuickNode `sendRawTransaction`, polls for `confirmed`
  6. UI shows signature, "Confirmed" pulse, **Solana Explorer link**, payload preview
- Final blocked-state banner: "Execution blocked by Praetor policy."
- Attestation persisted in `localStorage` under key `praetor.devnet.attestation.inc_demo_001` so dashboard reflects state across navigations.

### 5.3 `/dashboard` — Live Command Center
- Header: "Praetor live command center."
- Metric strip (4 cards): `Systems` (Online/Degraded), `Devnet Slot` (live from `/api/solana/status`), `Latest Risk` (91 critical), `Blocked State` (Blocked)
- **QuickNode RPC status** panel: All Systems Online, Network, RPC provider, Health, Latest devnet slot, Latest blockhash preview
- **Latest devnet proof** panel: Anchor program shortlink, latest signature, confirmation status, protocol, attested risk score, Explorer link (when present)
- **DemoDAO Treasury posture**: 4 protected addresses (Main Treasury / Upgrade Authority / Operations Multisig / Guardian Wallet), each with policy and live status
- **Latest Incident** card: critical badge, incident summary, CTA to `/app`
- **Blocked execution state** mini-panel: traffic-light style status rows
- Operational assurance footer reinforcing Detect → Attest → Block.

### 5.4 `/demo` — Guided Walkthrough (non-wallet, judge-friendly)
- 5-state machine: `ready` → `detected` → `attested` → `challenged` → `blocked`
- Animated progress rail with framer-motion gradient bar
- 4 buttons drive states: Trigger Suspicious Withdrawal / Create Attestation / Guardian Challenge / Attempt Execution
- `CountUp` animation for risk score (0 → 91)
- Status copy + step detail update reactively
- Final blocked state shows the climactic "Execution blocked by Praetor policy." card
- Designed for judges who don't want to install Phantom

### 5.5 `/render/hero-animation`
- Browser-side recorder for exporting a `praetor-hero.webm` for the landing-page hero. Optional, manual.

### 5.6 `/api/*` — Server Routes
- `GET /api/health` → `{ ok: true, service: "praetor-api" }`
- `GET|POST /api/incidents/simulate` → returns `410 Gone`; local fixture incident simulation has been removed
- `GET /api/solana/status` → QuickNode-backed devnet health, slot, block height, Solana core version, blockhash preview, and Praetor Anchor program account state
- `GET /api/solana/blockhash` → fresh devnet blockhash from QuickNode
- `POST /api/solana/send-attestation` → accepts only `{ signedTransaction: base64, incidentId: "inc_demo_001" }`. Hard-rejects any payload containing `privateKey`, `secretKey`, or `keypair`. Submits via QuickNode and returns `{ signature, explorerUrl, status }`; confirmation polling and memo parsing use `/api/solana/tx-status`.
- `POST /api/webhooks/quicknode` → verifies `x-quicknode-secret` when `QUICKNODE_WEBHOOK_SECRET` is set.

---

## 6. Onchain Primitive — Praetor Anchor Program (Devnet)

This is the shipped, deployed, native-Solana piece (criterion: novelty + open-source + functionality).

- **Program ID:** `HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk`
- **Cluster:** Solana devnet
- **Explorer:** https://explorer.solana.com/address/HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk?cluster=devnet
- **Workspace:** `solana/praetor_program`
- **Framework:** Anchor v1.0.2 (avm-managed), Rust + `anchor-lang::prelude`
- **Build status:** `anchor build` passing, `cargo test` passing, LiteSVM flow test covers detect → attest → block path

### 6.1 Instructions
1. `initialize_protocol_profile(args: InitializeProtocolProfileArgs)` — creates the `ProtocolProfile` PDA for a given protocol (treasury, guardian, upgrade authority, threshold, policy flags).
2. `record_attestation(args: RecordAttestationArgs)` — writes an `AttestationRecord` PDA (one per incident sequence) with risk score, action type, status, guardian-challenge flag.
3. `submit_guardian_challenge(args: SubmitGuardianChallengeArgs)` — opens a `GuardianChallengeRecord` PDA and **flips the attestation into `Blocked`** state.

### 6.2 PDAs (seeds)
- `protocol_profile` — one per protected protocol
- `attestation` — one per incident sequence
- `guardian_challenge` — one per (attestation, guardian)

### 6.3 State enums
- `ActionType`: `TreasuryWithdrawal | UpgradeAuthorityUse | SignerSetChange`
- `RiskLevel`: `Low | Medium | High | Critical`
- `AttestationStatus`: `Attested | Blocked`
- `ChallengeStatus`: `Open`

### 6.4 Errors (custom)
- `ProtocolNameTooLong`, `IncidentIdTooLong`, `ChallengeReasonTooLong`
- `InvalidRiskScore` (must be 0–100)
- `ProtocolInactive`
- `GuardianChallengeNotRequired`
- `ChallengeAlreadyOpen`

### 6.5 Account size constants
- Max protocol name: 48 chars
- Max incident id: 64 chars
- Max challenge reason: 160 chars

### 6.6 MVP architecture decision
The Anchor program **is shipped and deployed**, but the live `/app` flow uses **Memo Program** attestations for the fastest, demo-stable wallet path (smallest tx size, zero PDA derivation latency). The Anchor program is the **native upgrade path** demonstrated to judges as the production primitive.

---

## 7. Solana Integration Summary (judge copy)

- **Cluster:** Solana **devnet**
- **RPC provider:** **QuickNode** (server-side via env-injected `QUICKNODE_RPC_URL`)
- **Wallet:** **Phantom** (auto-detected via `window.solana`)
- **Transaction primitives used:** Memo Program (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`), `Transaction`, `TransactionInstruction`, `PublicKey`
- **Confirmation:** `sendRawTransaction` + `confirmTransaction("confirmed")` + signature-status polling (45 s timeout)
- **Onchain primitive:** Anchor v1.0 program with 3 instructions and 3 PDA types
- **Explorer integration:** every attestation surfaces a `https://explorer.solana.com/tx/<sig>?cluster=devnet` link
- **Signing model:** wallet signs client-side **only**. Server hard-rejects payloads containing `privateKey`, `secretKey`, or `keypair`.

---

## 8. Risk Engine Rules (deterministic, open-source)

File: `lib/risk-engine.ts`

| Rule key | Score | Reason text |
|---|---|---|
| `treasuryTransferAboveThreshold` | +30 | Treasury transfer above threshold |
| `unknownSigner` | +25 | Unknown signer |
| `nonAllowlistedDestination` | +25 | Destination not allowlisted |
| `upgradeAuthorityInteraction` | +40 | Upgrade authority interaction |
| `policyMismatch` | +20 | Policy mismatch |
| `repeatedSuspiciousAttempt` | +15 | Repeated suspicious attempt |

Score capped at 100. Risk levels: `0–29 low`, `30–59 medium`, `60–79 high`, `80–100 critical`.

Demo incident hits 4 rules → score **91**, level **critical**.

---

## 9. Demo Incident (canonical numbers used everywhere)

```
id:           inc_demo_001
protocolName: DemoDAO Treasury
actionType:   treasury_withdrawal
amount:       25 SOL
threshold:    10 SOL
signer:       Unknown signer
destination:  Non-allowlisted wallet
riskScore:    91
riskLevel:    critical
status:       detected → attested → challenged → blocked
reasons:      [Treasury transfer above threshold, Unknown signer, Destination not allowlisted, Policy mismatch]
createdAt:    2026-05-08T00:00:00.000Z (then live ISO when re-simulated)
```

Protected addresses (used on `/app` and `/dashboard`):

| Label | Address (devnet) | Policy |
|---|---|---|
| Main Treasury | `Dk22YaGKhnsaD7pLvCJyejHo3xj6NkSuvaCgbMVZLYgy` | Max withdrawal without review: 10 SOL |
| Upgrade Authority | `8h16LZgH6Hm5RmjdNHW1wtVGHPpw716ETKLLgniK5rh` | Any upgrade authority touch becomes guardian-reviewable |
| Operations Multisig | `7BorHb7UL3PcGSrbfWMZcLpBNWyShk6XJWb2zLbMJtnz` | Unknown signer escalates to critical |
| Guardian Wallet | `93RffqaHrZW1ZEHQAeucm8GciyFLB6ME7Jou8XWFxYSe` | Guardian challenge required before execution resumes |

---

## 10. Demo Script (use for technical video and live judging)

```
1. Open https://praetores.com → show landing, OperationalBadges row, lava H1
2. Click Launch Devnet App → /app
3. Connect Phantom wallet (devnet)
4. Show QuickNode RPC status panel: live slot ticking, blockhash preview, Anchor program link
5. Show DemoDAO Treasury protected profile card
6. Click Trigger Suspicious Operation → risk decision panel reveals:
   - 91 score, Critical level, 4 reason chips
7. Click Create Devnet Attestation:
   - blockhash fetched from QuickNode
   - Memo Program tx built client-side
   - Phantom prompts; user signs
   - server submits, polls until confirmed
   - signature + Explorer link rendered
8. Open Solana Explorer link in new tab → show real devnet tx, decoded Memo payload
9. Final card: "Execution blocked by Praetor policy."
10. Navigate to /dashboard → show same attestation persisted, slot live, all systems online
11. Switch to /demo → run non-wallet animated flow Detect → Attest → Challenge → Block (great B-roll)
12. Show GitHub repo: solana/praetor_program (Anchor) + lib/risk-engine.ts (rules) + app/api (routes)
13. Close on Anchor program Explorer page (devnet) for the onchain proof.
```

Total runtime target: pitch video 3 min, technical demo 2.5 min.

---

## 11. Visual Identity & Brand

### 11.1 Brand name
- **Praetor** — Latin "magistrate / commander / guardian." Plays on guardianship + execution authority. Domain `praetores.com` (plural form).
- Wordmark = "PRAETOR" in bold uppercase Space Grotesk with 8 px letter-spacing.

### 11.2 Logo system
- `praetor-mark.svg` — 128×128 rounded square, gradient frame (#FF1A1A → #FF4040 → #990000). Inner shield outlined with crimson gradient. Bold white→crimson **"P"** monogram inside. Crimson underline rule beneath the P.
- `praetor-wordmark.svg` — small shield with P + uppercase "PRAETOR" wordmark + horizontal crimson rule under the wordmark.

### 11.3 Color palette ("Raptor Labs" — neon crimson on near-black)
HSL tokens defined in `app/globals.css`:

| Token | HSL | Use |
|---|---|---|
| `--background` | `0 0% 4%` (`#0A0A0A`) | App background |
| `--foreground` | `0 0% 96%` | Body text |
| `--card` | `0 0% 6%` | Panels / cards |
| `--primary` | `0 100% 55%` | Brand crimson (accents, CTAs) |
| `--primary-glow` | `0 100% 45%` | Glows |
| `--accent` | `0 85% 50%` | Secondary crimson |
| `--destructive` | `0 84.2% 60.2%` | Critical states |
| `--muted` | `0 0% 12%` | Mini cards |
| `--muted-foreground` | `0 0% 55%` | Secondary text |
| `--border` | `0 0% 15%` | Borders |
| `--glow-red` | `0 100% 50%` | Halo |
| `--glow-crimson` | `355 100% 45%` | Halo |
| `--glow-lava` | `15 100% 50%` | Lava gradient |
| Praetor cyan accent | `rgba(152,233,255,*)` | Status info, blockhash, "online" tone |
| Praetor blue accent | `rgba(44,82,255,*)` | Background depth, beams |
| Praetor orange-soft | `rgba(255,130,0,*)` | "Armed" / orange status, warning frame |
| Solana legacy hint | `rgba(153,69,255,*)` + `rgba(20,241,149,*)` | Subtle background nods |

Key gradients:
- `gradient-lava`: `linear-gradient(135deg, hsl(0 100% 50%), hsl(20 100% 45%), hsl(0 100% 40%))` — used for hero H1 (`text-gradient-lava`).
- `gradient-ember`: `linear-gradient(180deg, hsl(0 100% 55% / 0.8), hsl(15 100% 45% / 0.6))`.

### 11.4 Typography
- Display + body: **Space Grotesk** (300/400/500/600/700) via `next/font/google`, CSS var `--font-space-grotesk`
- Secondary: **Inter** (300–900), CSS var `--font-inter`
- Mono: ui-monospace stack (SFMono-Regular, Menlo, Monaco, Consolas)
- Headlines use `tracking-[-0.04em]` to `tracking-[-0.06em]` (tight) and `font-black` (900)
- "Kicker" labels: monospace, uppercase, `tracking-[0.2em]`–`tracking-[0.24em]`

### 11.5 UI components (in `components/`)
- `GlassPanel` — frosted glass panels with crimson border highlight
- `MetricCard` — labeled metric with tone (red/cyan/green/orange) + status copy
- `PremiumButton` / `PremiumButtonLink` — variants: `orange`, `glass`, `danger`, `ghost`
- `SectionShell` — consistent vertical rhythm + grid
- `SharpDivider` — angular gradient dividers
- `StatusBadge` — tones: `online`, `cyan`, `orange`, `red`, `devnet`, `muted`. Optional pulse.
- `OperationalBadges` — the canonical badge row (used on `/`, `/app`, `/dashboard`, `/demo`)
- `Reveal` (`FadeUp`, `HoverLift`) — framer-motion entrance and hover animations
- Shadcn-derived primitives in `src/components/ui/`: `badge`, `button`, `card`, `dialog`, `tabs`, `tooltip`, `section`

### 11.6 Backgrounds (cinematic system)
- `AgenticHeroBackground` — global layered background mounted in root layout (z-0)
- `PraetorHeroScene` — Three.js fiber crimson particle/network scene
- `PraetorHeroMedia` — wrapper that tries `public/brand/praetor-hero.webm` first, falls back to live scene
- `CinematicSecurityBackground`, `PraetorNetworkBackground` — alt scenes
- CSS effects in `globals.css`: `grid-mask`, `audit-scanline`, `security-orb`, `security-depth-field`, `cinematic-sweep`, `command-grid-drift`, `hex-mesh`, `circuit-board`, `scanline`, `praetor-particle-field`, `praetor-particle`, `praetor-beam-stack`, `praetor-depth-vignette`, `audit-reticle`, `radar-sweep`, `hero-energy-well`
- Animations: `breathe`, `pulse-glow`, `float`, `drift-orb`, `security-depth-drift`, `cinematic-light-sweep`, `command-grid-drift`, `audit-sweep`, `praetor-beam-travel`, `audit-reticle-breathe`, `radar-sweep-rotate`, `hero-energy-drift`
- Full `prefers-reduced-motion` fallback: animations short-circuit to ~0 ms

### 11.7 Visual tone summary (for video / deck artwork)
- **Mood:** cinematic, institutional, slightly menacing, sovereign-grade
- **Reference anchors:** terminal command-center, cyberpunk sentinel, audit reticle, dark-mode trading desks
- **Signal/noise:** dense data grids + glass panels + crimson edge-glow + sparse Solana cyan/blue accents
- **Motion language:** slow cinematic sweeps, audit scan lines, particle drift, gradient progress rails. No bouncy animation.

---

## 12. Tech Stack

### 12.1 Web
- **Next.js 14.2.x** (App Router, RSC) with `revalidate = 60` to keep edge cache short
- **React 18.3.1**, **TypeScript 5.7**
- **Tailwind CSS 3.4** with custom HSL semantic tokens (`tailwind.config.ts`)
- **framer-motion 12.x** for entrance/state transitions
- **lucide-react** for iconography
- **Radix UI** primitives: `Dialog`, `Tooltip`, `Tabs`
- **clsx** + **tailwind-merge** + **class-variance-authority** for class composition
- **Three.js** + **@react-three/fiber** (vendored to keep package surface tight) for hero scene
- **@solana/web3.js 1.98.x** from npm — real Solana JavaScript client

### 12.2 Onchain
- **Anchor 1.0.2** (avm-managed)
- **Rust** via rustup (toolchain pinned by `rust-toolchain.toml`)
- **solana-cli 3.1.x**
- **LiteSVM** for fast in-process integration tests
- Standard Solana **Memo Program** for MVP attestation transactions

### 12.3 Infra
- **DigitalOcean App Platform** (Dockerized — `Dockerfile`, `.dockerignore` present)
- **QuickNode** Solana devnet RPC endpoint (server-side only)
- Custom domain **praetores.com** routed through DO
- Build: `npm install && npm run build`. Run: `npm run start`. Port: `3000`.

### 12.4 Repo layout
```
praetor/
├── app/                    Next.js App Router (pages + API routes)
│   ├── api/health, /incidents/simulate, /solana/{status,blockhash,send-attestation}, /webhooks/quicknode
│   ├── /, /app, /dashboard, /demo, /render/hero-animation
│   ├── icon.tsx, apple-icon.tsx, manifest.ts (PWA metadata)
│   ├── layout.tsx (mounts AgenticHeroBackground + Header)
│   └── globals.css (design tokens + cinematic effects)
├── components/
│   ├── Brand.tsx (LogoMark, Wordmark, Header)
│   ├── OperationalBadges.tsx
│   ├── background/ (AgenticHeroBackground, CinematicSecurityBackground, PraetorNetworkBackground)
│   ├── hero/ (PraetorHeroScene, PraetorHeroMedia)
│   ├── motion/Reveal.tsx
│   ├── ui/ (GlassPanel, MetricCard, PremiumButton, SectionShell, SharpDivider, StatusBadge)
│   └── UI.tsx, SystemBadge.tsx
├── lib/
│   ├── risk-engine.ts (deterministic scoring)
│   └── solana/ (constants.ts, server.ts — QuickNode connection factory + error cleaner)
├── solana/praetor_program/  Anchor v1.0 workspace (program + LiteSVM tests + IDL types)
├── public/brand/            praetor-mark.svg, praetor-wordmark.svg
├── src/                     Shadcn-derived primitives (legacy but in use)
├── vendor/                  Vendored three and @react-three/fiber
├── docs/                    handover.txt, this brief
├── README.md
├── AGENTS.md (MVP-first project rule)
├── Dockerfile, .env.example, .env.local
└── package.json, tailwind.config.ts, next.config.mjs, tsconfig.json
```

---

## 13. Architecture Overview

```
                 ┌───────────────────────────────────────────┐
                 │   Browser  (Next.js App Router, React 18) │
                 │  - /app drives wallet flow                │
                 │  - Phantom wallet signs client-side       │
                 └───────────────┬───────────────────────────┘
                                 │ fetch (cache: no-store)
                                 ▼
                 ┌───────────────────────────────────────────┐
                 │ Next.js Server Routes (Route Handlers)    │
                 │  /api/solana/status                       │
                 │  /api/solana/blockhash                    │
                 │  /api/solana/send-attestation             │
                 │  /api/incidents/simulate                  │
                 │  /api/webhooks/quicknode                  │
                 │  /api/health                              │
                 └───────────────┬───────────────────────────┘
                                 │ HTTPS
                                 ▼
                 ┌───────────────────────────────────────────┐
                 │ QuickNode Solana Devnet RPC Endpoint      │
                 │  getHealth, getSlot, getLatestBlockhash,  │
                 │  sendRawTransaction, getSignatureStatuses │
                 └───────────────┬───────────────────────────┘
                                 │
                                 ▼
                 ┌───────────────────────────────────────────┐
                 │ Solana Devnet                             │
                 │  - Memo Program tx (MVP attestation path) │
                 │  - Praetor Anchor Program HKQ5...qLbk     │
                 │    PDAs: ProtocolProfile, AttestationRec, │
                 │          GuardianChallengeRec             │
                 └───────────────────────────────────────────┘
```

Hard architectural rules:
- **No server-side signing.** Server only forwards already-signed bytes.
- **No private keys accepted.** API hard-rejects `privateKey | secretKey | keypair` payload fields.
- **All RPC traffic** flows through QuickNode (server-side env-injected URL only).
- **`incidentId` allowlist** — `/api/solana/send-attestation` only accepts `inc_demo_001` for MVP.

---

## 14. Security Model (MVP)

- Devnet only — explicitly NOT mainnet.
- Memo Program is the live attestation primitive in `/app` (smallest reliable proof).
- Anchor program is shipped as native upgrade path (not yet wired to `/app`).
- Server has zero key material. Praetor never custody-signs.
- `QUICKNODE_RPC_URL` is server-only; never exposed to client bundle.
- Webhook route (`/api/webhooks/quicknode`) verifies `x-quicknode-secret` header when configured.
- Roadmap items (deliberately out of scope for MVP): mainnet deployment, production policy enforcement, audited integrations, role-based guardian sets, multi-sig escalation policies.

---

## 15. Environment Variables

```
QUICKNODE_RPC_URL=                         # required, server-only
NEXT_PUBLIC_SOLANA_RPC_URL=                # optional, public client RPC
QUICKNODE_WEBHOOK_SECRET=                  # optional, used by /api/webhooks/quicknode
PRAETOR_PROGRAM_ID=HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk
NEXT_PUBLIC_PRAETOR_PROGRAM_ID=HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk
DEMO_VAULT_PROGRAM_ID=                     # intentionally empty for MVP
NEXT_PUBLIC_APP_URL=                       # https://praetores.com
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
```

---

## 16. Local Development

```bash
# Web app
npm install
npm run dev          # http://localhost:3000
npm run build
npm run start
npm run lint

# Onchain workspace
cd solana/praetor_program
anchor build
cargo test
anchor deploy --provider.cluster devnet
```

---

## 17. Deployment Notes

- DigitalOcean App Platform via Dockerfile (committed)
- Build: `npm install && npm run build`
- Run: `npm run start`
- HTTP port: `3000`
- Custom domain `praetores.com` mapped via DO custom-domain flow
- Edge cache shortened to ~60 s (`revalidate = 60` in `app/layout.tsx`) so brand/copy updates propagate within a minute through Cloudflare

Recent commit history (most recent first):
1. `Build: dockerize for DigitalOcean App Platform deploys`
2. `Build: regenerate package-lock.json to sync vendored praetor file: deps`
3. `Cache: cap static page revalidate at 60s for prompt rebrand propagation`
4. `Brand: serve PNG site icons + manifest so Phantom shows Praetor logo`
5. `Rebrand: Header semantic tokens + lava gradient on hero H1`
6. `Rebrand: Praetor SVG mark, wordmark, favicon to crimson on near-black`
7. `Rebrand: recolor PraetorHeroScene three.js palette to crimson`
8. `Rebrand: add AgenticHeroBackground canvas + wire next/font`
9. `Rebrand: tailwind theme to Raptor crimson + Space Grotesk fonts`
10. `Rebrand: globals.css to Raptor Labs neon-crimson on near-black`

---

## 18. Roadmap (post-hackathon)

Highest-value next tasks (per `docs/handover.txt`):
1. Add multiple incident scenarios (treasury / upgrade authority / signer-set change)
3. Public security profile pages for protected protocols
4. Live activity feed of attestations
5. Wire `/app` directly to the Anchor program (record_attestation + submit_guardian_challenge) to replace Memo Program path
6. Mainnet readiness: SDK package for protocols to install Praetor as a guard
7. Guardian app: standalone reviewer surface for guardians to approve/deny challenges
8. Slack/Discord alerts on critical incidents
9. Audit and formal verification of the Anchor program
10. Subscription model: per-protocol monthly fee tiered by attestation volume

---

## 19. Pitch Deck Talking Points (use these directly)

### Slide 1 — Title
- "PRAETOR — Onchain ops firewall for Solana protocols."
- Detect → Attest → Challenge → Block.
- praetores.com

### Slide 2 — The pain
- Solana protocols have lost hundreds of millions to privileged-action attacks (Drift, repeated DAO drains, upgrade-authority misuse).
- Existing tooling shows after-the-fact. There is no Solana-native, **pre-execution policy enforcement layer**.

### Slide 3 — What Praetor does
- A security control plane that scores privileged actions, **attests the decision onchain**, opens a guardian challenge, and **blocks unsafe execution before funds move**.

### Slide 4 — Live demo proof
- Deployed on Solana **devnet today**.
- QuickNode-backed. Wallet-signed. **Real Solana Explorer transactions** for every attestation.
- Anchor v1.0 program live at `HKQ5...qLbk` with three instructions and three PDA types.

### Slide 5 — Why it works on Solana
- Solana's speed + low fees make per-action attestation economically viable.
- Composability: any protocol can read Praetor's `AttestationRecord` PDA before executing privileged ops.
- Open-source primitives: deterministic risk engine + Anchor program reusable by any protocol.

### Slide 6 — Architecture
- Show the diagram in section 13.
- Highlight: zero server-side keys, zero custody, all transactions client-signed and routed through QuickNode.

### Slide 7 — Traction / what we shipped
- 4 production routes (`/`, `/app`, `/dashboard`, `/demo`)
- 6 live API routes
- Anchor program deployed to devnet, `cargo test` + LiteSVM integration tests passing
- Live custom domain, Dockerized, redeployable in minutes
- Deterministic risk engine with 6 rules + 4-tier severity

### Slide 8 — Business model
- **B2B subscription:** monthly per-protocol fee tiered by attestation volume + protected-treasury TVL
- **Enterprise:** custom guardian sets, dedicated support, SLAs
- **Public-goods tier:** free for OSS protocols < threshold (drives ecosystem adoption + accelerator alignment)
- **Insurance partner channel:** attestations as evidence for treasury-coverage policies

### Slide 9 — Market
- TAM: every Solana DAO with a treasury, every protocol with upgrade authority, every multisig that holds user funds
- Reference cohort: Drift, Kamino, Squads, Realms, Jupiter, Jito, Tensor, Phantom, MarginFi, Reflect — all need this
- Adjacent EVM precedents (Forta, Halborn, OpenZeppelin Defender) prove the category; Solana lacks a native equivalent

### Slide 10 — Founder-market fit
- Bob: senior security architect, CyberLink Security; built the entire MVP (Anchor program + Next.js + infra).
- Jelena: CEO, partnerships, ecosystem GTM.
- 2-person team that shipped a working onchain security primitive in the hackathon window.

### Slide 11 — Roadmap
- Replace Memo path with Anchor `record_attestation` in `/app`
- Mainnet deployment, audited program, SDK
- Guardian reviewer app
- Real-time alert pipeline

### Slide 12 — Ask
- Colosseum Frontier prize + accelerator admittance
- $250K pre-seed to ship mainnet, audit the program, and onboard 5 design-partner protocols in 90 days.

---

## 20. Submission Checklist (status as of 2026-05-10)

| Item | Status |
|---|---|
| Public GitHub repo | ✅ `github.com/bobvasic/praetor` |
| Live demo URL | ✅ `https://praetores.com/app` |
| Deployed Anchor program (devnet) | ✅ `HKQ5...qLbk` |
| QuickNode-backed wallet flow | ✅ |
| Real Solana Explorer link per attestation | ✅ |
| Brand identity (logo, wordmark, palette, fonts) | ✅ |
| Risk engine (open-source) | ✅ `lib/risk-engine.ts` |
| Twitter / X | ✅ `@PraetorHQ` |
| Project description / tagline | ✅ in `README.md` |
| MIT or similar LICENSE file | ⚠ verify and add if missing |
| Pitch video ≤ 3 min (Loom/YouTube, public) | ❌ to be recorded |
| Technical demo video 2–3 min | ❌ to be recorded |
| Both team members on Colosseum platform team | ⚠ verify |
| Submission form filled & submitted before 2026-05-11 23:59 PT | ❌ pending |

---

## 21. Key Facts for Downstream LLMs (Cheat Sheet)

- Product: **Praetor**, onchain ops firewall for Solana protocols.
- Tagline: **Detect → Attest → Challenge → Block.**
- Domain: **praetores.com**. GitHub: **github.com/bobvasic/praetor**. X: **@PraetorHQ**.
- Hackathon: **Solana Frontier**, deadline **2026-05-11 23:59 PT**.
- Cluster: **Solana devnet**. RPC: **QuickNode**. Wallet: **Phantom**.
- Anchor program ID: **HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk** (Anchor v1.0.2).
- Three Anchor instructions: `initialize_protocol_profile`, `record_attestation`, `submit_guardian_challenge`. Three PDAs: `protocol_profile`, `attestation`, `guardian_challenge`.
- Demo incident: `inc_demo_001`, DemoDAO Treasury, treasury_withdrawal 25 SOL > 10 SOL threshold, unknown signer, non-allowlisted destination → score **91, critical, blocked**.
- Risk engine rules: 6 deterministic rules summing to a 0–100 score, level boundaries 0/30/60/80.
- Tech stack: Next.js 14 App Router + React 18 + TypeScript 5.7 + Tailwind 3.4 + framer-motion + Three.js + Anchor 1.0 + Rust + LiteSVM.
- Brand palette: neon crimson (`hsl(0 100% 55%)` primary) on near-black (`hsl(0 0% 4%)` background), Solana cyan/blue/purple accents, lava gradient for hero H1.
- Fonts: **Space Grotesk** (display + body), **Inter** (secondary), ui-monospace (code/labels).
- Logo: shield mark with bold gradient "P" on near-black; wordmark "PRAETOR" in tracked uppercase Space Grotesk.
- Mood for visuals: cinematic command-center, audit reticle, particle drift, slow gradient sweeps, no bouncy motion.
- Deployment: DigitalOcean App Platform, Dockerized, port 3000, custom domain via DO.
- Security: zero server-side keys, wallet signs client-side only, server hard-rejects any payload containing private keys.
- Team: Bob (CTO, security architect, builder) + Jelena (CEO, strategy, partnerships).
- Business model: B2B subscription per protected protocol + enterprise + public-goods free tier + insurance channel.
- Ask: Colosseum prize + accelerator + $250K pre-seed → mainnet, audit, 5 design-partner protocols in 90 days.
