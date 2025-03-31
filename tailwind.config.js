/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#191515',      // Dark gray/black
          darker: '#282b2b',    // Slightly lighter dark gray
          blue: '#aeecff',      // Light blue
          green: '#a5cbc8',     // Sage green
        }
      },
      fontFamily: {
        sans: ['Switzer', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 