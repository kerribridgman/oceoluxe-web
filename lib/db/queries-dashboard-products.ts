/**
 * Database queries for Dashboard Products (Stripe-integrated products)
 */

import { db } from './drizzle';
import { dashboardProducts, productUpsells, NewDashboardProduct } from './schema';
import { eq, desc, and, ne } from 'drizzle-orm';

/**
 * Get all published dashboard products (public - for products page)
 */
export async function getPublicDashboardProducts() {
  return await db
    .select()
    .from(dashboardProducts)
    .where(eq(dashboardProducts.isPublished, true))
    .orderBy(desc(dashboardProducts.displayOrder), desc(dashboardProducts.createdAt));
}

/**
 * Get a specific dashboard product by slug (public)
 */
export async function getDashboardProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(dashboardProducts)
    .where(and(eq(dashboardProducts.slug, slug), eq(dashboardProducts.isPublished, true)))
    .limit(1);

  return product || null;
}

/**
 * Get featured dashboard products (public)
 */
export async function getFeaturedDashboardProducts() {
  return await db
    .select()
    .from(dashboardProducts)
    .where(and(eq(dashboardProducts.isPublished, true), eq(dashboardProducts.isFeatured, true)))
    .orderBy(desc(dashboardProducts.displayOrder));
}

/**
 * Get all dashboard products (admin - includes unpublished)
 */
export async function getAllDashboardProducts() {
  return await db
    .select()
    .from(dashboardProducts)
    .orderBy(desc(dashboardProducts.updatedAt));
}

/**
 * Get dashboard product by ID (admin)
 */
export async function getDashboardProductById(id: number) {
  const [product] = await db
    .select()
    .from(dashboardProducts)
    .where(eq(dashboardProducts.id, id))
    .limit(1);

  return product || null;
}

/**
 * Create a new dashboard product
 */
export async function createDashboardProduct(data: Omit<NewDashboardProduct, 'id' | 'createdAt' | 'updatedAt'>) {
  const [product] = await db
    .insert(dashboardProducts)
    .values(data)
    .returning();

  return product;
}

/**
 * Update a dashboard product
 */
export async function updateDashboardProduct(
  id: number,
  data: Partial<Omit<NewDashboardProduct, 'id' | 'createdAt' | 'createdBy'>>
) {
  const [product] = await db
    .update(dashboardProducts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(dashboardProducts.id, id))
    .returning();

  return product;
}

/**
 * Delete a dashboard product
 */
export async function deleteDashboardProduct(id: number) {
  await db
    .delete(dashboardProducts)
    .where(eq(dashboardProducts.id, id));
}

/**
 * Update Stripe sync info for a product
 */
export async function updateProductStripeInfo(
  id: number,
  stripeData: {
    stripeProductId: string;
    stripePriceId: string;
    stripeYearlyPriceId?: string | null;
  }
) {
  const [product] = await db
    .update(dashboardProducts)
    .set({
      ...stripeData,
      stripeSyncedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(dashboardProducts.id, id))
    .returning();

  return product;
}

/**
 * Get upsells for a product
 */
export async function getProductUpsells(productId: number) {
  return await db
    .select({
      id: productUpsells.id,
      displayOrder: productUpsells.displayOrder,
      discountPercent: productUpsells.discountPercent,
      upsellProduct: dashboardProducts,
    })
    .from(productUpsells)
    .innerJoin(dashboardProducts, eq(productUpsells.upsellProductId, dashboardProducts.id))
    .where(eq(productUpsells.productId, productId))
    .orderBy(productUpsells.displayOrder);
}

/**
 * Add an upsell to a product
 */
export async function addProductUpsell(
  productId: number,
  upsellProductId: number,
  displayOrder?: number,
  discountPercent?: number
) {
  const [upsell] = await db
    .insert(productUpsells)
    .values({
      productId,
      upsellProductId,
      displayOrder: displayOrder ?? 0,
      discountPercent: discountPercent ?? null,
    })
    .returning();

  return upsell;
}

/**
 * Remove an upsell from a product
 */
export async function removeProductUpsell(productId: number, upsellProductId: number) {
  await db
    .delete(productUpsells)
    .where(
      and(
        eq(productUpsells.productId, productId),
        eq(productUpsells.upsellProductId, upsellProductId)
      )
    );
}

/**
 * Get all products that can be used as upsells (published products, excluding a specific product)
 */
export async function getAvailableUpsellProducts(excludeProductId?: number) {
  if (excludeProductId) {
    return await db
      .select()
      .from(dashboardProducts)
      .where(
        and(
          eq(dashboardProducts.isPublished, true),
          ne(dashboardProducts.id, excludeProductId)
        )
      )
      .orderBy(dashboardProducts.name);
  }

  return await db
    .select()
    .from(dashboardProducts)
    .where(eq(dashboardProducts.isPublished, true))
    .orderBy(dashboardProducts.name);
}
