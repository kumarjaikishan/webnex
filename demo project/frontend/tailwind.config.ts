import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF4FF",
          100: "#DBE6FE",
          400: "#5B8DF6",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        secondary: {
          DEFAULT: "#7C3AED",
          400: "#A78BFA",
          600: "#6D28D9",
        },
        accent: {
          DEFAULT: "#06B6D4",
          400: "#22D3EE",
        },
        ink: "#111827",
        surface: "#FFFFFF",
        night: {
          DEFAULT: "#0F172A",
          800: "#1E293B",
          700: "#293548",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        ui: ["'Manrope'", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)",
        "accent-gradient": "linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)",
        "glow-radial": "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.15), transparent 60%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -8px rgba(17,24,39,0.10)",
        "card-hover": "0 12px 32px -8px rgba(37,99,235,0.25)",
        glow: "0 0 0 1px rgba(124,58,237,0.15), 0 20px 60px -20px rgba(124,58,237,0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "gradient-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
