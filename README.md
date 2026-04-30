<p align="center">
  <img src="./assets/praetor-banner.png" alt="Praetor Banner" width="100%" />
</p>

# Praetor

**Onchain ops firewall for Solana protocols.**

Praetor monitors privileged protocol actions such as treasury withdrawals, upgrade-authority usage, admin signer activity, and governance execution.

High-risk actions generate onchain security attestations, guardian challenges, and optional enforcement for integrated protocols.

---

## Core Flow

```txt
Detect → Attest → Challenge → Block
```

---

## What It Does

- Monitors protected Solana protocol addresses
- Detects risky treasury and admin activity
- Scores operational risk in real time
- Writes verifiable security attestations onchain
- Enables guardian challenge workflows
- Blocks unsafe execution for integrated protocols

---

## Built With

- Solana
- Anchor / Rust
- TypeScript
- Next.js
- Fastify
- PostgreSQL
- QuickNode
- DigitalOcean

---

## Demo

The MVP demonstrates a protected Solana treasury vault where a suspicious withdrawal is detected, attested onchain, challenged by a guardian, and blocked before execution.

---

## Status

Built for **Colosseum Frontier Hackathon 2026**.

---

## Team

**BOB** — Co-founder, CTO, Security Architect  
**Jelena** — CEO, Strategy, Partnerships

---

## Contact

X: [@bobvasx](https://x.com/bobvasx)  
Telegram: [@ZoComp](https://t.me/ZoComp)
