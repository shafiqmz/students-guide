/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    extend: {
      screens: {
        'xs': '400px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        custom: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)"
      },
      fontFamily: {
        quicksand: "'Quicksand', 'sans-serif'",
      },
      fontWeight: {
        extraThing: 100,
        thin: 300,
        normal: 400,
        bold: 700,
        extraBold: 900,
      },
      colors: {
        primaryBlue: '#0077CC',
        secondaryOrange: '#FF8800',
        textColor: '#333333',
        inputColor: "#1d2129",
        disabled: '#cdcdcd',
        bgContrast: '#606266'
      },
      backgroundColor: {
        main: '#F0F2F5',
        mainHover: '#E4E6E9',
        primaryBlue: '#0077CC',
        secondaryOrange: '#FF8800',
        lightBlue: '#c5cfd7',
        lightOrange: '#fbc990',
        disabled: '#cdcdcd'
      },
      borderColor: {
        primaryBlue: '#0077CC',
        secondaryOrange: '#FF8800',
        bgContrast: '#606266',
        custom: '#dddfe2'
      },
      zIndex: {
        top: 99999999
      }
    },
  },
  plugins: [],
}
