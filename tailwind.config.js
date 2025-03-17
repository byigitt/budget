/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d9dde5",
          300: "#b9c1d0",
          400: "#939eb5",
          500: "#73829c",
          600: "#5a6882",
          700: "#48556b",
          800: "#3d4a5c",
          900: "#364050",
          950: "#222834",
        },
        expense: "#e53e3e",
        income: "#38a169",
        savings: "#4299e1",
        neutral: "#64748b",
        background: {
          light: "#f8f9fa",
          dark: "#1a1d23",
        },
        card: {
          light: "#ffffff",
          dark: "#242731",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.625rem",
        "2xl": "0.75rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.1)",
        cardHover:
          "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)",
        subtle: "0 1px 2px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
