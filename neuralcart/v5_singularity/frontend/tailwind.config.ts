import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C6FFF',
          foreground: '#FFFFFF'
        },
        success: '#22c55e',
        warning: '#facc15'
      }
    }
  },
  plugins: []
};

export default config;

