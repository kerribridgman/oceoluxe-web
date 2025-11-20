/**
 * Database queries for MMFC scheduling links
 */

import { db } from './drizzle';
import { mmfcSchedulingLinks, mmfcApiKeys } from './schema';
import { eq, and, desc } from 'drizzle-orm';

export interface SchedulingLinkData {
  externalId: number;
  slug: string;
  title: string;
  description?: string;
  durationMinutes: number;
  bookingUrl: string;
  maxAdvanceBookingDays?: number;
  minNoticeMinutes?: number;
}

/**
 * Get all scheduling links for a specific API key
 */
export async function getSchedulingLinksByApiKey(apiKeyId: number) {
  return await db
    .select()
    .from(mmfcSchedulingLinks)
    .where(eq(mmfcSchedulingLinks.apiKeyId, apiKeyId))
    .orderBy(desc(mmfcSchedulingLinks.createdAt));
}

/**
 * Get all scheduling links for a user (across all their API keys)
 */
export async function getAllSchedulingLinksForUser(userId: number) {
  const result = await db
    .select({
      link: mmfcSchedulingLinks,
      apiKey: {
        id: mmfcApiKeys.id,
        name: mmfcApiKeys.name,
      },
    })
    .from(mmfcSchedulingLinks)
    .innerJoin(mmfcApiKeys, eq(mmfcSchedulingLinks.apiKeyId, mmfcApiKeys.id))
    .where(eq(mmfcApiKeys.userId, userId))
    .orderBy(desc(mmfcSchedulingLinks.syncedAt));

  return result.map(({ link, apiKey }) => ({
    ...link,
    apiKeyName: apiKey.name,
  }));
}

/**
 * Get only enabled scheduling links for a user
 */
export async function getEnabledSchedulingLinksForUser(userId: number) {
  const result = await db
    .select({
      link: mmfcSchedulingLinks,
    })
    .from(mmfcSchedulingLinks)
    .innerJoin(mmfcApiKeys, eq(mmfcSchedulingLinks.apiKeyId, mmfcApiKeys.id))
    .where(
      and(
        eq(mmfcApiKeys.userId, userId),
        eq(mmfcSchedulingLinks.isEnabled, true)
      )
    )
    .orderBy(desc(mmfcSchedulingLinks.syncedAt));

  return result.map(({ link }) => link);
}

/**
 * Upsert scheduling links from MMFC API
 */
export async function upsertSchedulingLinks(
  apiKeyId: number,
  links: SchedulingLinkData[]
) {
  const results = [];

  for (const link of links) {
    const [upserted] = await db
      .insert(mmfcSchedulingLinks)
      .values({
        apiKeyId,
        externalId: link.externalId,
        slug: link.slug,
        title: link.title,
        description: link.description,
        durationMinutes: link.durationMinutes,
        bookingUrl: link.bookingUrl,
        maxAdvanceBookingDays: link.maxAdvanceBookingDays,
        minNoticeMinutes: link.minNoticeMinutes,
        syncedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [mmfcSchedulingLinks.apiKeyId, mmfcSchedulingLinks.externalId],
        set: {
          slug: link.slug,
          title: link.title,
          description: link.description,
          durationMinutes: link.durationMinutes,
          bookingUrl: link.bookingUrl,
          maxAdvanceBookingDays: link.maxAdvanceBookingDays,
          minNoticeMinutes: link.minNoticeMinutes,
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
 * Toggle scheduling link enabled status
 */
export async function toggleSchedulingLinkStatus(
  linkId: number,
  userId: number,
  isEnabled: boolean
) {
  // First verify the user owns this link through their API key
  const link = await db.query.mmfcSchedulingLinks.findFirst({
    where: eq(mmfcSchedulingLinks.id, linkId),
    with: {
      apiKey: true,
    },
  });

  if (!link || (link.apiKey as any).userId !== userId) {
    throw new Error('Scheduling link not found or unauthorized');
  }

  const [updated] = await db
    .update(mmfcSchedulingLinks)
    .set({
      isEnabled,
      updatedAt: new Date(),
    })
    .where(eq(mmfcSchedulingLinks.id, linkId))
    .returning();

  return updated;
}

/**
 * Delete all scheduling links for an API key
 * (automatically triggered when API key is deleted via CASCADE)
 */
export async function deleteSchedulingLinksByApiKey(apiKeyId: number) {
  return await db
    .delete(mmfcSchedulingLinks)
    .where(eq(mmfcSchedulingLinks.apiKeyId, apiKeyId));
}
