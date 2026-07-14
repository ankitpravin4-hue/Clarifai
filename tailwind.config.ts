import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
        highlight: "var(--highlight)",
        ink: "var(--ink)",
        navy: "#18130e",
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        risk: {
          high: "var(--risk-high)",
          medium: "var(--risk-medium)",
          low: "var(--risk-low)",
          "high-foreground": "var(--risk-high-foreground)",
          "medium-foreground": "var(--risk-medium-foreground)",
          "low-foreground": "var(--risk-low-foreground)",
        },
        surface: "#ffffff",
        line: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        hand: ["var(--font-caveat)", "cursive"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        card: "12px",
        badge: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(24, 19, 14, 0.06), 0 4px 12px rgba(24, 19, 14, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
