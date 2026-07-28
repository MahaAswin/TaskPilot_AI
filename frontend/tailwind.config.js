/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // TaskPilot is dark mode first, we will force the class 'dark' on html
  theme: {
    extend: {
      colors: {
        background: '#09090b', // Deep zinc/black
        surface: 'rgba(18, 18, 22, 0.7)', // Semi-transparent black/zinc
        primary: {
          DEFAULT: '#6366f1', // Indigo
          hover: '#4f46e5',
        },
        secondary: {
          DEFAULT: '#d946ef', // Fuchsia
          hover: '#c084fc',
        },
        accent: '#14b8a6', // Teal
        panel: 'rgba(24, 24, 27, 0.65)',
        border: 'rgba(255, 255, 255, 0.08)',
        textPrimary: '#f4f4f5', // Zinc 100
        textSecondary: '#a1a1aa', // Zinc 400
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px rgba(99, 102, 241, 0.15)',
        glowFuchsia: '0 0 20px rgba(217, 70, 239, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'typing': 'typing 1.4s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typing: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
