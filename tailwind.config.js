/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          darkBg: '#090d16',
          darkSecondary: '#0f172a',
          darkBorder: 'rgba(30, 41, 59, 0.8)',
          lightBg: '#f8fafc',
          lightSecondary: '#ffffff',
          lightBorder: 'rgba(226, 232, 240, 0.8)',
          accentPrimary: '#6366f1', // indigo-500
          accentSecondary: '#7c3aed', // violet-600
          teal: '#2dd4bf', // teal-400
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #6366f1, #7c3aed)',
        'brand-gradient-light': 'linear-gradient(to right, #4f46e5, #6d28d9)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-delay': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
