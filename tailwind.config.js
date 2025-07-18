/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          100: '#3477eb',
          200: '#6296f0',
          300: '#91b5f4',
          DEFAULT: '#3477eb',
        },
        accent: {
          100: '#ff9900',
          200: '#ff9900',
          300: '#ff9900',
          DEFAULT: '#ff9900',
        },
        background: {
          100: '#0b1b35',
          200: '#0f264a',
          300: '#14315f',
          DEFAULT: '#0b1b35',
        },
        text: {
          100: '#fbfcfe',
          200: '#e7edf9',
          300: '#d2ddf4',
          DEFAULT: '#fbfcfe',
        },
        // Shadcn UI colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient': 'gradient 6s ease infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(52, 119, 235, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(52, 119, 235, 0.8)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(52, 119, 235, 0.5)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(52, 119, 235, 0.8), 0 0 30px rgba(255, 153, 0, 0.3)' 
          },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(52, 119, 235, 0.3)',
        'glow-accent': '0 0 20px rgba(255, 153, 0, 0.3)',
      },
    },
  },
  plugins: [],
}