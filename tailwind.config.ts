import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#060608',
        surface:  '#0d0d12',
        surface2: '#131318',
        border:   '#1c1c28',
        border2:  '#252535',
        green:    '#00ff88',
        red:      '#ff3355',
        yellow:   '#ffcc00',
        blue:     '#4488ff',
        muted:    '#44445a',
        muted2:   '#666680',
        wtext:    '#d8d8e8',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        pulse:   'pulse 2s infinite',
        fadeIn:  'fadeIn 0.4s ease both',
        slideIn: 'slideIn 0.3s ease both',
        flicker: 'flicker 1s infinite',
        spin:    'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
