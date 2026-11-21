/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        css: {
          dark: '#0d0d0d',
          panel: '#1a1a1a',
          'panel-light': '#232323',
          border: '#3a3a3a',
          'border-light': '#4a4a4a',
          orange: '#e87b1e',
          'orange-light': '#f29b3e',
          'orange-dark': '#c5651a',
          tan: '#d4a85e',
          green: '#4b9c5a',
          red: '#c43b3b',
          blue: '#3b7dd8',
        }
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
