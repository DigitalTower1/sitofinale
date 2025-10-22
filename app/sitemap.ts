import { MetadataRoute } from 'next';
import { baseUrl } from '../lib/seo/metadata';
import { caseStudies } from '../content/case-studies';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/services', '/case-studies', '/about', '/contact'];
  const now = new Date();
  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.7
    })),
    ...caseStudies.map((study) => ({
      url: `${baseUrl}/case-studies/${study.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  ];
}
