import type { Config } from "tailwindcss";

/**
 * Raptor Labs theme: neon-crimson on near-black.
 * Semantic HSL tokens come from app/globals.css :root block.
 * Legacy keys (obsidian/graphite/sovereign/arctic/gold/secure/alert/etc)
 * are re-pointed to crimson values so existing class usage keeps working.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
      },
      colors: {
        // Raptor Labs semantic tokens (driven by --background, --foreground, etc.)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glow: {
          red: "hsl(var(--glow-red))",
          crimson: "hsl(var(--glow-crimson))",
          lava: "hsl(var(--glow-lava))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Legacy keys remapped to crimson + near-black (kept for backward compat)
        obsidian: "#0A0A0A",
        graphite: "#0F0F0F",
        titanium: "#BCBCBC",
        sovereign: "#FF1A1A",
        arctic: "#FF6B6B",
        gold: "#FF4040",
        secure: "#C81E1E",
        alert: "#FF1A1A",
        ink: "#0A0A0A",
        cyanfire: "#FF6B6B",
        vault: "#0F0F0F",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 30px hsl(0 100% 50% / 0.4), 0 0 60px hsl(0 100% 45% / 0.2)",
        intense: "0 0 50px hsl(0 100% 50% / 0.6), 0 0 100px hsl(0 100% 45% / 0.3)",
        card: "0 24px 90px rgba(0, 0, 0, 0.62)",
        command: "inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 120px rgba(0,0,0,0.62)",
        gold: "0 0 54px hsl(0 100% 50% / 0.18)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 16% 0%, hsl(0 100% 50% / 0.18), transparent 30rem), radial-gradient(circle at 82% 16%, hsl(0 100% 55% / 0.10), transparent 28rem), radial-gradient(circle at 50% 100%, hsl(15 100% 50% / 0.08), transparent 34rem)",
        "panel-gradient":
          "linear-gradient(135deg, rgba(15,15,15,0.92), rgba(10,10,10,0.82))",
        "gradient-lava":
          "linear-gradient(135deg, hsl(0 100% 50%), hsl(20 100% 45%), hsl(0 100% 40%))",
        "gradient-ember":
          "linear-gradient(180deg, hsl(0 100% 55% / 0.8), hsl(15 100% 45% / 0.6))",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
