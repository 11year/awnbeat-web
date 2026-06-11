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
        primary: "#8CD9A6",
        secondary: "#FA9959",
        accent: "#7ACCEB",
        "brand-text": "#111827",
        "brand-muted": "#6b7280",
        bg: "#ffffff",
      },
      fontFamily: {
        anybody: ["var(--font-anybody)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
