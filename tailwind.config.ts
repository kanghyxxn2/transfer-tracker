import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        foreground: '#fafafa',
        surface: {
          DEFAULT: '#111113',
          hover: '#17171a',
          border: '#27272a',
        },
        accent: {
          DEFAULT: '#f97316', // orange-500
          hot: '#ef4444', // red-500
          warm: '#f59e0b', // amber-500
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        'flame-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.85' },
        },
      },
      animation: {
        'flame-pulse': 'flame-pulse 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
