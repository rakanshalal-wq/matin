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
        gold: {
          DEFAULT: "#D4A843",
          light: "#E8C060",
          dim: "rgba(212,168,67,0.12)",
          border: "rgba(212,168,67,0.22)",
        },
        bg: {
          DEFAULT: "#06060E",
          sb: "#08081A",
          card: "rgba(255,255,255,0.025)",
        },
        txt: {
          DEFAULT: "#EEEEF5",
          dim: "rgba(238,238,245,0.65)",
          muted: "rgba(238,238,245,0.38)",
        },
        bdr: {
          DEFAULT: "rgba(255,255,255,0.08)",
          light: "rgba(255,255,255,0.05)",
        },
      },
      fontFamily: {
        ar: ["Cairo", "sans-serif"],
        sans: ["Cairo", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
