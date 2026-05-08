export function SecurityBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-obsidian">
      <div className="absolute inset-0 bg-radial-grid" />
      <div className="security-orb security-orb-blue" />
      <div className="security-orb security-orb-cyan" />
      <div className="security-orb security-orb-gold" />
      <div className="hex-mesh absolute inset-0 opacity-[0.18]" />
      <div className="circuit-board absolute inset-0 opacity-[0.16]" />
      <div className="grid-mask absolute inset-0 opacity-60" />
      <div className="scanline absolute inset-x-0 top-0 h-40 opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,transparent,rgba(9,11,16,0.40)_48%,#090B10_100%)]" />
    </div>
  );
}
