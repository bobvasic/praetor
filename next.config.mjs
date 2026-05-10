/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle in .next/standalone so the Docker
  // runtime image only needs to copy three folders (standalone, static,
  // public) and run `node server.js` — no node_modules in the final image.
  output: "standalone",
};

export default nextConfig;
