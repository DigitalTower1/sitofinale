import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const isAnalyze = process.env.ANALYZE === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    optimizePackageImports: [
      'gsap',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing'
    ]
  },
  compiler: {
    styledComponents: false,
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false
  },
  images: {
    formats: ['image/avif', 'image/webp']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback ??= {};
      config.resolve.fallback.fs = false;
    }
    if (isAnalyze) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
    }
    return config;
  }
};

export default nextConfig;
