# Praetor

**Onchain Ops Firewall for Solana Protocols**

Praetor is a demo-ready Colosseum MVP for monitoring and stopping high-risk Solana protocol operations. It presents a premium dark security console, an interactive guided incident flow, deterministic local API responses, and deployable Next.js infrastructure for DigitalOcean App Platform.

```txt
Detect → Attest → Challenge → Block
```

Domain: **praetores.com**

## Live Demo Routes

- `/` — premium landing page with PRAETOR branding, institutional Solana security positioning, and CTA to the guided demo.
- `/demo` — interactive guided demo that simulates a suspicious treasury withdrawal, creates a critical incident with risk score `91`, prepares an attestation, submits a guardian challenge, and blocks execution.
- `/dashboard` — security command center with monitoring status, protected address count, critical incident preview, latest incident, and CTA to `/demo`.

## API Routes

- `GET /api/health` returns service health:

```json
{ "ok": true, "service": "praetor-api" }
```

- `GET /api/incidents/simulate` and `POST /api/incidents/simulate` return deterministic demo incident data:

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

- `POST /api/webhooks/quicknode` accepts QuickNode webhook payloads. If `QUICKNODE_WEBHOOK_SECRET` is configured, the endpoint validates the `x-quicknode-secret` header. Without a configured secret, it stays in demo mode and returns:

```json
{
  "ok": true,
  "accepted": true,
  "source": "quicknode",
  "mode": "demo"
}
```

## Risk Engine

`lib/risk-engine.ts` contains deterministic local scoring for demo incidents:

- treasury transfer above threshold: `+30`
- unknown signer: `+25`
- non-allowlisted destination: `+25`
- upgrade authority interaction: `+40`
- policy mismatch: `+20`
- repeated suspicious attempt: `+15`

Risk levels:

- `0-29` low
- `30-59` medium
- `60-79` high
- `80-100` critical

## Visual Identity

Praetor uses a premium, institutional dark-mode brand system: obsidian and graphite panels, titanium copy, sovereign blue and arctic cyan active states, sentinel gold assurance accents, secure teal verified states, and alert red critical badges only. The UI is designed to feel like a high-end Solana security console rather than a generic dashboard.

Created local brand assets:

- `public/brand/praetor-mark.svg`
- `public/brand/praetor-wordmark.svg`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development if you want webhook secret validation.

```bash
cp .env.example .env.local
```

Do not commit real secrets.

## DigitalOcean App Platform Deploy Notes

1. Push this repository to GitHub on the `main` branch.
2. In DigitalOcean, create a new **App Platform** app from GitHub.
3. Select repository `bobvasic/praetor` and branch `main`.
4. Use these settings:
   - Type: **Web Service**
   - Source directory: `/`
   - Build command: `npm install && npm run build`
   - Run command: `npm run start`
   - HTTP port: `3000`
5. Add environment variables only if needed:
   - `QUICKNODE_WEBHOOK_SECRET` — optional webhook validation secret.
6. Deploy the app, then point `praetores.com` to the DigitalOcean App Platform domain using DigitalOcean's custom domain flow.

## Built With

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local deterministic demo data

## Team

**BOB** — Co-founder, CTO, Security Architect  
**Jelena** — CEO, Strategy, Partnerships

## Contact

X: [@bobvasx](https://x.com/bobvasx)  
Telegram: [@ZoComp](https://t.me/ZoComp)

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

The recording step is intentionally manual and optional. `npm run build` does not generate or require the WebM file. If `public/brand/praetor-hero.webm` is absent or fails to load, the homepage gracefully falls back to the live browser-rendered Praetor hero scene.

The animation symbolizes Praetor protecting Solana protocol operations: a compact metallic city core represents protocol infrastructure, cyan/blue and Solana-toned streams represent verified onchain data, red/orange particles represent threat vectors, and gold/cyan shield geometry represents Praetor's defensive firewall intercepting risky privileged actions.
