import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        paper: "#f8f4ec",
        accent: "#c76b3d",
        line: "#d4cdc1",
        muted: "#5d6777"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(20, 33, 61, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
