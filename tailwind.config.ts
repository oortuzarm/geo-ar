import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      animation: {
        'fade-in':      'fadeIn 0.2s ease-in-out',
        'slide-up':     'slideUp 0.3s ease-out',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sheet-up':     'sheetUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        'locked-pulse': 'lockedPulse 2.8s ease-in-out infinite',
        'locked-shake': 'lockedShake 0.4s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sheetUp: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        lockedPulse: {
          '0%, 60%, 100%': { transform: 'scale(1)' },
          '30%':           { transform: 'scale(1.02)' },
        },
        lockedShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%':      { transform: 'translateX(-5px)' },
          '30%':      { transform: 'translateX(5px)' },
          '45%':      { transform: 'translateX(-4px)' },
          '60%':      { transform: 'translateX(4px)' },
          '75%':      { transform: 'translateX(-2px)' },
          '90%':      { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
