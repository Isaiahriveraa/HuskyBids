/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // UW Official Color Palette
      colors: {
        // Primary UW Colors
        'uw-purple': {
          DEFAULT: '#4B2E83',
          50: '#F5F3F9',
          100: '#E5DDF5',
          200: '#D1C4E9',
          300: '#B39DDB',
          400: '#9575CD',
          500: '#4B2E83',
          600: '#3D2569',
          700: '#2E1A47',
          800: '#1F1230',
          900: '#100919',
        },
        'uw-gold': {
          DEFAULT: '#E8D21D',
          50: '#FFFEF5',
          100: '#FFFAE6',
          200: '#FFF5CC',
          300: '#FFEC99',
          400: '#F5E066',
          500: '#E8D21D',
          600: '#D4BE0A',
          700: '#B7A50A',
          800: '#8C7F08',
          900: '#615805',
        },
        'uw-metallic-gold': '#B7A57A',
        
        // Supporting Colors
        'uw-dark': '#1F2937',
        'uw-light': '#F7F7F7',
        
        // Status Colors
        'success': {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        'error': {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        'warning': {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        'info': {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      
      // Spacing & Layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // 3D Perspective for card flips
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      
      // Border Radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Box Shadow
      boxShadow: {
        'uw': '0 4px 6px -1px rgba(75, 46, 131, 0.1), 0 2px 4px -1px rgba(75, 46, 131, 0.06)',
        'uw-lg': '0 10px 15px -3px rgba(75, 46, 131, 0.1), 0 4px 6px -2px rgba(75, 46, 131, 0.05)',
        'uw-xl': '0 20px 25px -5px rgba(75, 46, 131, 0.1), 0 10px 10px -5px rgba(75, 46, 131, 0.04)',
        'gold': '0 4px 6px -1px rgba(232, 210, 29, 0.2), 0 2px 4px -1px rgba(232, 210, 29, 0.1)',
        'gold-lg': '0 10px 15px -3px rgba(232, 210, 29, 0.2), 0 4px 6px -2px rgba(232, 210, 29, 0.1)',
        'inner-uw': 'inset 0 2px 4px 0 rgba(75, 46, 131, 0.06)',
      },
      
      // Animations
      animation: {
        'bounce-slow': 'bounce-slow 2s infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'confetti': 'confetti 1s ease-out forwards',
        'letter-chase': 'letter-chase 2.7s ease-in-out infinite',
      },
      
      // Keyframes
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in-right': {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slide-in-left': {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'confetti': {
          '0%': {
            transform: 'translateY(0) rotateZ(0deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(1000px) rotateZ(720deg)',
            opacity: '0',
          },
        },
        'letter-chase': {
          '0%, 15%': {
            transform: 'scale(1)',
            opacity: '0.4',
          },
          '7.5%': {
            transform: 'scale(1.15)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0.4',
          },
        },
      },
      
      // Transitions
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [],
}