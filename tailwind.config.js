/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arpran: {
          blue: "#0A4E9B",
          darkblue: "#042B59",
          gold: "#C5A059",
          charcoal: "#14161f",
          sapphire: "#0B1528",
          surface: "#0E1A32",
          card: "#101F3B"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif']
      },
      aspectRatio: {
        '16/10': '16 / 10',
      }
    },
  },
  plugins: [],
}

