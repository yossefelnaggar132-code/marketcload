import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF9F3',
          100: '#F7EDE1',
          200: '#ECD8C1',
          300: '#DEC09E',
          400: '#CFA378',
          500: '#BA844E', // Wood Bronze Accent
          600: '#9E6735',
          700: '#7E4F26',
          800: '#5F3918',
          900: '#3D220C', // Deep Damietta Walnut
        },
        wood: {
          beech: '#E2A76F',    // خشب زان
          walnut: '#5C3A21',   // خشب جوز
          oak: '#B38B59',      // خشب أرو
          mahogany: '#4A1D13', // ماهوجني
        }
      },
      fontFamily: {
        arabic: ['var(--font-cairo)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(95, 57, 24, 0.08)',
        'card': '0 10px 30px -5px rgba(61, 34, 12, 0.06)',
      }
    },
  },
  plugins: [],
};

export default config;
