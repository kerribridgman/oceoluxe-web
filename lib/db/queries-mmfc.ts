/**
 * Database queries for Make Money from Coding API integration
 */

import { db } from './drizzle';
import { mmfcApiKeys, mmfcProducts } from './schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY_RAW = process.env.MMFC_ENCRYPTION_KEY || process.env.AUTH_SECRET;

if (!ENCRYPTION_KEY_RAW) {
  throw new Error('MMFC_ENCRYPTION_KEY or AUTH_SECRET environment variable must be set');
}

if (ENCRYPTION_KEY_RAW.length < 32) {
  throw new Error('Encryption key must be at least 32 characters long');
}

const ENCRYPTION_KEY: string = ENCRYPTION_KEY_RAW;
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypt API key for storage
 */
function encryptApiKey(apiKey: string): string {
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32).padEnd(32, '0'));
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt API key from storage
 */
function decryptApiKey(encryptedKey: string): string {
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32).padEnd(32, '0'));
  const parts = encryptedKey.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Create a new MMFC API key
 */
export async function createMmfcApiKey(
  userId: number,
  name: string,
  apiKey: string,
  baseUrl?: string,
  autoSync?: boolean,
  syncFrequency?: 'daily' | 'weekly' | 'manual'
) {
  const encryptedKey = encryptApiKey(apiKey);

  const [newKey] = await db
    .insert(mmfcApiKeys)
    .values({
      userId,
      name,
      apiKey: encryptedKey,
      baseUrl: baseUrl || 'https://makemoneyfromcoding.com',
      autoSync: autoSync || false,
      syncFrequency: syncFrequency || 'daily',
      isActive: true,
    })
    .returning();

  return newKey;
}

/**
 * Get all MMFC API keys for a user
 */
export async function getUserMmfcApiKeys(userId: number) {
  return await db
    .select()
    .from(mmfcApiKeys)
    .where(eq(mmfcApiKeys.userId, userId))
    .orderBy(desc(mmfcApiKeys.createdAt));
}

/**
 * Get a specific MMFC API key
 */
export async function getMmfcApiKeyById(id: number, userId: number) {
  const [key] = await db
    .select()
    .from(mmfcApiKeys)
    .where(and(eq(mmfcApiKeys.id, id), eq(mmfcApiKeys.userId, userId)))
    .limit(1);

  return key || null;
}

/**
 * Get decrypted API key for making API calls
 */
export async function getDecryptedMmfcApiKey(id: number, userId: number): Promise<string | null> {
  const key = await getMmfcApiKeyById(id, userId);
  if (!key) return null;
  return decryptApiKey(key.apiKey);
}

/**
 * Update MMFC API key
 */
export async function updateMmfcApiKey(
  id: number,
  userId: number,
  data: {
    name?: string;
    apiKey?: string;
    baseUrl?: string;
    autoSync?: boolean;
    syncFrequency?: 'daily' | 'weekly' | 'manual';
    isActive?: boolean;
  }
) {
  const updateData: any = { ...data, updatedAt: new Date() };

  // Encrypt API key if being updated
  if (data.apiKey) {
    updateData.apiKey = encryptApiKey(data.apiKey);
  }

  const [updated] = await db
    .update(mmfcApiKeys)
    .set(updateData)
    .where(and(eq(mmfcApiKeys.id, id), eq(mmfcApiKeys.userId, userId)))
    .returning();

  return updated || null;
}

/**
 * Update sync status for API key
 */
export async function updateSyncStatus(
  id: number,
  status: 'success' | 'error',
  errorMessage?: string
) {
  const [updated] = await db
    .update(mmfcApiKeys)
    .set({
      lastSyncAt: new Date(),
      lastSyncStatus: status,
      lastSyncError: errorMessage || null,
      updatedAt: new Date(),
    })
    .where(eq(mmfcApiKeys.id, id))
    .returning();

  return updated || null;
}

/**
 * Delete MMFC API key (and all associated products)
 */
export async function deleteMmfcApiKey(id: number, userId: number) {
  // First delete all products associated with this key
  await db.delete(mmfcProducts).where(eq(mmfcProducts.apiKeyId, id));

  // Then delete the key
  const [deleted] = await db
    .delete(mmfcApiKeys)
    .where(and(eq(mmfcApiKeys.id, id), eq(mmfcApiKeys.userId, userId)))
    .returning();

  return deleted || null;
}

/**
 * Upsert products from API sync
 */
export async function upsertMmfcProducts(
  apiKeyId: number,
  products: Array<{
    externalId: number;
    title: string;
    slug: string;
    description?: string;
    pricingType?: string;
    price?: string;
    salePrice?: string;
    deliveryType?: string;
    coverImage?: string;
    featuredImageUrl?: string;
    featuredImageAlt?: string;
    images?: any;
    videoUrl?: string;
    hasFiles?: boolean;
    fileCount?: number;
    hasRepository?: boolean;
    checkoutUrl?: string;
  }>
) {
  const results = [];

  for (const product of products) {
    // Check if product already exists
    const [existing] = await db
      .select()
      .from(mmfcProducts)
      .where(
        and(
          eq(mmfcProducts.apiKeyId, apiKeyId),
          eq(mmfcProducts.externalId, product.externalId)
        )
      )
      .limit(1);

    if (existing) {
      // Update existing product
      const [updated] = await db
        .update(mmfcProducts)
        .set({
          title: product.title,
          slug: product.slug,
          description: product.description,
          pricingType: product.pricingType,
          price: product.price,
          salePrice: product.salePrice,
          deliveryType: product.deliveryType,
          coverImage: product.coverImage,
          featuredImageUrl: product.featuredImageUrl,
          featuredImageAlt: product.featuredImageAlt,
          images: product.images,
          videoUrl: product.videoUrl,
          hasFiles: product.hasFiles || false,
          fileCount: product.fileCount || 0,
          hasRepository: product.hasRepository || false,
          checkoutUrl: product.checkoutUrl,
          syncedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(mmfcProducts.id, existing.id))
        .returning();
      results.push(updated);
    } else {
      // Insert new product
      const [inserted] = await db
        .insert(mmfcProducts)
        .values({
          apiKeyId,
          externalId: product.externalId,
          title: product.title,
          slug: product.slug,
          description: product.description,
          pricingType: product.pricingType,
          price: product.price,
          salePrice: product.salePrice,
          deliveryType: product.deliveryType,
          coverImage: product.coverImage,
          featuredImageUrl: product.featuredImageUrl,
          featuredImageAlt: product.featuredImageAlt,
          images: product.images,
          videoUrl: product.videoUrl,
          hasFiles: product.hasFiles || false,
          fileCount: product.fileCount || 0,
          hasRepository: product.hasRepository || false,
          checkoutUrl: product.checkoutUrl,
          isVisible: true,
        })
        .returning();
      results.push(inserted);
    }
  }

  return results;
}

/**
 * Get all visible products across all API keys for a user
 */
export async function getUserMmfcProducts(userId: number) {
  // First get all API key IDs for this user
  const userApiKeys = await db
    .select({ id: mmfcApiKeys.id })
    .from(mmfcApiKeys)
    .where(eq(mmfcApiKeys.userId, userId));

  if (userApiKeys.length === 0) {
    return [];
  }

  const apiKeyIds = userApiKeys.map(k => k.id);

  // Then get all visible products for those API keys
  return await db
    .select()
    .from(mmfcProducts)
    .where(
      and(
        eq(mmfcProducts.isVisible, true),
        inArray(mmfcProducts.apiKeyId, apiKeyIds)
      )
    )
    .orderBy(desc(mmfcProducts.createdAt));
}

/**
 * Get all visible products (public - for products page)
 */
export async function getPublicMmfcProducts() {
  return await db
    .select()
    .from(mmfcProducts)
    .where(eq(mmfcProducts.isVisible, true))
    .orderBy(desc(mmfcProducts.createdAt));
}

/**
 * Get a specific product by slug (public)
 */
export async function getMmfcProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(mmfcProducts)
    .where(and(eq(mmfcProducts.slug, slug), eq(mmfcProducts.isVisible, true)))
    .limit(1);

  return product || null;
}

/**
 * Get a specific product by ID (for admin)
 */
export async function getMmfcProductById(id: number, userId: number) {
  return await db.query.mmfcProducts.findFirst({
    where: and(
      eq(mmfcProducts.id, id),
      eq(mmfcApiKeys.userId, userId)
    ),
    with: {
      apiKey: true,
    },
  });
}

/**
 * Toggle product visibility
 */
export async function toggleMmfcProductVisibility(id: number, userId: number, isVisible: boolean) {
  const product = await getMmfcProductById(id, userId);
  if (!product) return null;

  const [updated] = await db
    .update(mmfcProducts)
    .set({ isVisible, updatedAt: new Date() })
    .where(eq(mmfcProducts.id, id))
    .returning();

  return updated || null;
}

/**
 * Get products for a specific API key
 */
export async function getProductsForApiKey(apiKeyId: number) {
  return await db
    .select()
    .from(mmfcProducts)
    .where(eq(mmfcProducts.apiKeyId, apiKeyId))
    .orderBy(desc(mmfcProducts.syncedAt));
}

/**
 * Get API keys that need auto-sync
 */
export async function getApiKeysForAutoSync() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get all active keys with auto-sync enabled
  const keys = await db
    .select()
    .from(mmfcApiKeys)
    .where(and(eq(mmfcApiKeys.isActive, true), eq(mmfcApiKeys.autoSync, true)));

  // Filter based on sync frequency
  return keys.filter((key) => {
    if (!key.lastSyncAt) return true; // Never synced

    const lastSync = new Date(key.lastSyncAt);
    if (key.syncFrequency === 'daily' && lastSync < oneDayAgo) return true;
    if (key.syncFrequency === 'weekly' && lastSync < oneWeekAgo) return true;

    return false;
  });
}
