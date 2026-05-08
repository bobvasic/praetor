# Praetor

**Onchain Ops Firewall for Solana Protocols**

Praetor is a demo-ready Colosseum hackathon MVP for monitoring privileged Solana protocol operations. It presents a polished security profile, an interactive guided incident flow, deterministic local API responses, and deployable Next.js infrastructure for DigitalOcean App Platform.

```txt
Detect → Attest → Challenge → Block
```

Domain: **praetores.com**

## Demo Pages

- `/` — premium landing page with dark cybersecurity positioning, problem/solution, and CTA to the guided demo.
- `/demo` — interactive flow that simulates a suspicious treasury withdrawal, creates a critical incident with risk score `91`, creates an attestation, opens a guardian challenge, and blocks execution.
- `/dashboard` — clean command center with protected addresses, incidents, risk score, monitoring status, and a public profile preview.

## API Routes

- `GET /api/health` returns:

```json
{ "ok": true, "service": "praetor-api" }
```

- `POST /api/incidents/simulate` returns deterministic demo incident data:
  - `riskScore: 91`
  - `riskLevel: critical`
  - `actionType: treasury_withdrawal`
  - `status: detected`
  - reasons for the suspicious action

- `POST /api/webhooks/quicknode` accepts QuickNode webhook payloads. If `QUICKNODE_WEBHOOK_SECRET` is configured, the endpoint validates the optional `x-quicknode-secret` header before accepting the payload.

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
3. Select repository `bobbasic/praetor` and branch `main`.
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
