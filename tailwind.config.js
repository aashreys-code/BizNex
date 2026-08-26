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
          600: '#2a2a2a',
          700: '#1e1e1e',
          800: '#181818',
          900: '#141414',
          950: '#0e0e0e',
        },
        moss: {
          50: '#eaffec',
          100: '#c8ffd5',
          200: '#91ffab',
          300: '#4dff75',
          400: '#2BEE34',
          500: '#1fd427',
          600: '#17a81e',
          700: '#137f19',
          800: '#146518',
          900: '#125316',
          950: '#032e07',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'liquid': 'liquid 8s ease-in-out infinite',
        'liquid-fast': 'liquid 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(43, 238, 52, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(43, 238, 52, 0.4), 0 0 60px rgba(43, 238, 52, 0.1)' },
        },
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
        liquid: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(180deg, #0e0e0e 0%, #141414 50%, #0e0e0e 100%)',
        'moss-gradient': 'linear-gradient(135deg, #2BEE34 0%, #1fd427 50%, #17a81e 100%)',
      },
      boxShadow: {
        'liquid': '0 8px 32px 0 rgba(43, 238, 52, 0.15)',
        'liquid-lg': '0 16px 64px 0 rgba(43, 238, 52, 0.2)',
        'liquid-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
