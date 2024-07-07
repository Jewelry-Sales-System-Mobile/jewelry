/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          ".focus\\:outline-none": {
            outline: "none",
          },
        },
        ["responsive", "hover", "focus"]
      );
    },
  ],
};
