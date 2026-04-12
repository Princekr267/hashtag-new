/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        background: '#080808',
        surface: 'rgba(255, 255, 255, 0.03)',
        primary: '#C8FF47',
        secondary: '#7B61FF',
        text: '#F0EDE6',
        muted: '#8c8c9e',
        border: 'rgba(255, 255, 255, 0.08)',
      },
      borderRadius: {
        'lg': '24px',
        'md': '16px',
        'sm': '12px',
        'xs': '8px',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { opacity: '0.6' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
