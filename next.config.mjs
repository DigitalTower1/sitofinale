/** @type {import('next').NextConfig} */
if (typeof process !== 'undefined') {
  if (!process.env.TAILWIND_DISABLE_LIGHTNINGCSS) {
    process.env.TAILWIND_DISABLE_LIGHTNINGCSS = 'true';
  }
  if (!process.env.NEXT_DISABLE_TURBOPACK) {
    process.env.NEXT_DISABLE_TURBOPACK = '1';
  }
}

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  cacheComponents: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
