import { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

import { METAC_COLORS } from "./src/constants/colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: Object.assign({ xs: "480px" }, defaultTheme.screens),
    extend: {
      colors: METAC_COLORS,
      boxShadow: {
        dropdown: `2px 3px 10px -3px ${METAC_COLORS.gray[500]}`,
      },
      keyframes: {
        "loading-slide": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(-100%)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "90%, 100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "loading-slide":
          "loading-slide cubic-bezier(0.3, 1, 0.7, 0) 1.7s infinite",
        spin: "spin 1s infinite",
      },
      fontFamily: {
        sans: [
          "var(--font-inter-variable)",
          "var(--font-inter)",
          ...defaultTheme.fontFamily.sans,
        ],
        serif: [
          "var(--font-source-serif-pro)",
          ...defaultTheme.fontFamily.serif,
        ],
        mono: ['"Ubuntu mono"', ...defaultTheme.fontFamily.mono],
        "league-gothic": "var(--font-league-gothic)",
      },
      strokeWidth: {
        "3": "3px",
      },
      scrollMargin: {
        nav: "70px",
      },
      zIndex: {
        "100": "100",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    // @ts-ignore
    plugin(function ({ addUtilities }) {
      addUtilities({
        /* https://github.com/tailwindlabs/tailwindcss/pull/12128 */
        ".break-anywhere": {
          "overflow-wrap": "anywhere",
        },
        /* Hide scrollbar for Chrome, Safari and Opera */
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        ".no-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
        ".fill-opacity-50": {
          "fill-opacity": "0.5",
        },
        ".list-lower-alpha": {
          "list-style-type": "lower-alpha",
        },
        ".list-lower-roman": {
          "list-style-type": "lower-roman",
        },
      });
    }),
  ],
};
export default config;
