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
        pixelifySans: ['Pixelify Sans', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        main: '#f4a127',
        secondary: '#273469',
        red: '#CC2936',
        neonGreen: '#95C623',
        neonPink: '#FF00FF',
        yellow: '#fdfd96',
      },
    },
  },
  plugins: [],
}
export default config
