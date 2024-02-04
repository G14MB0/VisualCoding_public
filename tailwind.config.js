/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    screens: {
      lg: "767px", // Customize this value to set a custom breakpoint for 'lg'
      sm: "600px",
    },
    extend: {
      boxShadow: {
        custom: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
        custom2: "0px 0px 6px -2px rgba(0, 0, 0, 0.4)",
        custom2white: "0px 0px 6px -2px rgba(255, 255, 255, 0.4)",
        customwhite: "1px 0px 10px -2px rgba(255, 255, 255, 0.4)",
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        pulse2: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        pulse3: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        spin1: "spin1 2s linear infinite"
      },
      colors: {
        // Light mode
        "background-light": "#FFFFFF",
        "background-light-alt": "#F5F5F5",
        "text-light": "#333333",
        "primary-action": "#0072C6",
        "primary-action-hover": "#0082B6",
        success: "#00933B",
        warning: "#F2C811",
        error: "#D63737",

        "dark": "#212121",
        "primary-action-dark": "#4FC3F7",
        "success-dark": "#81C784",
        "warning-dark": "#FFB74D",
        "error-dark": "#E57373",
      },
    },
  },
  plugins: [
    // ...
    // require("@tailwindcss/forms"),
    // require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
