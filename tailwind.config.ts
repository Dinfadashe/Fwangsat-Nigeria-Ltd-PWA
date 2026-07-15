import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        ink: {
          950: "#04070B",
          900: "#070B11",
          850: "#0A1019",
          800: "#0D151F",
          700: "#131E2B",
          600: "#1A2735",
          border: "rgba(255,255,255,0.08)",
        },
        signal: {
          DEFAULT: "#C8FF4D",
          dim: "#9FD93B",
          deep: "#7FB82E",
        },
        emerald: {
          DEFAULT: "#14493B",
          light: "#1D6650",
          bright: "#22916F",
        },
        water: {
          DEFAULT: "#33C7D9",
          light: "#7FE3EE",
          deep: "#12707D",
        },
        gold: {
          DEFAULT: "#F0B429",
          light: "#F7D774",
        },
        danger: "#FF5470",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "mesh-emerald":
          "radial-gradient(ellipse 80% 60% at 15% 0%, rgba(34,145,111,0.28), transparent 55%), radial-gradient(ellipse 60% 50% at 85% 15%, rgba(200,255,77,0.10), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(51,199,217,0.10), transparent 60%)",
        "grid-lines":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.45)",
        "glow-signal": "0 0 40px rgba(200,255,77,0.25)",
        "glow-water": "0 0 40px rgba(51,199,217,0.25)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;