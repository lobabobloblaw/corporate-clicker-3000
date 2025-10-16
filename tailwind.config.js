/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Discord Brand Colors
        discord: {
          blurple: '#5865F2',      // Primary Discord brand color
          green: '#57F287',         // Online/Success
          yellow: '#FEE75C',        // Idle/Warning
          fuchsia: '#EB459E',       // Accent
          red: '#ED4245',           // Error/DND
          white: '#FFFFFF',
          black: '#000000',

          // Background colors (dark theme)
          'bg-primary': '#313338',   // Main background
          'bg-secondary': '#2B2D31',  // Slightly elevated
          'bg-tertiary': '#1E1F22',   // Input backgrounds
          'bg-modal': '#111214',      // Modal/overlay background

          // Text colors
          'text-normal': '#DBDEE1',   // Primary text
          'text-muted': '#B5BAC1',    // Secondary text
          'text-link': '#00A8FC',     // Links

          // UI element colors
          'border': '#3F4147',        // Borders/dividers
          'hover': '#404249',         // Hover states
          'active': '#35373C',        // Active/pressed states
        }
      },

      // Mobile-first spacing with touch-friendly sizes
      spacing: {
        'touch': '44px',  // Minimum touch target size (44x44px)
        'touch-lg': '48px', // Larger touch target for primary actions
      },

      // Custom font sizes optimized for mobile readability
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },

      // Animation for smooth interactions
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },

      // Border radius for Discord-like UI
      borderRadius: {
        'discord': '8px',
        'discord-lg': '12px',
      }
    },
  },
  plugins: [],
}
