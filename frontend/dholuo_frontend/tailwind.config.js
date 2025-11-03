/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1C6758',
        accent: '#3D8361',
        mint: '#F2F7F5'
      }
    },
  },
  plugins: [],
}
