/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle in .next/standalone so the Docker
  // runtime image only needs to copy three folders (standalone, static,
  // public) and run `node server.js` — no node_modules in the final image.
  output: "standalone",
  // Force a unique buildId on every build so DigitalOcean's standalone
  // runtime cannot reuse cached chunks or in-memory prerender data across
  // deploys. Without this, /` was being served from a previous build's
  // ISR cache even after force-rebuild + force-deploy.
  generateBuildId: async () => {
    return `praetor-${Date.now()}`;
  },
};

export default nextConfig;
