import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C6FFF',
          foreground: '#FFFFFF'
        }
      }
    }
  },
  plugins: []
};

export default config;

