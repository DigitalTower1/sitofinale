import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          500: '#1cb5bd'
        },
        orange: {
          500: '#ff6b35'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui']
      }
    }
  }
};

export default config;
