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
        'primary': '#3b82f6',
        'secondary': '#60a5fa',
        'primary-50': '#eff6ff',
        'primary-100': '#dbeafe',
        'primary-200': '#bfdbfe',
        'primary-300': '#93c5fd',
        'primary-400': '#60a5fa',
        'primary-500': '#3b82f6',
        'primary-600': '#2563eb',
        'primary-700': '#1d4ed8',
        'primary-800': '#1e40af',
        'primary-900': '#1e3a8a',
        'secondary-50': '#eff6ff',
        'secondary-100': '#dbeafe',
        'secondary-200': '#bfdbfe',
        'secondary-300': '#93c5fd',
        'secondary-400': '#60a5fa',
        'secondary-500': '#3b82f6',
        'secondary-600': '#2563eb',
        'secondary-700': '#1d4ed8',
        'secondary-800': '#1e40af',
        'secondary-900': '#1e3a8a',
      },
    },
  },
  plugins: [],
}