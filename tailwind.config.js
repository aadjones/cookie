/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8',
      },
      keyframes: {
        'quantum-flicker': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0.7', transform: 'scale(0.95)' },
        },
      },
      animation: {
        'quantum-flicker': 'quantum-flicker 0.5s infinite alternate',
      },
    },
  },
  plugins: [],
};
