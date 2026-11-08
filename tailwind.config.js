/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF6EF',
        ink: '#1C2321',
        leaf: { DEFAULT: '#166534', dark: '#14532D', light: '#DCFCE7' },
        sand: '#EFE7D8',
      },
    },
  },
  plugins: [],
}
