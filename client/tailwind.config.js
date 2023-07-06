/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lobster: ["'Lobster'"],
        kablammo: ["'Kablammo'"],
      },
      colors: {
        bdark: "#222831",
        bgray: "#393E46",
        bblue: "#00ADB5",
        bwhite: "#EEEEEE",
      },
    },
  },
  plugins: [],
};
