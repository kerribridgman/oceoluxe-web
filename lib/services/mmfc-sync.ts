/**
 * Service for syncing products and scheduling links from Make Money from Coding API
 */

import {
  getDecryptedMmfcApiKey,
  getMmfcApiKeyById,
  upsertMmfcProducts,
  updateSyncStatus,
} from '../db/queries-mmfc';
import {
  upsertSchedulingLinks,
  type SchedulingLinkData,
} from '../db/queries-mmfc-scheduling';

interface MmfcProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  pricing_type: string;
  price: string;
  sale_price: string | null;
  delivery_type: string;
  cover_image: string;
  featured_image: {
    id: number;
    url: string;
    alt: string;
  } | null;
  video_url: string | null;
  has_files: boolean;
  file_count: number;
  has_repository: boolean;
  checkout_url?: string; // Direct checkout URL from MMFC API
  created_at: string;
  updated_at: string;
}

interface MmfcApiResponse {
  products: MmfcProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_more: boolean;
  };
}

/**
 * Fetch products from MMFC API
 */
async function fetchMmfcProducts(
  apiKey: string,
  baseUrl: string,
  page: number = 1
): Promise<MmfcApiResponse> {
  // Include referral parameter so MMFC API returns checkout URLs with tracking
  const url = `${baseUrl}/api/v1/products?page=${page}&limit=100&ref=iampatrickfarrell`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `MMFC API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Sync products for a specific API key
 */
export async function syncMmfcProducts(
  apiKeyId: number,
  userId: number
): Promise<{ success: boolean; productsCount: number; error?: string }> {
  try {
    // Get API key details
    const apiKeyRecord = await getMmfcApiKeyById(apiKeyId, userId);
    if (!apiKeyRecord) {
      throw new Error('API key not found');
    }

    if (!apiKeyRecord.isActive) {
      throw new Error('API key is inactive');
    }

    // Get decrypted API key
    const apiKey = await getDecryptedMmfcApiKey(apiKeyId, userId);
    if (!apiKey) {
      throw new Error('Failed to decrypt API key');
    }

    // Fetch all products (handle pagination)
    const allProducts: MmfcProduct[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchMmfcProducts(apiKey, apiKeyRecord.baseUrl, currentPage);
      allProducts.push(...response.products);

      hasMore = response.pagination.has_more;
      currentPage++;

      // Safety check to prevent infinite loops
      if (currentPage > 100) {
        console.warn('Reached maximum page limit (100) for MMFC sync');
        break;
      }
    }

    // Transform products for database
    const productsToUpsert = allProducts.map((product) => {
      // Use checkout_url from API if available, otherwise construct it
      // The MMFC API now provides checkout_url with referral tracking built-in
      const checkoutUrl = product.checkout_url ||
        `${apiKeyRecord.baseUrl}/store/patrick/${product.slug}?ref=iampatrickfarrell`;

      return {
        externalId: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        pricingType: product.pricing_type,
        price: product.price,
        salePrice: product.sale_price || undefined,
        deliveryType: product.delivery_type,
        coverImage: product.cover_image,
        featuredImageUrl: product.featured_image?.url,
        featuredImageAlt: product.featured_image?.alt,
        images: product.featured_image ? [product.featured_image] : undefined,
        videoUrl: product.video_url || undefined,
        hasFiles: product.has_files,
        fileCount: product.file_count,
        hasRepository: product.has_repository,
        checkoutUrl,
      };
    });

    // Upsert products to database
    await upsertMmfcProducts(apiKeyId, productsToUpsert);

    // Update sync status
    await updateSyncStatus(apiKeyId, 'success');

    return {
      success: true,
      productsCount: allProducts.length,
    };
  } catch (error: any) {
    console.error('MMFC sync error:', error);

    // Update sync status with error
    await updateSyncStatus(apiKeyId, 'error', error.message);

    return {
      success: false,
      productsCount: 0,
      error: error.message,
    };
  }
}

/**
 * Fetch scheduling availability from MMFC API
 */
async function fetchMmfcScheduling(
  apiKey: string,
  baseUrl: string
): Promise<{
  scheduling_links: Array<{
    id: number;
    slug: string;
    title: string;
    description?: string;
    duration_minutes: number;
    booking_url: string;
    max_advance_booking_days?: number;
    min_notice_minutes?: number;
  }>;
}> {
  const url = `${baseUrl}/api/v1/scheduling/availability`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `MMFC API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Sync scheduling links for a specific API key
 */
export async function syncMmfcScheduling(
  apiKeyId: number,
  userId: number
): Promise<{ success: boolean; linksCount: number; error?: string }> {
  try {
    // Get API key details
    const apiKeyRecord = await getMmfcApiKeyById(apiKeyId, userId);
    if (!apiKeyRecord) {
      throw new Error('API key not found');
    }

    if (!apiKeyRecord.isActive) {
      throw new Error('API key is inactive');
    }

    // Get decrypted API key
    const apiKey = await getDecryptedMmfcApiKey(apiKeyId, userId);
    if (!apiKey) {
      throw new Error('Failed to decrypt API key');
    }

    // Fetch scheduling links
    const response = await fetchMmfcScheduling(apiKey, apiKeyRecord.baseUrl);

    // Transform scheduling links for database
    const linksToUpsert: SchedulingLinkData[] = response.scheduling_links.map((link) => ({
      externalId: link.id,
      slug: link.slug,
      title: link.title,
      description: link.description,
      durationMinutes: link.duration_minutes,
      bookingUrl: link.booking_url,
      maxAdvanceBookingDays: link.max_advance_booking_days,
      minNoticeMinutes: link.min_notice_minutes,
    }));

    // Upsert scheduling links to database
    await upsertSchedulingLinks(apiKeyId, linksToUpsert);

    return {
      success: true,
      linksCount: linksToUpsert.length,
    };
  } catch (error: any) {
    console.error('MMFC scheduling sync error:', error);

    return {
      success: false,
      linksCount: 0,
      error: error.message,
    };
  }
}

/**
 * Sync products for all API keys that have auto-sync enabled
 * This can be called by a cron job
 */
export async function syncAllAutoSyncKeys(): Promise<{
  synced: number;
  failed: number;
  results: Array<{ apiKeyId: number; success: boolean; error?: string }>;
}> {
  const { getApiKeysForAutoSync } = await import('../db/queries-mmfc');
  const keysToSync = await getApiKeysForAutoSync();

  const results = [];
  let synced = 0;
  let failed = 0;

  for (const key of keysToSync) {
    const result = await syncMmfcProducts(key.id, key.userId);

    results.push({
      apiKeyId: key.id,
      success: result.success,
      error: result.error,
    });

    if (result.success) {
      synced++;
    } else {
      failed++;
    }
  }

  return { synced, failed, results };
}
