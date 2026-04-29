import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse_slow: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.4" },
        },
      },
      animation: {
        "scroll":      "scroll 20s linear infinite",
        "fade-in":     "fadeIn 0.5s ease-out forwards",
        "pulse-slow":  "pulse_slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
