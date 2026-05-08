import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#020617",
        cyanfire: "#16f2d0",
        vault: "#082f49",
      },
      boxShadow: {
        glow: "0 0 50px rgba(22, 242, 208, 0.18)",
        card: "0 24px 80px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at top left, rgba(22,242,208,0.18), transparent 32rem), radial-gradient(circle at bottom right, rgba(14,165,233,0.16), transparent 36rem)",
      },
    },
  },
  plugins: [],
};

export default config;
