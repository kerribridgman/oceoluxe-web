/**
 * Database queries for Purchases
 */

import { db } from './drizzle';
import { purchases, purchaseItems, dashboardProducts, NewPurchase, NewPurchaseItem } from './schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Get all purchases (admin)
 */
export async function getAllPurchases() {
  return await db
    .select({
      purchase: purchases,
      product: dashboardProducts,
    })
    .from(purchases)
    .innerJoin(dashboardProducts, eq(purchases.productId, dashboardProducts.id))
    .orderBy(desc(purchases.createdAt));
}

/**
 * Get purchase by ID with items
 */
export async function getPurchaseById(id: number) {
  const [purchase] = await db
    .select({
      purchase: purchases,
      product: dashboardProducts,
    })
    .from(purchases)
    .innerJoin(dashboardProducts, eq(purchases.productId, dashboardProducts.id))
    .where(eq(purchases.id, id))
    .limit(1);

  if (!purchase) return null;

  const items = await db
    .select({
      item: purchaseItems,
      product: dashboardProducts,
    })
    .from(purchaseItems)
    .innerJoin(dashboardProducts, eq(purchaseItems.productId, dashboardProducts.id))
    .where(eq(purchaseItems.purchaseId, id));

  return {
    ...purchase.purchase,
    mainProduct: purchase.product,
    items: items.map((i) => ({
      ...i.item,
      product: i.product,
    })),
  };
}

/**
 * Get purchases by customer email
 */
export async function getPurchasesByEmail(email: string) {
  return await db
    .select({
      purchase: purchases,
      product: dashboardProducts,
    })
    .from(purchases)
    .innerJoin(dashboardProducts, eq(purchases.productId, dashboardProducts.id))
    .where(eq(purchases.customerEmail, email))
    .orderBy(desc(purchases.createdAt));
}

/**
 * Get purchases for a specific product
 */
export async function getPurchasesByProductId(productId: number) {
  return await db
    .select()
    .from(purchases)
    .where(eq(purchases.productId, productId))
    .orderBy(desc(purchases.createdAt));
}

/**
 * Create a new purchase with items
 */
export async function createPurchase(
  purchaseData: Omit<NewPurchase, 'id' | 'createdAt' | 'updatedAt'>,
  items: Array<Omit<NewPurchaseItem, 'id' | 'purchaseId' | 'createdAt'>>
) {
  // Create the purchase
  const [purchase] = await db
    .insert(purchases)
    .values(purchaseData)
    .returning();

  // Create purchase items
  if (items.length > 0) {
    await db.insert(purchaseItems).values(
      items.map((item) => ({
        ...item,
        purchaseId: purchase.id,
      }))
    );
  }

  return purchase;
}

/**
 * Update purchase status
 */
export async function updatePurchaseStatus(
  id: number,
  status: 'pending' | 'completed' | 'failed' | 'refunded'
) {
  const [purchase] = await db
    .update(purchases)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(purchases.id, id))
    .returning();

  return purchase;
}

/**
 * Mark delivery email as sent
 */
export async function markDeliveryEmailSent(id: number) {
  const [purchase] = await db
    .update(purchases)
    .set({
      deliveryEmailSentAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(purchases.id, id))
    .returning();

  return purchase;
}

/**
 * Mark access as granted
 */
export async function markAccessGranted(id: number) {
  const [purchase] = await db
    .update(purchases)
    .set({
      accessGrantedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(purchases.id, id))
    .returning();

  return purchase;
}

/**
 * Get purchase by Stripe payment intent ID
 */
export async function getPurchaseByPaymentIntentId(paymentIntentId: string) {
  const [purchase] = await db
    .select()
    .from(purchases)
    .where(eq(purchases.stripePaymentIntentId, paymentIntentId))
    .limit(1);

  return purchase || null;
}

/**
 * Get purchase by Stripe subscription ID
 */
export async function getPurchaseBySubscriptionId(subscriptionId: string) {
  const [purchase] = await db
    .select()
    .from(purchases)
    .where(eq(purchases.stripeSubscriptionId, subscriptionId))
    .limit(1);

  return purchase || null;
}

/**
 * Update purchase with Stripe customer ID
 */
export async function updatePurchaseStripeCustomer(id: number, stripeCustomerId: string) {
  const [purchase] = await db
    .update(purchases)
    .set({
      stripeCustomerId,
      updatedAt: new Date(),
    })
    .where(eq(purchases.id, id))
    .returning();

  return purchase;
}
