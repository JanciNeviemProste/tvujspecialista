import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#eef0ff',
          100: '#e1e4ff',
          200: '#c5cbff',
          300: '#9ea6fc',
          400: '#7678f7',
          500: '#4F46E5', // Main primary - Trusted Indigo
          600: '#3d35c9',
          700: '#3028a8',
          800: '#271f87',
          900: '#1e166b',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          // Refined Amber Accent
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D97706', // Main accent - Refined Amber
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cool neutral grays (slightly blue-tinted)
        neutral: {
          50: '#f8f9fb',
          100: '#f1f2f7',
          200: '#e4e6f0',
          300: '#cdd0de',
          400: '#9fa4bb',
          500: '#737898',
          600: '#565a7a',
          700: '#424663',
          800: '#2d3050',
          900: '#1a1d3a',
        },
        success: '#16a34a',
        warning: '#D97706',
        danger: '#dc2626',
        verified: '#059669',
        top: '#D97706',
        premium: '#D97706',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "mesh-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "marquee": "marquee 40s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "mesh-drift": "mesh-drift 20s ease-in-out infinite",
        "blink": "blink 2s ease-in-out infinite",
      },
      backgroundSize: {
        '200': '200% 200%',
        '300': '300% 300%',
      },
      boxShadow: {
        'premium': '0 4px 14px 0 rgba(217, 119, 6, 0.32)',
        'premium-lg': '0 10px 40px -10px rgba(217, 119, 6, 0.42)',
        'glass': '0 8px 32px 0 rgba(79, 70, 229, 0.12)',
        'indigo': '0 4px 14px 0 rgba(79, 70, 229, 0.32)',
        'indigo-lg': '0 10px 40px -10px rgba(79, 70, 229, 0.42)',
        'glow-indigo': '0 0 60px -10px rgba(79, 70, 229, 0.6)',
        'glow-amber': '0 0 60px -10px rgba(217, 119, 6, 0.5)',
        'elevation-1': '0 1px 2px 0 rgba(15, 15, 25, 0.05), 0 1px 3px -1px rgba(15, 15, 25, 0.04)',
        'elevation-2': '0 2px 4px -1px rgba(15, 15, 25, 0.06), 0 4px 8px -2px rgba(15, 15, 25, 0.05)',
        'elevation-3': '0 4px 8px -2px rgba(15, 15, 25, 0.08), 0 12px 24px -4px rgba(15, 15, 25, 0.08)',
        'elevation-4': '0 8px 16px -4px rgba(15, 15, 25, 0.1), 0 24px 48px -8px rgba(15, 15, 25, 0.1)',
        'elevation-5': '0 12px 24px -6px rgba(15, 15, 25, 0.12), 0 32px 64px -12px rgba(15, 15, 25, 0.14)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
      },
      fontSize: {
        'display-1': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-2': ['clamp(2.25rem, 6vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-3': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
