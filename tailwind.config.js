const path = require('path');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", path.resolve(__dirname, './node_modules/litepie-datepicker/**/*.js')],
  mode: 'jit',
  theme: {
    fontFamily: {
      'sans': ["Montserrat"]
    },

    extend: {
      colors: {
        blue: "#1b63ff",
        lightblue: "#399cff",
        darkblue: "#061638",
        grayblue: "#558FFF",
        lightgray: "#ebf5ff",
        gray: "#eaeef3",
        darkgray: "#94a6c0",
        yellow: "#ffc72f",
        orange: "#f14407",
        green: "#10c3ab",
        'litepie-primary': "red", // color system for light mode
        'litepie-secondary': "green" // color system for dark mode
      },
      borderWidth: {
        '1': '1px'
      },
      borderRadius: {
        DEFAULT: '3px'
      },
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        '7/7': '100%',
        '100': '100px',
        '70': '70px',
        'menu': '225px'
      },
      padding: {
        '70': '70px'
      },
      margin: {
        '80': '80px',
      },
      fontSize: {
        'xs': ['12px']
      },
      screens: {
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1366px',
      },

    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      display: ["group-hover"],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
