/**
 * Database queries for Notion Products
 */

import { db } from './drizzle';
import { notionProducts } from './schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Get all published Notion products (public - for products page)
 */
export async function getPublicNotionProducts() {
  return await db
    .select()
    .from(notionProducts)
    .where(eq(notionProducts.isPublished, true))
    .orderBy(desc(notionProducts.displayOrder), desc(notionProducts.createdAt));
}

/**
 * Get a specific product by slug (public)
 */
export async function getNotionProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(notionProducts)
    .where(and(eq(notionProducts.slug, slug), eq(notionProducts.isPublished, true)))
    .limit(1);

  return product || null;
}

/**
 * Get featured products (public)
 */
export async function getFeaturedNotionProducts() {
  return await db
    .select()
    .from(notionProducts)
    .where(and(eq(notionProducts.isPublished, true), eq(notionProducts.isFeatured, true)))
    .orderBy(desc(notionProducts.displayOrder));
}

/**
 * Get all products (admin - includes unpublished)
 */
export async function getAllNotionProducts() {
  return await db
    .select()
    .from(notionProducts)
    .orderBy(desc(notionProducts.updatedAt));
}

/**
 * Get product by ID (admin)
 */
export async function getNotionProductById(id: number) {
  const [product] = await db
    .select()
    .from(notionProducts)
    .where(eq(notionProducts.id, id))
    .limit(1);

  return product || null;
}
