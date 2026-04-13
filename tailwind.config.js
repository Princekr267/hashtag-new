/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':        '#000000',
        'bg-container':   '#0a0a0a',
        'bg-hi':          '#141414',
        'bg-top':         '#1a1a1a',
        'bg-bright':      '#262626',
        primary:          '#8ff5ff',
        'primary-dim':    '#00eab7',
        secondary:        '#00fc40',
        tertiary:         '#ac89ff',
        'text-primary':   '#f9f5f8',
        'text-muted':     '#adaaad',
        'text-faint':     '#767577',
        outline:          '#767577',
        'outline-var':    '#48474a',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Manrope', 'sans-serif'],
        label:   ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        float:        'float 3.5s ease-in-out infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        marquee:         'marquee 28s linear infinite',
        'marquee-reverse': 'marqueeRev 30s linear infinite',
        scan:         'scan 6s linear infinite',
        flicker:      'cyberFlicker 4s linear infinite',
        'bounce-arrow': 'bounceArrow 1.5s ease-in-out infinite',
      },
      keyframes: {
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        floatSlow: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        marquee:    { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        marqueeRev: { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        cyberFlicker: {
          '0%,91%,95%,100%': { opacity: '1' },
          '92%':  { opacity: '0.4' },
          '93%':  { opacity: '1' },
          '94%':  { opacity: '0.6' },
        },
        bounceArrow: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(6px)' },
        },
      },
    },
  },
  plugins: [],
}
