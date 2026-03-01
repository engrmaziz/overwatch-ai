import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--accent-green) / <alpha-value>)",
        background: "rgb(var(--bg-primary) / <alpha-value>)",
        foreground: "rgb(var(--text-primary) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--accent-green) / <alpha-value>)",
          foreground: "rgb(var(--bg-primary) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--bg-card) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
        elevated: {
          DEFAULT: "rgb(var(--bg-elevated) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
        overwatch: {
          green: "rgb(var(--accent-green) / <alpha-value>)",
          red: "rgb(var(--accent-red) / <alpha-value>)",
          amber: "rgb(var(--accent-amber) / <alpha-value>)",
          blue: "rgb(var(--accent-blue) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--text-secondary) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
      },
      backgroundImage: {
        'scanline': 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0, 255, 136, 0.03) 2px, rgba(0, 255, 136, 0.03) 4px)',
        'mesh': 'radial-gradient(at 40% 20%, hsla(220,100%,15%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(180,100%,20%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(240,100%,10%,0.1) 0px, transparent 50%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "sweep": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "sweep": "sweep 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
