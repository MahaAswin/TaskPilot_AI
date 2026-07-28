/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Keep support but we default to light theme
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC', // Slate 50 (Apple/Stripe Light Background)
        surface: '#FFFFFF', // White
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          hover: '#4338CA',
        },
        secondary: {
          DEFAULT: '#7C3AED', // Purple 600
          hover: '#6D28D9',
        },
        accent: '#06B6D4', // Cyan 500
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        panel: '#FFFFFF',
        border: '#E2E8F0', // Slate 200
        textPrimary: '#0F172A', // Slate 900
        textSecondary: '#64748B', // Slate 500
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 30px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px rgba(79, 70, 229, 0.12)',
        soft: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 10px -1px rgba(15, 23, 42, 0.03)',
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
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
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
