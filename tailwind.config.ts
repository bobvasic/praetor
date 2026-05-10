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
        obsidian: "#050505",
        graphite: "#0F0F0F",
        titanium: "#BCBCBC",
        sovereign: "#FF2020",
        arctic: "#E0E6EC",
        gold: "#FF2020",
        secure: "#1CC9A0",
        alert: "#FF2020",
        ink: "#050505",
        cyanfire: "#5EE3FF",
        vault: "#0A0A0A",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Restrained tactical shadows. No heavy soft blooms.
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 28px rgba(0,0,0,0.42)",
        command: "inset 0 1px 0 rgba(255,255,255,0.04), 0 14px 36px rgba(0,0,0,0.48)",
        // Legacy keys retained but neutralized so existing usages compile.
        glow: "0 0 0 1px rgba(255,32,32,0.18) inset",
        intense: "0 0 0 1px rgba(255,32,32,0.30) inset",
        gold: "0 0 0 1px rgba(255,32,32,0.18) inset",
      },
      backgroundImage: {
        // Solid graphite panel — no decorative gradient.
        "panel-gradient": "linear-gradient(180deg, #0A0A0A, #070707)",
        // Legacy keys retained as no-op solids so existing class usages compile.
        "radial-grid": "none",
        "gradient-lava": "none",
        "gradient-ember": "none",
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
