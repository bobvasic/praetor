# Praetor — Security Model

Praetor is a security control plane for Solana protocol operations. This
document records the security envelope the MVP enforces today and the
boundaries that intentionally limit blast radius.

## Scope

- Network: Solana **devnet** only. The MVP is not deployed to mainnet.
- Surface: the Next.js web app at `praetores.com`, the Next.js server route
  handlers under `app/api/*`, and the Anchor program deployed at
  `HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk` on devnet.

## Hard guarantees

1. **No server-side signing.** The server never holds, derives, or signs with
   a private key. All wallet signing happens client-side through the
   user's connected Solana wallet (Phantom by default).
2. **No private keys accepted on the wire.** `POST /api/solana/send-attestation`
   hard-rejects any JSON body containing `privateKey`, `secretKey`, or
   `keypair` fields with HTTP 400 before any other work.
3. **Allowlisted incident id.** The same route accepts only the canonical
   MVP incident id (`inc_demo_001`). Any other id is rejected with HTTP 400.
4. **Base64-only signed-transaction shape.** The route validates the
   `signedTransaction` field as base64 of length ≥ 32 bytes and rejects
   anything that does not decode cleanly.
5. **QuickNode RPC URL is server-only.** `QUICKNODE_RPC_URL` is read from
   `process.env` inside server-only modules and never bundled into the
   client. The client uses the public Solana RPC only when the operator
   explicitly opts in via `NEXT_PUBLIC_SOLANA_RPC_URL`.
6. **Webhook auth.** `POST /api/webhooks/quicknode` requires the
   `x-quicknode-secret` header to match `QUICKNODE_WEBHOOK_SECRET` when
   that variable is configured.
7. **Gateway-budget RPC.** `sendRawTransaction` is raced against an 18 s
   timeout so a slow upstream cannot turn into a Cloudflare HTML 504.
   Client polls `/api/solana/tx-status` for confirmation instead of
   holding the server-side request open.
8. **No custody.** Praetor never holds user funds. Attestation transactions
   are signed by the user's wallet and submitted unchanged.

## Out of scope (roadmap, not MVP)

- Mainnet deployment.
- Production policy enforcement against live protocols.
- Audited Anchor program.
- Role-based guardian sets and multi-sig escalation.
- SDK packaging for third-party protocol integration.

## Reporting a vulnerability

Email `info@raptorlabs.dev` with the subject `praetor-security:` followed
by a short summary. Please include reproduction steps and the affected
route, file, or program instruction. Avoid public disclosure until we
have confirmed a fix or coordinated a disclosure window with you.

## Open-source primitives

The deterministic risk engine (`lib/risk-engine.ts`), the canonical demo
data (`lib/demo-data.ts`), and the Anchor program (`solana/praetor_program/`)
are MIT-licensed and intended for reuse by any Solana protocol.
