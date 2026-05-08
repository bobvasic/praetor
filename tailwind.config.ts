import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#090B10",
        graphite: "#141A22",
        titanium: "#BCC6D3",
        sovereign: "#2C52FF",
        arctic: "#98E9FF",
        gold: "#C7A15B",
        secure: "#1C8E86",
        alert: "#FF5B6E",
        ink: "#090B10",
        cyanfire: "#98E9FF",
        vault: "#141A22",
      },
      boxShadow: {
        glow: "0 0 48px rgba(152, 233, 255, 0.16)",
        card: "0 24px 90px rgba(0, 0, 0, 0.42)",
        command: "inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 120px rgba(0,0,0,0.55)",
        gold: "0 0 54px rgba(199, 161, 91, 0.18)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 16% 0%, rgba(44,82,255,0.23), transparent 30rem), radial-gradient(circle at 82% 16%, rgba(152,233,255,0.13), transparent 28rem), radial-gradient(circle at 50% 100%, rgba(199,161,91,0.08), transparent 34rem)",
        "panel-gradient":
          "linear-gradient(135deg, rgba(20,26,34,0.92), rgba(9,11,16,0.82))",
      },
    },
  },
  plugins: [],
};

export default config;
