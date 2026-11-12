/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: '#000000',
        obsidian: '#050608',
        pearl: '#f4f6fa',
        mist: '#9aa3b2',
        cyanGlow: '#00f0ff',
        turquoise: '#2dd4bf',
        magentaGlow: '#ec4899',
        violetGlow: '#8b5cf6',
      },
      letterSpacing: {
        editorial: '0.18em',
        ultra: '0.28em',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

