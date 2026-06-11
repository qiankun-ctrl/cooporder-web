import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Canvas & Surfaces — warm paper-like light theme
        canvas: '#faf8f5',
        surface: {
          1: '#ffffff',
          2: '#f5f0e8',
          3: '#ede8de',
        },
        // Borders
        border: {
          default: '#e5e0d6',
          strong: '#d5cfc4',
        },
        // Text hierarchy
        ink: {
          DEFAULT: '#1a1a1a',
          muted: '#5a5a5a',
          subtle: '#8a8a8a',
          tertiary: '#a0a0a0',
        },
        // Accent (amber gold — slightly deeper for light backgrounds)
        accent: {
          DEFAULT: '#c4850f',
          hover: '#d69a1f',
          muted: 'rgba(196, 133, 15, 0.12)',
        },
        // Semantic status colors
        status: {
          draft: '#6b7280',
          pending: '#d97706',
          inprogress: '#2563eb',
          acceptance: '#dc2626',
          completed: '#16a34a',
          risk: '#dc2626',
          success: '#16a34a',
          warning: '#dc2626',
        },
        // Danger
        danger: {
          DEFAULT: '#dc2626',
          bg: 'rgba(220, 38, 38, 0.08)',
        },
      },
      fontFamily: {
        sans: [
          'Space Grotesk',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        display: [
          '32px',
          { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.03em' },
        ],
        'heading-1': [
          '24px',
          { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.02em' },
        ],
        'heading-2': [
          '18px',
          { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' },
        ],
        'heading-3': [
          '15px',
          { lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.01em' },
        ],
        body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-medium': [
          '14px',
          { lineHeight: '1.5', fontWeight: '500' },
        ],
        caption: ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        'caption-medium': [
          '13px',
          { lineHeight: '1.4', fontWeight: '500' },
        ],
        tiny: [
          '12px',
          { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.01em' },
        ],
      },
      borderRadius: {
        card: '12px',
        button: '8px',
        input: '8px',
        pill: '9999px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        fast: '100ms',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-down': 'slideDown 150ms ease-out',
        'fade-in-up': 'fadeInUp 600ms ease-out forwards',
        'scale-in': 'scaleIn 500ms ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
