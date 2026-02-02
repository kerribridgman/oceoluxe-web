import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { blogPosts, notionProducts, dashboardProducts } from '@/lib/db/schema';
import { and, eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const pattern = `%${q}%`;

  const [blogResults, notionResults, dashboardResults] = await Promise.all([
    db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        coverImageUrl: blogPosts.coverImageUrl,
      })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.isPublished, true),
          or(
            ilike(blogPosts.title, pattern),
            ilike(blogPosts.excerpt, pattern)
          )
        )
      )
      .limit(5),
    db
      .select({
        id: notionProducts.id,
        title: notionProducts.title,
        slug: notionProducts.slug,
        description: notionProducts.description,
        coverImageUrl: notionProducts.coverImageUrl,
      })
      .from(notionProducts)
      .where(
        and(
          eq(notionProducts.isPublished, true),
          or(
            ilike(notionProducts.title, pattern),
            ilike(notionProducts.description, pattern)
          )
        )
      )
      .limit(5),
    db
      .select({
        id: dashboardProducts.id,
        name: dashboardProducts.name,
        slug: dashboardProducts.slug,
        description: dashboardProducts.shortDescription,
        coverImageUrl: dashboardProducts.coverImageUrl,
      })
      .from(dashboardProducts)
      .where(
        and(
          eq(dashboardProducts.isPublished, true),
          or(
            ilike(dashboardProducts.name, pattern),
            ilike(dashboardProducts.shortDescription, pattern)
          )
        )
      )
      .limit(5),
  ]);

  const results = [
    ...blogResults.map((post) => ({
      type: 'blog' as const,
      title: post.title,
      description: post.excerpt,
      href: `/blog/${post.slug}`,
      coverImageUrl: post.coverImageUrl,
    })),
    ...notionResults.map((product) => ({
      type: 'product' as const,
      title: product.title,
      description: product.description,
      href: `/products/${product.slug}`,
      coverImageUrl: product.coverImageUrl,
    })),
    ...dashboardResults.map((product) => ({
      type: 'product' as const,
      title: product.name,
      description: product.description,
      href: `/products/${product.slug}`,
      coverImageUrl: product.coverImageUrl,
    })),
  ];

  return NextResponse.json({ results });
}
