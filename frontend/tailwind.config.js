/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#fbb017',
        primary: '#0f172a',
        muted: '#6b7280',
        background: '#f8fafc',
      },
      fontFamily: {
        title: ['Ubuntu', 'system-ui', 'sans-serif'],
        body: ['Ubuntu', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

