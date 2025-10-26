import type { MetadataRoute } from 'next';

const routes = ['', '/portfolio/neon-skyscraper', '/portfolio/aurora-gateway', '/portfolio/cobalt-horizon'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://example.com';
  const now = new Date().toISOString();
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7
  }));
}
