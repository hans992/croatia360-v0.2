/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.css', // Add if you have styles folder
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Blue for primary actions
          dark: '#1e40af', // Darker blue
          light: '#93c5fd', // Lighter blue
        },
        secondary: {
          DEFAULT: '#059669', // Emerald green for secondary actions
          dark: '#047857',
          light: '#10b981',
        },
        accent: {
          DEFAULT: '#d946ef', // Purple for accents
          dark: '#a21caf',
          light: '#e879f9',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['Geist', 'Arial', ...defaultTheme.fontFamily.sans],
        mono: ['Geist Mono', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        card: '0 4px 10px rgba(0, 0, 0, 0.1)',
        button: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '6rem',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For content styling
    require('@tailwindcss/forms'), // For form elements
    require('@tailwindcss/aspect-ratio'), // For image containers
  ],
};

export default config;