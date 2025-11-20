import { MetadataRoute } from 'next';

/**
 * Generates robots.txt dynamically based on Google's standards
 * Follows SEO best practices for crawling and indexing
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/', // Disallow admin dashboard
          '/api/', // Disallow API routes
          '/sign-in', // Disallow auth pages
          '/sign-up',
          '/_next/', // Disallow Next.js internal files
          '/private/', // Disallow any private directories
        ],
      },
      {
        // Special rules for Google bots
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/sign-in',
          '/sign-up',
        ],
      },
      {
        // Rules for Googlebot Image
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
