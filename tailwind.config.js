/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sherloc-dark': '#1A1B26',
        'sherloc-dark-2': '#2A2D3A',
        'sherloc-yellow': '#FFD15B',
        'sherloc-purple': '#C778DD',
        'sherloc-text': '#F0F0F0',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'lexend': ['Lexend', 'sans-serif'],
      }
    },
  },
  plugins: [],
}