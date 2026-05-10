# Praetor Visual Polish — Handoff
Pass executed against the brief in `docs/ui polish.txt`. Strictly UI / className / copy. No business logic, no API, no wallet, no transaction, no QuickNode, no Solana program, no env, no localStorage, no Anchor program, no Dockerfile, no deployment config touched.
Demo state machine on `/demo` was deliberately left untouched per Bob's instruction during execution. Hero canvas (`AgenticHeroBackground`) was also left as-is per Bob's instruction. Video placeholder section on `/demo` was deliberately deferred per Bob's instruction.
## Files Changed
Visual / className / copy only:
- `app/globals.css` — full rewrite (matte black + crimson + honeycomb; legacy decorative classes neutralized).
- `tailwind.config.ts` — gradients/shadows visual tokens only; legacy keys preserved as no-op.
- `app/layout.tsx` — untouched (hero canvas mount preserved).
- `app/page.tsx` — full rewrite of the landing per spec sections.
- `app/app/page.tsx` — JSX/className/copy-only edit; all hooks, state, handlers, fetch calls, transaction building, wallet signing, QuickNode RPC code, and `localStorage` calls preserved verbatim.
- `app/dashboard/page.tsx` — JSX/className/copy-only edit; all hooks, fetch calls, and `localStorage` reads preserved verbatim. Removed the `<SharpDivider />` slash. Added empty-state copy.
- `components/Brand.tsx` — Header restyled to crimson active-route tactical nav. Nav labels retained: `Praetor` → `/`, `Launch Devnet App` → `/app`, `Dashboard` → `/dashboard`, `Guided Walkthrough` → `/demo`. Now a client component to derive the active route.
- `components/OperationalBadges.tsx` — fourth badge tone changed `orange` → `crimson` (text only; same copy).
- `components/ui/StatusBadge.tsx` — tone palette rewritten. Cyan/teal kept only for `online` / `devnet` / `cyan` (status-only). All other tones flattened to graphite + crimson border. Legacy `orange` and `gold` aliased to crimson. Removed inner gradient sweep, removed glow shadow, removed backdrop blur.
- `components/ui/GlassPanel.tsx` — removed the orange blur blob and white horizontal sweep. Single restrained crimson hairline at top.
- `components/ui/PremiumButton.tsx` — flattened. Variants: `crimson` (flat E10600 → FF2020 hover), `glass`, `danger` (deep crimson 7A0710), `ghost`. Legacy `orange` aliased to `crimson`. Sharper geometry (`rounded-md`, `px-5 py-2.5`). Crimson focus ring on near-black ring-offset.
- `components/ui/MetricCard.tsx` — graphite icon plate, white tabular value, restrained tone palette. Legacy tones (`orange`, `gold`) aliased to crimson.
- `components/SystemBadge.tsx` — flattened to status pill (no gradient sweep, no `solana-pill` class).
- `components/hero/PraetorHeroMedia.tsx` — removed gold/yellow radial overlay; bottom-strip labels desaturated (no orange/cyan decorative accent text on the hero strip).
Untouched (intentionally):
- All `app/api/*` route handlers.
- All `lib/*` (`risk-engine.ts`, `demo-data.ts`, `solana/constants.ts`, `solana/server.ts`).
- `app/demo/page.tsx` — full state machine and visuals left as-is per Bob's mid-pass override. Will inherit color cleanup from globals/tailwind cascade only.
- `components/background/AgenticHeroBackground.tsx` — left as-is per Bob's mid-pass instruction (hero canvas keeps its honeycomb + neural mesh).
- `components/background/CinematicSecurityBackground.tsx` and `components/background/PraetorNetworkBackground.tsx` — not mounted in the live layout; intentionally left untouched. Their CSS dependencies in `globals.css` were neutralized to no-op so they cannot render decorative noise if ever mounted.
- `components/hero/PraetorHeroScene.tsx` — left as-is (referenced by `PraetorHeroMedia` fallback; canvas already crimson-aligned).
- `components/motion/Reveal.tsx`, `components/ui/SectionShell.tsx`, `components/ui/SharpDivider.tsx` — already minimal; no edits needed beyond the `SharpDivider` removal from `/dashboard`.
- All `solana/praetor_program/*` files.
- All vendored packages.
- `Dockerfile`, `.dockerignore`, `next.config.mjs`, `package.json`, `package-lock.json`, env files.
## Color Cleanup Summary
- Established a single `:root` design-token block in `globals.css` with the crimson palette pinned to `#FF2020`, `#E10600`, `#B80F1C`, `#990000`, `#7A0710` and the background palette pinned to `#050505`, `#070707`, `#0A0A0A`, `#101010`, `#121212`.
- Borders standardized to `rgba(255,255,255,0.10)` (neutral) and `rgba(255,32,32,0.24)` (crimson accent).
- Muted text raised to `rgba(255,255,255,0.62)` / `0.74` for readability.
- Legacy CSS variables (`--praetor-orange`, `--praetor-orange-soft`, `--praetor-blue`, `--praetor-cyan`, `--praetor-deep-navy`) re-pointed to crimson / off-white / near-black so existing className strings keep compiling but render the new palette.
- Tailwind legacy keys (`obsidian`, `graphite`, `sovereign`, `arctic`, `gold`, `secure`, `alert`, `cyanfire`, `vault`) re-pointed to crimson / near-black.
## Orange / Amber / Yellow Removal
- `--praetor-orange` and `--praetor-orange-soft` re-pointed to `#FF2020` / `#FF6B6B` (crimson) so any class string still referencing them now renders crimson.
- `StatusBadge` `orange` and `gold` tones aliased to crimson border + graphite background.
- `MetricCard` `orange` and `gold` tones aliased to crimson value text.
- `PremiumButton` `orange` variant aliased to `crimson` flat.
- `OperationalBadges` fourth pill switched `orange` → `crimson`.
- `PraetorHeroMedia` removed the gold radial overlay and orange/cyan decorative label classes.
- `Brand.tsx` Header — no orange/amber/yellow remains; active route is crimson, idle is white/55, hover is white.
- `globals.css` legacy classes referencing orange/lava/ember (e.g. `security-orb-gold`, `solana-gradient-ribbon`, `praetor-orange-slab`) neutralized to `opacity: 0` no-op selectors.
- Tailwind `gradient-lava` and `gradient-ember` keys set to `none`. `radial-grid` set to `none`.
- No remaining `text-amber*`, `bg-amber*`, `border-amber*` class strings introduced. No remaining `text-yellow*`, `bg-yellow*` class strings introduced.
- No remaining `#ff8200`, `#ff8a00`, `#f97316`, `#fb923c`, `#f59e0b` color literals introduced.
## Decorative Blue Removal
- `--praetor-blue` re-pointed to `#B80F1C` (deep crimson). Any reference to it now renders crimson.
- `StatusBadge` cyan tones (used only for verified/online/connected/devnet status badges per the brief) restricted to `#5EE3FF` / `#7BD9F2` / `#5DE0BB` border + text only on graphite.
- `PraetorHeroMedia` cyan label removed; replaced with white/70 mono label and crimson-tinted directional caption.
- `globals.css` blue glows in `.security-orb-blue`, blue gradients in `.security-depth-field`, blue beams in `.cinematic-sweep` / `.praetor-beam-stack` / `.praetor-data-stream-blue` / `.praetor-network` neutralized to `opacity: 0`.
- No `bg-blue*` panel tints. No `from-blue*`/`to-blue*`/`via-blue*` gradients introduced. No blue dividers, no blue beams, no purple/blue decorative atmosphere.
## Gradient Removal
- All multicolor gradients in `globals.css` decorative classes neutralized to `transparent`.
- `text-gradient-lava` neutralized to plain white (`color: #FFFFFF`, no clip).
- `glow-text` neutralized to plain white text without color glow.
- Tailwind `gradient-lava`, `gradient-ember`, `radial-grid` background-image keys set to `none`.
- `panel-gradient` simplified to a tight near-black 180° gradient (`#0A0A0A → #070707`) — solid feel.
- `PremiumButton` `orange`/`crimson` variant changed from a multicolor lava gradient to flat crimson `#E10600` with `#FF2020` hover.
- `PremiumButton` `danger` variant changed from a 135° pink-to-burgundy gradient to flat `#7A0710` with `#990000` hover.
- `StatusBadge` tones changed from `linear-gradient(...)` per-tone backgrounds to flat `#0A0A0A` graphite.
- `GlassPanel` removed both the white sweep and the orange blur blob; only a single subtle crimson hairline at the top edge.
- `MetricCard` icon plate is solid `#101010` with neutral border, not a gradient.
## Diagonal Slash / Beam Background Removal
- `globals.css` decorative beam/sweep classes neutralized: `.cinematic-sweep`, `.praetor-beam-stack`, `.praetor-light-sweep`, `.scanline`, `.command-grid-drift`, `.radar-sweep`, `.audit-reticle`, `.solana-gradient-ribbon`, `.praetor-orange-slab`, `.praetor-navy-slab`, `.praetor-data-stream*`, `.praetor-firewall-mesh`, `.praetor-firewall-shield`, `.security-orb*`, `.security-depth-field`, `.flow-connector`, `.console-orbit`, `.audit-scanline`, `.grid-mask`, `.circuit-board`, `.hero-energy-well`, `.premium-shell` — all set to `background: transparent; opacity: 0; animation: none; pointer-events: none;`.
- `<SharpDivider />` instance on `/dashboard` removed. Component still exists; CSS class `.praetor-sharp-divider` reduced to a 1px crimson hairline (no diagonal beam).
- No new diagonal beams, sweep lines, or red/blue slash bands introduced. The only motion remaining inside `globals.css` is the small `.praetor-status-pulse` (online dot) and the optional thin `.praetor-scanline` (not mounted in the live layout).
## Honeycomb-Only Background Confirmation
- The single allowed decorative background pattern is `.praetor-honeycomb` in `globals.css`, built from low-opacity (`0.045`) crimson 30°/150° linear-gradient rows.
- Used on the landing hero behind the GlassPanel via `.praetor-honeycomb pointer-events-none absolute inset-0 opacity-[0.55]`.
- Legacy `.hex-mesh` class kept and re-pointed to a crimson honeycomb (so any old reference renders compatibly).
- All other decorative background classes are now visually inert (`opacity: 0`).
- Mobile sanity rule keeps the honeycomb tile size proportional below 768px.
## Sharper Geometry / Radius Changes
- Containers max radius: `rounded-2xl` (~20–24px) — applied to landing hero panels, `/app` header, `/dashboard` header, dashboard final assurance card.
- Inner cards: `rounded-xl` (~12–18px) — applied to all panels, attestation panels, protected-protocol cards, console preview card, technical-proof cards.
- Mini-cards / status banners: `rounded-md` (sharper, ~6–8px) — applied to the wallet warning, error banner, traffic-light status rows.
- Buttons: `rounded-md` with `px-5 py-2.5` (sharp tactical rectangle, was `rounded-2xl px-6 py-3.5`).
- Icon plates: `rounded-md` with `p-2` / `p-2.5` graphite tile (was `rounded-2xl` with translucent surface).
- Radii in `globals.css` design tokens: `--radius: 0.5rem` retained.
- Removed all `rounded-3xl` / `rounded-[1.75rem]` / `rounded-[2.25rem]` / `rounded-[2.5rem]` / `rounded-[1.25rem]` from active page surfaces (left only on the hero media frame inherited from the untouched scene).
- Borders crimson-tinted on critical surfaces (`rgba(255,32,32,0.32–0.55)`), neutral white at 8–12% on standard panels.
- `GlassPanel` reduced to `border-radius: 1.25rem` solid graphite. No backdrop blur on the panel itself.
- Removed soft shadow blooms; tailwind `shadow-card` / `shadow-command` are now restrained (`0 12–14px 28–36px / 0.42 black`). Legacy `shadow-glow`, `shadow-intense`, `shadow-gold` aliased to thin inset crimson borders so old usages compile without flashy bloom.
## Landing Page Changes (`app/page.tsx`)
Full rewrite per the brief.
- Hero title `Onchain Ops Firewall for Solana Protocols` (white, with `Solana` in `#FF2020`).
- Subtitle copy verbatim from spec.
- Status badges: `All Systems Online`, `Solana Devnet`, `QuickNode RPC Connected`, `Onchain Attestation Ready`.
- CTAs: `Launch Devnet App` (crimson), `View Dashboard` (glass), `Guided Walkthrough` (ghost).
- Right-column security console preview: `DemoDAO Treasury`, `91/100`, `Critical`, `Execution blocked by Praetor policy.`, network/RPC/attestation rows.
- "What Praetor does" section with the four prescribed cards (Detect / Attest / Challenge / Block).
- "Why it matters" section with the three prescribed lines (no invented data).
- "Technical proof" grid with the six prescribed items.
- "Core loop" big visual block (Detect → Attest → Challenge → Block).
- Honeycomb behind the hero, otherwise matte near-black.
## `/app` Safety Note
- All `useState`, `useEffect`, `useMemo` calls preserved verbatim.
- `connectWallet`, `triggerSuspiciousOperation`, `createDevnetAttestation` handler bodies untouched.
- `/api/solana/status`, `/api/solana/blockhash`, `/api/solana/send-attestation` fetch logic untouched.
- `Transaction`/`PublicKey`/`TransactionInstruction` build code untouched.
- `provider.signTransaction(...)` flow untouched.
- `localStorage` key `praetor.devnet.attestation.inc_demo_001` and serialization untouched.
- `PRAETOR_INCIDENT_ID`, `PRAETOR_ANCHOR_PROGRAM_ID`, `SOLANA_MEMO_PROGRAM_ID`, `getExplorerAddressUrl` imports untouched.
- Visual edits applied: panel radii, padding, border tokens, copy lines from the brief ("Wallet signs client-side only…", "QuickNode RPC provides…", "25 SOL withdrawal against a 10 SOL threshold…", "Decision: Block. Guardian challenge required.", "Execution blocked by Praetor policy."), tone of `StatusBadge` for "Wallet Required" and "Final blocked state" switched from `orange` to `crimson`.
## `/dashboard` Safety Note
- All `useState`, `useEffect` and the 20s polling interval untouched.
- `/api/solana/status` and `/api/incidents/simulate` fetch logic untouched.
- `localStorage` read of `praetor.devnet.attestation.inc_demo_001` untouched.
- `protectedAddresses`, `demoIncident` imports untouched.
- `<SharpDivider />` slash divider removed (visual cleanup per brief: "Remove any diagonal slash/beam divider from dashboard if present.").
- Subtitle replaced with the prescribed copy.
- Metric helper text aligned to the prescribed strings.
- Empty-state added on the "Latest devnet proof" panel: when no `attestation` is present, the panel renders the prescribed "No latest attestation yet. Create a devnet attestation in Launch Devnet App." with a `Launch Devnet App` link.
- No invented charts, history, incident counts, users, volume, or revenue introduced.
## `/demo` Note
Per Bob's mid-pass instruction, the existing guided state-machine page was left fully intact. No edits to `app/demo/page.tsx` were made. Bob also instructed to defer the video-placeholder section, so the brief's `/demo` section is parked for a follow-up pass. The page will inherit the new palette through the `globals.css` and `tailwind.config.ts` cascade only.
## Confirmation: Logic Untouched
- API routes: `app/api/*` — none modified.
- Wallet flow: `connectWallet`, `signTransaction`, base64 serialization — unchanged.
- Solana transaction logic: `Transaction`, `TransactionInstruction`, `PublicKey`, blockhash fetch, `feePayer`, Memo Program data — unchanged.
- QuickNode RPC integration: server routes and `lib/solana/server.ts` — unchanged.
- Anchor program: `solana/praetor_program/*` — unchanged. Program ID `HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk` unchanged.
- Environment variables and `.env*` files — unchanged.
- `localStorage` keys and serialization — unchanged.
- Risk engine `lib/risk-engine.ts` — unchanged.
- Deployment config (`Dockerfile`, `.dockerignore`, `next.config.mjs`) — unchanged.
- `package.json` / dependencies — unchanged.
## Validation Commands Run
```bash
npm run lint
npm run build
```
## Lint / Build Result
- `npm run lint` — `✔ No ESLint warnings or errors`.
- `npm run build` — `✓ Compiled successfully`, `✓ Linting and checking validity of types`, `✓ Generating static pages (12/12)`, all 12 routes built (`/`, `/_not-found`, `/api/*`, `/app`, `/dashboard`, `/demo`, `/manifest.webmanifest`, `/render/hero-animation`, `/icon`, `/apple-icon`).
## Risks / Warnings
- `globals.css` neutralizes a large surface of legacy decorative classes (`security-orb*`, `cinematic-sweep`, `praetor-beam-stack`, `praetor-data-stream*`, `praetor-firewall-*`, `praetor-orange-slab`, `praetor-navy-slab`, `solana-gradient-ribbon`, etc.). The components that defined these classes (`CinematicSecurityBackground`, `PraetorNetworkBackground`) are not mounted in the live layout; if a future change re-mounts them, those visuals will render as no-ops.
- Two background components in `components/background/*` (CinematicSecurityBackground, PraetorNetworkBackground) still contain orange/blue color literals in TSX. Per Bob's instruction the hero/background components were left untouched. They are dead code in the active layout, but if they get re-mounted they should be re-polished or replaced before shipping.
- `/demo` was deliberately not visually polished beyond what cascades from globals/tailwind. A focused pass is queued.
- Legacy `text-gradient-lava` and `glow-text` references in any remaining markup will render as plain white (intended). If any future component depends on a colored gradient text effect, it must be reintroduced explicitly.
- `--praetor-cyan` was re-pointed to off-white. Any text that used it for decorative non-status purposes (e.g. address fonts, blockhash previews) will now render as off-white instead of cyan. This was intentional per the brief ("Blue/cyan is allowed ONLY for tiny online/connected/verified/confirmed status…").
- Build runs without warnings, but Next.js notes that pages using the edge runtime disable static generation (this is unchanged behavior and unrelated to the polish pass).
## Quick Final Report (per brief)
- Files changed: see "Files Changed" above.
- Orange / amber / yellow removed: yes.
- Decorative blue removed: yes.
- Gradients removed: yes (decorative). Solid graphite + flat crimson buttons remain.
- Diagonal slash / beam background removed: yes (CSS classes neutralized; `SharpDivider` instance removed from dashboard).
- Only honeycomb remains in background: yes (`.praetor-honeycomb`, `.hex-mesh` re-pointed).
- Hero title is white: yes, with `Solana` in crimson.
- Rounded corners sharpened: yes.
- Build passed: yes.
- Handoff file location: `PRAETOR_VISUAL_CHANGES_HANDOFF.md` at repo root.
