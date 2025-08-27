import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
} satisfies Config
