import { MetadataRoute } from 'next';
import { baseUrl } from '../lib/seo/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*'
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
