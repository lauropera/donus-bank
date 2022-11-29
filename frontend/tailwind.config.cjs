/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['.index.html', './src/**/*.{jsx,js}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Open Sans', 'serif'],
      },
    },
  },
  plugins: [],
};
