import { MetadataRoute } from 'next';
import { db } from '@/lib/db/drizzle';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Generates sitemap.xml dynamically based on Google's standards
 * Automatically includes all published blog posts and main pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://iampatrickfarrell.com';

  // Fetch all published blog posts
  const posts = await db
    .select({
      slug: blogPosts.slug,
      updatedAt: blogPosts.updatedAt,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true));

  // Main static pages with priority and change frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Highest priority for homepage
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // High priority for services page
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9, // High priority for blog index
    },
    {
      url: `${baseUrl}/apply/coaching`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apply/entrepreneur-circle`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic blog post pages
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8, // High priority for blog content
  }));

  return [...staticPages, ...blogPages];
}
