/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          active: 'var(--color-accent-active)',
          subtle: 'var(--color-accent-subtle)',
          contrast: 'var(--color-accent-contrast)',
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          hover: 'var(--color-surface-hover)',
        },
        textColor: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        borderColor: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
          hover: 'var(--color-border-hover)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        khmer: ['var(--font-khmer)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        btn: 'var(--radius-btn)',
        card: 'var(--radius-card)',
        input: 'var(--radius-input)',
        badge: 'var(--radius-badge)',
        modal: 'var(--radius-modal)',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
  safelist: [
    'animate-enter',
    'animate-leave',
    'animate-duration-1000',
    'animate-duration-700',
    'animate-duration-500',
    'animate-duration-100',
    'fade-in-10',
    'fade-out-0',
    'slide-in-from-l-8',
    'slide-in-from-r-8',
    'slide-in-from-t-12',
    'slide-in-from-t-16',
    'slide-in-from-t-20',
    'slide-in-from-b-8',
    'slide-in-from-b-12',
    'slide-in-from-b-20',
    'zoom-in-50',
    'zoom-in-75',
    'spin-in-45',
  ],
};
