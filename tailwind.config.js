/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1b2e',
        'dark-card': '#252740',
        'dark-border': '#3d3f5c',
        'accent-purple': '#6366f1',
        'accent-purple-dark': '#4f46e5',
      },
    },
  },
  plugins: [],
}
