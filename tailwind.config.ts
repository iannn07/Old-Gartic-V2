import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ['Chakra Petch', 'sans-serif'],
        heading: ['Bungee Spice', 'cursive'],
        honk: ['Honk', 'cursive'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        main: '#f4a127',
        secondary: '#3D52D5',
        red: '#CC2936',
      },
    },
  },
  plugins: [],
}
export default config
