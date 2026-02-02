import { db } from './drizzle';
import { blogPosts, notionProducts, dashboardProducts } from './schema';
import { eq, desc, and, ne } from 'drizzle-orm';

/**
 * Get related blog posts for a given post.
 * Matches by industry first, falls back to most recent published posts.
 * Always excludes the current post.
 */
export async function getRelatedBlogPosts(
  currentPostId: number,
  industry: string | null,
  limit: number = 4
) {
  let posts: typeof blogPosts.$inferSelect[] = [];

  // First try matching by industry
  if (industry) {
    posts = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.isPublished, true),
          eq(blogPosts.industry, industry),
          ne(blogPosts.id, currentPostId)
        )
      )
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  }

  // Fall back to recent posts if not enough industry matches
  if (posts.length < limit) {
    const existingIds = posts.map((p) => p.id);
    const remaining = limit - posts.length;

    const fallback = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.isPublished, true),
          ne(blogPosts.id, currentPostId)
        )
      )
      .orderBy(desc(blogPosts.publishedAt))
      .limit(remaining + existingIds.length);

    const filtered = fallback
      .filter((p) => !existingIds.includes(p.id))
      .slice(0, remaining);

    posts = [...posts, ...filtered];
  }

  return posts;
}

/**
 * Get recommended products for blog post recommendations.
 * Prioritizes featured dashboard products, then featured Notion products,
 * falls back to most recent published products.
 */
export async function getRecommendedProducts(limit: number = 2) {
  // Get featured dashboard products
  const featuredDashboard = await db
    .select()
    .from(dashboardProducts)
    .where(
      and(
        eq(dashboardProducts.isPublished, true),
        eq(dashboardProducts.isFeatured, true)
      )
    )
    .orderBy(desc(dashboardProducts.displayOrder))
    .limit(limit);

  const dashboardMapped = featuredDashboard.map((p) => ({
    id: `dashboard-${p.id}`,
    title: p.name,
    description: p.shortDescription || p.description,
    coverImageUrl: p.coverImageUrl,
    price: formatDashboardPrice(p.priceInCents, p.productType),
    href: `/checkout/${p.slug}`,
  }));

  if (dashboardMapped.length >= limit) {
    return dashboardMapped.slice(0, limit);
  }

  // Fill with featured Notion products
  const remaining = limit - dashboardMapped.length;
  const featuredNotion = await db
    .select()
    .from(notionProducts)
    .where(
      and(
        eq(notionProducts.isPublished, true),
        eq(notionProducts.isFeatured, true)
      )
    )
    .orderBy(desc(notionProducts.displayOrder))
    .limit(remaining);

  const notionMapped = featuredNotion.map((p) => ({
    id: `notion-${p.id}`,
    title: p.title,
    description: p.description,
    coverImageUrl: p.coverImageUrl,
    price: p.salePrice || p.price || 'Free',
    href: `/products/${p.slug}`,
  }));

  const combined = [...dashboardMapped, ...notionMapped];

  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  // Fall back to most recent published products
  const finalRemaining = limit - combined.length;
  const existingNotionIds = featuredNotion.map((p) => p.id);
  const existingDashboardIds = featuredDashboard.map((p) => p.id);

  const recentDashboard = await db
    .select()
    .from(dashboardProducts)
    .where(eq(dashboardProducts.isPublished, true))
    .orderBy(desc(dashboardProducts.createdAt))
    .limit(finalRemaining + existingDashboardIds.length);

  const recentDashboardMapped = recentDashboard
    .filter((p) => !existingDashboardIds.includes(p.id))
    .slice(0, finalRemaining)
    .map((p) => ({
      id: `dashboard-${p.id}`,
      title: p.name,
      description: p.shortDescription || p.description,
      coverImageUrl: p.coverImageUrl,
      price: formatDashboardPrice(p.priceInCents, p.productType),
      href: `/checkout/${p.slug}`,
    }));

  const withRecent = [...combined, ...recentDashboardMapped];

  if (withRecent.length >= limit) {
    return withRecent.slice(0, limit);
  }

  // Last resort: recent Notion products
  const lastRemaining = limit - withRecent.length;
  const recentNotion = await db
    .select()
    .from(notionProducts)
    .where(eq(notionProducts.isPublished, true))
    .orderBy(desc(notionProducts.createdAt))
    .limit(lastRemaining + existingNotionIds.length);

  const recentNotionMapped = recentNotion
    .filter((p) => !existingNotionIds.includes(p.id))
    .slice(0, lastRemaining)
    .map((p) => ({
      id: `notion-${p.id}`,
      title: p.title,
      description: p.description,
      coverImageUrl: p.coverImageUrl,
      price: p.salePrice || p.price || 'Free',
      href: `/products/${p.slug}`,
    }));

  return [...withRecent, ...recentNotionMapped].slice(0, limit);
}

function formatDashboardPrice(cents: number, productType: string | null) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
  return productType === 'subscription' ? `${formatted}/mo` : formatted;
}
