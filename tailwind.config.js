/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FF4757',
        secondary: '#FF6B35',
        gold: '#FFD700',
        dark: '#0D0D1A',
        'dark-card': '#1A1A2E',
        surface: '#16213E',
        brutal: '#FF4757',
        ironic: '#A855F7',
        constructive: '#22C55E',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
