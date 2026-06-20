/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0E4D92",
        accent: "#F59E0B",
        card: "#1A1A2E",
        cusGreen: {
          DEFAULT: "#51AE9D",
          50: "#F0F8F7",
          100: "#D7EEEA",
          200: "#BEE4DD",
          300: "#A5DAD0",
          400: "#7FC4B8",
          500: "#51AE9D",
          600: "#46988A",
          700: "#3A7F73",
          800: "#2F665C",
          900: "#234D45",
        },
        darkTeal: "#114B5F",
        teal: "#028090",
        aquamarine: "#73FBD3",
        midnightViolet: "#270722",
        mintLeaf: "#21D19F",
      },
      fontFamily: {
        sans: ["Rubik_400Regular"],
        medium: ["Rubik_500Medium"],
        bold: ["Rubik_700Bold"],
      },
    },
  },
  plugins: [],
};
