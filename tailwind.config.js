export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'sans': ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary': '#0e6ebe',
        'secondary': '#a7e66e',
        'primary-50': '#eff8ff',
        'primary-100': '#daf0ff',
        'primary-200': '#bde4ff',
        'primary-300': '#90d3ff',
        'primary-400': '#5cb9ff',
        'primary-500': '#359bff',
        'primary-600': '#1f7fff',
        'primary-700': '#0e6ebe',
        'primary-800': '#1354a3',
        'primary-900': '#164780',
        'secondary-50': '#f5fdf2',
        'secondary-100': '#e8fce2',
        'secondary-200': '#d2f7c6',
        'secondary-300': '#b3ef9c',
        'secondary-400': '#a7e66e',
        'secondary-500': '#7bd346',
        'secondary-600': '#60b030',
        'secondary-700': '#4b8a28',
        'secondary-800': '#3d6e25',
        'secondary-900': '#345c22',
      },
    },
  },
  plugins: [],
}