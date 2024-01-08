/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    screens: {
      lg: "800px", // Customize this value to set a custom breakpoint for 'lg'
      sm: "600px",
    },
    extend: {
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

        dark: {
          "background-dark": "#212121",
          "primary-action-dark": "#4FC3F7",
          "success-dark": "#81C784",
          "warning-dark": "#FFB74D",
          "error-dark": "#E57373",
        },
      },
    },
  },
  plugins: [
    // ...
    // require("@tailwindcss/forms"),
    // require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
