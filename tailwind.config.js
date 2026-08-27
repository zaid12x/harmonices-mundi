/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'monospace', 'Courier New'],
      },
      colors: {
        space: {
          900: '#030712',
          800: '#0b0f19',
          700: '#111827',
        },
        cosmic: {
          cyan: '#00f0ff',
          magenta: '#ff0055',
          gold: '#ffb703',
          purple: '#7928ca',
        }
      }
    },
  },
  plugins: [],
}
