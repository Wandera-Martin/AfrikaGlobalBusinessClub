/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2744',
          light: '#243460',
        },
        teal: {
          DEFAULT: '#0f9b82',
          light: '#13c4a3',
        },
        orange: {
          DEFAULT: '#e8521a',
          light: '#ff6b35',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'grad': 'linear-gradient(135deg, #1a6bab 0%, #0f9b82 100%)',
        'grad-hero': 'linear-gradient(135deg, #1a4b8a 0%, #0d8870 50%, #0ea882 100%)',
      },
      boxShadow: {
        'card': '0 32px 80px rgba(0,0,0,0.25)',
        'hero': '0 20px 60px rgba(0,0,0,0.15)',
      },
      keyframes: {
        featureFloatIn: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'feature-in': 'featureFloatIn 0.6s ease both',
        'spin-fast':  'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}
