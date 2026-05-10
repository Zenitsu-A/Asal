/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#00E5FF',
          bright: '#00FFFF',
          dark: '#0091A1',
        },
        violet: {
          DEFAULT: '#8B5CF6',
          bright: '#A78BFA',
          dark: '#6D28D9',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
