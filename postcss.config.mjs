import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

if (typeof process !== 'undefined' && !process.env.TAILWIND_DISABLE_LIGHTNINGCSS) {
  process.env.TAILWIND_DISABLE_LIGHTNINGCSS = 'true';
}

const config = {
  plugins: {
    tailwind,
    autoprefixer
  }
};

export default config;
