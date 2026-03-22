import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products', '/about', '/contact'],
        disallow: ['/dashboard', '/cart', '/checkout', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
