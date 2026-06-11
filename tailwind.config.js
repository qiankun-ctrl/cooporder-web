/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#010102',
        'surface-1': '#0f1011',
        'surface-2': '#141516',
        'surface-3': '#18191a',
        'surface-4': '#191a1b',
        'border-default': '#23252a',
        'border-strong': '#34343a',
        'border-tertiary': '#3e3e44',
        ink: '#f7f8f8',
        'ink-muted': '#d0d6e0',
        'ink-subtle': '#8a8f98',
        'ink-tertiary': '#62666d',
        accent: '#5e6ad2',
        'accent-hover': '#6b77d9',
        'accent-muted': 'rgba(94, 106, 210, 0.2)',
        'status-draft': '#62666d',
        'status-pending': '#d9a23e',
        'status-inprogress': '#5e6ad2',
        'status-acceptance': '#e06c45',
        'status-completed': '#27a644',
        'status-risk': '#e06c45',
        'status-success': '#27a644',
        danger: '#e06c45',
        'danger-bg': 'rgba(224, 108, 69, 0.1)',
        overlay: 'rgba(1, 1, 2, 0.72)',
        scrim: 'rgba(1, 1, 2, 0.48)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
        'pill': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
