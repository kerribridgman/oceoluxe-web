/**
 * Database queries for MMFC Services
 */

import { db } from './drizzle';
import { mmfcServices, mmfcApiKeys } from './schema';
import { eq, and, desc } from 'drizzle-orm';

export interface ServiceData {
  externalId: number;
  title: string;
  slug: string;
  url?: string | null;
  description?: string | null;
  pricingType?: string | null;
  price?: string | null;
  salePrice?: string | null;
  featuredImageUrl?: string | null;
  coverImage?: string | null;
}

/**
 * Get all MMFC services for a user
 */
export async function getAllServicesForUser(userId: number) {
  const result = await db
    .select({
      service: mmfcServices,
      apiKey: { id: mmfcApiKeys.id, name: mmfcApiKeys.name },
    })
    .from(mmfcServices)
    .innerJoin(mmfcApiKeys, eq(mmfcServices.apiKeyId, mmfcApiKeys.id))
    .where(eq(mmfcApiKeys.userId, userId))
    .orderBy(desc(mmfcServices.syncedAt));

  return result.map(({ service, apiKey }) => ({
    ...service,
    apiKeyName: apiKey.name,
  }));
}

/**
 * Get only visible MMFC services for a user (for public display)
 */
export async function getVisibleServicesForUser(userId: number) {
  const result = await db
    .select({
      service: mmfcServices,
    })
    .from(mmfcServices)
    .innerJoin(mmfcApiKeys, eq(mmfcServices.apiKeyId, mmfcApiKeys.id))
    .where(
      and(
        eq(mmfcApiKeys.userId, userId),
        eq(mmfcServices.isVisible, true)
      )
    )
    .orderBy(desc(mmfcServices.syncedAt));

  return result.map(({ service }) => service);
}

/**
 * Get all visible MMFC services (public, no auth required)
 */
export async function getAllVisibleServices() {
  const result = await db
    .select()
    .from(mmfcServices)
    .where(eq(mmfcServices.isVisible, true))
    .orderBy(desc(mmfcServices.syncedAt));

  return result;
}

/**
 * Upsert MMFC services from API
 */
export async function upsertServices(apiKeyId: number, services: ServiceData[]) {
  const results = [];

  for (const service of services) {
    const [upserted] = await db
      .insert(mmfcServices)
      .values({
        apiKeyId,
        externalId: service.externalId,
        title: service.title,
        slug: service.slug,
        url: service.url,
        description: service.description,
        pricingType: service.pricingType,
        price: service.price,
        salePrice: service.salePrice,
        featuredImageUrl: service.featuredImageUrl,
        coverImage: service.coverImage,
        syncedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [mmfcServices.apiKeyId, mmfcServices.externalId],
        set: {
          title: service.title,
          slug: service.slug,
          url: service.url,
          description: service.description,
          pricingType: service.pricingType,
          price: service.price,
          salePrice: service.salePrice,
          featuredImageUrl: service.featuredImageUrl,
          coverImage: service.coverImage,
          syncedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    results.push(upserted);
  }

  return results;
}

/**
 * Toggle service visibility status
 */
export async function toggleServiceVisibility(
  serviceId: number,
  userId: number,
  isVisible: boolean
) {
  const [updated] = await db
    .update(mmfcServices)
    .set({
      isVisible,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(mmfcServices.id, serviceId),
        // Verify ownership through API key
        eq(mmfcServices.apiKeyId,
          db.select({ id: mmfcApiKeys.id })
            .from(mmfcApiKeys)
            .where(
              and(
                eq(mmfcApiKeys.id, mmfcServices.apiKeyId),
                eq(mmfcApiKeys.userId, userId)
              )
            )
        )
      )
    )
    .returning();

  return updated;
}
