/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#15171A",
        surface: "#1D2024",
        border: "#2A2D31",
        "text-primary": "#F4F2ED",
        "text-secondary": "#7C8288",
        accent: "#FF5A1F",
        "accent-secondary": "#C7FF4D",
      },
      fontFamily: {
        scoreboard: ["Archivo Expanded", "Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        "stat-huge": ["8rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "stat-large": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "stat-medium": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        card: "6px",
        btn: "4px",
      },
    },
  },
  plugins: [],
};