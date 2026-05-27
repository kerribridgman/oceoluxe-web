import { MetadataRoute } from 'next';
import { db } from '@/lib/db/drizzle';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPublicNotionProducts } from '@/lib/db/queries-notion-products';
import { getPublicDashboardProducts } from '@/lib/db/queries-dashboard-products';

// Make sitemap dynamic to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

/**
 * Generates sitemap.xml dynamically based on Google's standards
 * Automatically includes all published blog posts, products, and main pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

  // Fetch all published blog posts with error handling
  let posts: Array<{ slug: string; updatedAt: Date; publishedAt: Date | null }> = [];

  try {
    posts = await db
      .select({
        slug: blogPosts.slug,
        updatedAt: blogPosts.updatedAt,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Fetch all published products
  let notionProducts: Array<{ slug: string }> = [];
  let dashboardProducts: Array<{ slug: string }> = [];

  try {
    [notionProducts, dashboardProducts] = await Promise.all([
      getPublicNotionProducts(),
      getPublicDashboardProducts(),
    ]);
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Main static pages with priority and change frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work-with-oceo-luxe`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/operational-partnership`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/strategic-operational-alignment`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/studio-systems`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/studio-systems/join`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic blog post pages
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic product pages
  const productSlugs = new Set<string>();
  const productPages: MetadataRoute.Sitemap = [];

  for (const product of dashboardProducts) {
    if (!productSlugs.has(product.slug)) {
      productSlugs.add(product.slug);
      productPages.push({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  for (const product of notionProducts) {
    if (!productSlugs.has(product.slug)) {
      productSlugs.add(product.slug);
      productPages.push({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...blogPages, ...productPages];
}
