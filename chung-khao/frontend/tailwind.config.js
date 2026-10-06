/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          900: '#3D2314',
          800: '#5C3A21',
          700: '#6F4E37',
          600: '#8B5A2B',
          500: '#A67C52',
          100: '#F4ECE4',
          50: '#FAF6F0',
        },
        forest: {
          800: '#153A20',
          700: '#1E4D2B',
          600: '#2E7D32',
          100: '#E8F5E9',
        },
        gold: {
          600: '#B8860B',
          500: '#D4AF37',
          100: '#FFF9E6',
        }
      }
    },
  },
  plugins: [],
}
