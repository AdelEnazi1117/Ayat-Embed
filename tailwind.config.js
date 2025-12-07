/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom Navy/Dark theme colors
        navy: {
          50: "#e7e9ec",
          100: "#c3c7ce",
          200: "#9ba3af",
          300: "#737e90",
          400: "#556279",
          500: "#374662",
          600: "#313f5a",
          700: "#283550",
          800: "#1c2331", // Primary dark background
          900: "#151b26",
          950: "#0d1117",
        },
        accent: {
          orange: "#f97316",
          gold: "#f59e0b",
          emerald: "#10b981",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        kitab: ["Kitab", "serif"],
        arabic: ["IBM Plex Sans Arabic", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-once": "pulse 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
