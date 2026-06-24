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
          50: '#f0f5fa',
          100: '#dbe7f5',
          200: '#bfd5ed',
          300: '#94bbe1',
          400: '#629acf',
          500: '#3f7dbb',
          600: '#2f639c',
          700: '#27507f',
          800: '#24456a',
          900: '#213b5a',
          950: '#142337', // Deep premium navy
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
