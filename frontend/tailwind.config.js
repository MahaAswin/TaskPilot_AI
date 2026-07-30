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
        background: '#14161B',
        surface: '#1B1E25',
        sidebarBg: '#1B1E25',
        darkSurface: '#1B1E25',
        darkSurfaceElevated: '#242832',
        darkBorder: 'rgba(255, 255, 255, 0.09)',
        primary: {
          DEFAULT: '#E8B45D',
          hover: '#D4A253',
        },
        secondary: {
          DEFAULT: '#57B5A8',
          hover: '#4A9F94',
        },
        accent: '#57B5A8',
        success: '#57B5A8',
        warning: '#E8B45D',
        danger: '#E2836A',
        info: '#57B5A8',
        panel: '#1B1E25',
        border: 'rgba(255, 255, 255, 0.09)',
        textPrimary: '#ECEAE3',
        textSecondary: '#C6C9D1',
        textMuted: '#868C99',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.06)',
        'soft-hover': '0 18px 45px rgba(91, 95, 239, 0.12)',
        nav: '0 10px 30px rgba(15, 23, 42, 0.04)',
        glass: '0 8px 30px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'typing': 'typing 1.4s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
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
