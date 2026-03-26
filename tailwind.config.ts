
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        brandBlue: {
          DEFAULT: "var(--blue-500)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
          900: "var(--blue-900)",
        },
        brandGreen: {
          DEFAULT: "var(--green-500)",
          100: "var(--green-100)",
          200: "var(--green-200)",
          300: "var(--green-300)",
          400: "var(--green-400)",
          500: "var(--green-500)",
          600: "var(--green-600)",
          700: "var(--green-700)",
          800: "var(--green-800)",
          900: "var(--green-900)",
        },
        systemWeb: {
          red: "var(--system-red)",
          orange: "var(--system-orange)",
          green: "var(--system-green)",
          blue: "var(--system-blue)",
        },
      },

      fontFamily: {
        mitr: ['"Mitr"', "sans-serif"],
      },

      // ✅ animation ต้องอยู่ใน extend
      keyframes: {
        flowx: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        flowy: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },

      animation: {
        flowx: "flowx 2s linear infinite",
        flowy: "flowy 2s linear infinite",
      },
    },
  },
  plugins: [],
};
