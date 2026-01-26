/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
      },
      colors: {
        parchment: {
          DEFAULT: '#F7F3E9',
          dark: '#EDE6D6',
        },
        sepia: {
          DEFAULT: '#5C4033',
          light: '#8B7355',
        },
        brass: {
          DEFAULT: '#C9A959',
          light: '#E5D4A1',
        },
        burgundy: {
          DEFAULT: '#722F37',
          light: '#A64D54',
        },
        ink: {
          DEFAULT: '#2C1810',
          light: '#4A3728',
        },
        ancient: {
          DEFAULT: '#D4A574',
          muted: '#E8D5C4',
        },
        revolutionary: {
          DEFAULT: '#4A6FA5',
          muted: '#B8C9DC',
        },
      },
      boxShadow: {
        'antiquarian': '0 1px 3px rgba(44, 24, 16, 0.08), 0 4px 12px rgba(44, 24, 16, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'antiquarian-hover': '0 4px 8px rgba(44, 24, 16, 0.12), 0 12px 32px rgba(44, 24, 16, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'spin-slow': 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
