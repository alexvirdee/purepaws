/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // or wherever your components/pages live
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-merriweather)', 'serif'],
        cursive: ['var(--font-dancing)', 'cursive'],
      },
    },
  },
  plugins: [],
};
