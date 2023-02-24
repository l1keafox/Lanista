/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      'neo': ['GFS Neohellenic', 'sans-serif'],
      'lux': ['Luxurious Roman', 'cursive'],
      'baby': [ 'Shantell Sans', 'cursive'],
      
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
