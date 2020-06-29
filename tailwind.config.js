/** @type {import('tailwindcss').Config} */
module.exports = {
  // include src files (React files are in src)
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0ea5a4"
      }
    }
  },
  plugins: [require("tailwindcss-style-animate")],
};