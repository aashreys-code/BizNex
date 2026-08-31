/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#b0b0b0',
          300: '#808080',
          400: '#606060',
          500: '#404040',
          600: '#2C2C2C',
          700: '#252525',
          800: '#1E1E1E',
          900: '#171717',
          950: '#141414',
        },
        moss: {
          50: '#e8fdf3',
          100: '#c5fae0',
          200: '#8ff4c1',
          300: '#5cf5c1',
          400: '#21F1A8',
          500: '#1AD692',
          600: '#14A874',
          700: '#0E8A5C',
          800: '#0A6D48',
          900: '#075238',
          950: '#022E1F',
        },
        tiffany: {
          50: '#e8fdf3',
          100: '#c5fae0',
          200: '#8ff4c1',
          300: '#5cf5c1',
          400: '#21F1A8',
          500: '#1AD692',
          600: '#14A874',
          700: '#0E8A5C',
          800: '#0A6D48',
          900: '#075238',
          950: '#022E1F',
        },
        clay: {
          50: '#F8F6F1',
          100: '#F0EDE4',
          200: '#E4E0D6',
          300: '#D4CFC3',
          400: '#B8B2A4',
          500: '#004741',
          600: '#003832',
          700: '#002924',
          800: '#001A17',
          900: '#000D0B',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
