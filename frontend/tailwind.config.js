/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0B15', // Deep space black
          800: '#151525', // Panel background
          accent: '#6366F1', // Indigo alert
          danger: '#EF4444', // Hazardous asteroid
        }
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}