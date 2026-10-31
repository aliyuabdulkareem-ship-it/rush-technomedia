import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e1320",
        "surface-container": "#1b1f2d",
        "surface-container-low": "#171b29",
        "surface-container-lowest": "#090e1b",
        "surface-container-high": "#252a38",
        primary: "#b9c3ff",
        "primary-container": "#1447e6",
        "primary-fixed": "#dde1ff",
        "primary-fixed-dim": "#b9c3ff",
        secondary: "#bcc5ef",
        tertiary: "#7bd0ff",
        "tertiary-fixed": "#c4e7ff",
        "tertiary-fixed-dim": "#7bd0ff",
        "on-surface": "#dee2f5",
        "on-surface-variant": "#c4c5d8",
        "on-primary": "#002388",
        "on-primary-container": "#c9d0ff",
        "on-tertiary": "#00354a",
        "on-tertiary-container": "#9fdbff",
        outline: "#8e90a1",
        "outline-variant": "#434655",
        error: "#ffb4ab",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        display: ["var(--font-space)", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["64px", { lineHeight: "72px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-hero-mobile": ["38px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["44px", { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "caption": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "500" }],
      },
      animation: {
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "float-delayed": "floatReverse 7s ease-in-out infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
