/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dmart: {
          green: '#008744',
          'green-dark': '#006d36',
          'green-light': '#e8f5e9',
          yellow: '#f39c12',
          red: '#d9534f',
          blue: '#0275d8',
          bg: '#f8fafc',
          card: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
