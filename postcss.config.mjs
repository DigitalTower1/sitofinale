if (typeof process !== 'undefined' && !process.env.TAILWIND_DISABLE_LIGHTNINGCSS) {
  process.env.TAILWIND_DISABLE_LIGHTNINGCSS = '1';
}

const [{ default: tailwindcss }, { default: autoprefixer }] = await Promise.all([
  import('@tailwindcss/postcss'),
  import('autoprefixer')
]);

const config = {
  plugins: [tailwindcss(), autoprefixer()]
};

export default config;
