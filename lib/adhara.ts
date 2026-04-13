/**
 * Adhara API client for oceoluxe-web.
 *
 * This module replaces the direct PostgreSQL data layer for public-facing
 * blog, products, and CMS content. The admin dashboard and auth flows still
 * use the local DB.
 *
 * Required environment variables (add to .env.local):
 *   ADHARA_API_KEY                     — Server-side API key (never expose to client)
 *   ADHARA_WORKSPACE_ID                — Workspace UUID
 *   NEXT_PUBLIC_ADHARA_BASE_URL        — API base URL (default: https://api.adharaweb.com)
 *   NEXT_PUBLIC_ADHARA_WORKSPACE_SLUG  — Workspace slug (for public endpoints like products)
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_ADHARA_BASE_URL || 'https://api.adharaweb.com';
const WORKSPACE_ID = process.env.ADHARA_WORKSPACE_ID || '';
const WORKSPACE_SLUG = process.env.NEXT_PUBLIC_ADHARA_WORKSPACE_SLUG || '';
const API_KEY = process.env.ADHARA_API_KEY || '';

export function isAdharaConfigured(): boolean {
  return !!(WORKSPACE_ID && API_KEY);
}

// ─── Raw Adhara API response shapes ──────────────────────────────────────────

interface AdhRawPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image_url?: string | null;
  featured_image_position?: number | null;
  published_at?: string | null;
  updated_at?: string | null;
  tags?: string[];
  meta_title?: string | null;
  meta_description?: string | null;
  reading_time_minutes?: number | null;
  author_name?: string | null;
}

interface AdhRawProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price_cents: number;
  compare_at_price_cents?: number | null;
  currency: string;
  images?: string[];
  status: string;
  is_digital: boolean;
  tags?: string[];
}

// ─── Unified post type used across all public blog pages ─────────────────────

/**
 * Normalised blog post shape that both the Adhara path and the DB fallback
 * path return. Components should accept this type instead of the raw Drizzle
 * BlogPost.
 *
 * contentIsHtml = true  → render with dangerouslySetInnerHTML (Adhara CMS HTML)
 * contentIsHtml = false → render with MarkdownRenderer (legacy markdown)
 */
export interface AdharaPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  excerpt: string | null;
  content: string;
  contentIsHtml: boolean;
  coverImageUrl: string | null;
  ogImageUrl: string | null;
  publishedAt: Date | null;
  updatedAt: Date | null;
  isPublished: boolean;
  readingTimeMinutes: number | null;
  industry: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  metaKeywords: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  metaRobots: string;
  articleType: string;
  targetAudience: string | null;
  keyConcepts: string | null;
}

// ─── Unified product type ─────────────────────────────────────────────────────

export interface AdharaProduct {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  price: string;
  salePrice: string | null;
  priceInCents: number;
  isDigital: boolean;
  href: string;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapPost(raw: AdhRawPost): AdharaPost {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    author: raw.author_name || 'Kerri Bridgman',
    excerpt: raw.excerpt || null,
    content: raw.content || '',
    contentIsHtml: true,
    coverImageUrl: raw.featured_image_url || null,
    ogImageUrl: raw.featured_image_url || null,
    publishedAt: raw.published_at ? new Date(raw.published_at) : null,
    updatedAt: raw.updated_at ? new Date(raw.updated_at) : null,
    isPublished: true,
    readingTimeMinutes: raw.reading_time_minutes ?? null,
    industry: raw.tags?.[0] || null,
    metaTitle: raw.meta_title || null,
    metaDescription: raw.meta_description || null,
    ogTitle: raw.meta_title || raw.title,
    ogDescription: raw.meta_description || raw.excerpt || null,
    metaKeywords: raw.tags?.join(', ') || null,
    focusKeyword: raw.tags?.[0] || null,
    canonicalUrl: null,
    metaRobots: 'index, follow',
    articleType: 'BlogPosting',
    targetAudience: null,
    keyConcepts: null,
  };
}

function formatPrice(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function mapProduct(raw: AdhRawProduct): AdharaProduct {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.name,
    description: raw.description || null,
    coverImageUrl: raw.images?.[0] || null,
    price: raw.price_cents === 0 ? 'Free' : formatPrice(raw.price_cents, raw.currency),
    salePrice: raw.compare_at_price_cents
      ? formatPrice(raw.compare_at_price_cents, raw.currency)
      : null,
    priceInCents: raw.price_cents,
    isDigital: raw.is_digital,
    href: `/products/${raw.slug}`,
  };
}

/**
 * Convert a raw Drizzle BlogPost (from DB) to AdharaPost format.
 * Used for the DB fallback path — keeps the same rendering flow.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbPostToAdharaPost(dbPost: any): AdharaPost {
  return {
    id: String(dbPost.id),
    slug: dbPost.slug,
    title: dbPost.title,
    author: dbPost.author || 'Kerri Bridgman',
    excerpt: dbPost.excerpt ?? null,
    content: dbPost.content || '',
    contentIsHtml: false, // DB posts are markdown
    coverImageUrl: dbPost.coverImageUrl ?? null,
    ogImageUrl: dbPost.ogImageUrl ?? null,
    publishedAt: dbPost.publishedAt ? new Date(dbPost.publishedAt) : null,
    updatedAt: dbPost.updatedAt ? new Date(dbPost.updatedAt) : null,
    isPublished: dbPost.isPublished ?? false,
    readingTimeMinutes: dbPost.readingTimeMinutes ?? null,
    industry: dbPost.industry ?? null,
    metaTitle: dbPost.metaTitle ?? null,
    metaDescription: dbPost.metaDescription ?? null,
    ogTitle: dbPost.ogTitle ?? null,
    ogDescription: dbPost.ogDescription ?? null,
    metaKeywords: dbPost.metaKeywords ?? null,
    focusKeyword: dbPost.focusKeyword ?? null,
    canonicalUrl: dbPost.canonicalUrl ?? null,
    metaRobots: dbPost.metaRobots || 'index, follow',
    articleType: dbPost.articleType || 'BlogPosting',
    targetAudience: dbPost.targetAudience ?? null,
    keyConcepts: dbPost.keyConcepts ?? null,
  };
}

// ─── Blog API functions ───────────────────────────────────────────────────────

/**
 * Fetch all published blog posts from Adhara.
 * Returns empty array if Adhara is not configured.
 */
export async function fetchAdharaBlogPosts(limit = 100): Promise<AdharaPost[]> {
  if (!isAdharaConfigured()) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/blog-posts?workspace_id=${WORKSPACE_ID}&limit=${limit}&status=published`,
      {
        headers: { 'X-API-Key': API_KEY },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const posts: AdhRawPost[] = Array.isArray(json) ? json : (json.data ?? []);
    return posts
      .sort((a, b) => {
        const da = a.published_at ? new Date(a.published_at).getTime() : 0;
        const db = b.published_at ? new Date(b.published_at).getTime() : 0;
        return db - da;
      })
      .map(mapPost);
  } catch {
    return [];
  }
}

/**
 * Fetch a single published blog post by slug from Adhara.
 * Returns null if not configured or not found.
 */
export async function fetchAdharaBlogPostBySlug(
  slug: string
): Promise<AdharaPost | null> {
  if (!isAdharaConfigured()) return null;
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/blog-posts?workspace_id=${WORKSPACE_ID}&slug=${encodeURIComponent(slug)}&status=published`,
      {
        headers: { 'X-API-Key': API_KEY },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const posts: AdhRawPost[] = Array.isArray(json) ? json : (json.data ?? []);
    const found = posts.find((p) => p.slug === slug);
    return found ? mapPost(found) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch related posts from Adhara.
 * Prefers posts with the same industry/tag; falls back to recent posts.
 */
export async function fetchAdharaRelatedPosts(
  currentSlug: string,
  industry: string | null,
  limit = 4
): Promise<AdharaPost[]> {
  const all = await fetchAdharaBlogPosts(50);
  const others = all.filter((p) => p.slug !== currentSlug);
  if (industry) {
    const matching = others.filter((p) => p.industry === industry);
    if (matching.length >= limit) return matching.slice(0, limit);
    const rest = others.filter((p) => p.industry !== industry);
    return [...matching, ...rest].slice(0, limit);
  }
  return others.slice(0, limit);
}

/**
 * Get the previous and next published posts relative to a given post.
 */
export async function fetchAdharaAdjacentPosts(
  currentSlug: string,
  publishedAt: Date | null
): Promise<{ previous: { slug: string; title: string } | null; next: { slug: string; title: string } | null }> {
  if (!publishedAt) return { previous: null, next: null };

  const all = await fetchAdharaBlogPosts(100);
  const sorted = all
    .filter((p) => p.slug !== currentSlug && p.publishedAt !== null)
    .sort((a, b) => a.publishedAt!.getTime() - b.publishedAt!.getTime());

  const ts = publishedAt.getTime();
  const previous =
    [...sorted].reverse().find((p) => p.publishedAt!.getTime() < ts) || null;
  const next = sorted.find((p) => p.publishedAt!.getTime() > ts) || null;

  return {
    previous: previous ? { slug: previous.slug, title: previous.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  };
}

// ─── Products API functions ───────────────────────────────────────────────────

/**
 * Fetch all published products from Adhara.
 * Requires NEXT_PUBLIC_ADHARA_WORKSPACE_SLUG to be set.
 * Returns empty array if not configured.
 */
export async function fetchAdharaProducts(): Promise<AdharaProduct[]> {
  if (!WORKSPACE_SLUG) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/public/shop/${WORKSPACE_SLUG}/products`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const products: AdhRawProduct[] = Array.isArray(json) ? json : (json.data ?? []);
    return products.filter((p) => p.status === 'active').map(mapProduct);
  } catch {
    return [];
  }
}

/**
 * Fetch a single product by slug from Adhara.
 */
export async function fetchAdharaProductBySlug(
  slug: string
): Promise<AdharaProduct | null> {
  if (!WORKSPACE_SLUG) return null;
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/public/shop/${WORKSPACE_SLUG}/products/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const raw: AdhRawProduct = await res.json();
    return mapProduct(raw);
  } catch {
    return null;
  }
}

/**
 * Fetch published services from Adhara.
 */
export async function fetchAdharaServices(): Promise<AdharaProduct[]> {
  if (!WORKSPACE_SLUG) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/public/shop/${WORKSPACE_SLUG}/services`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const services: AdhRawProduct[] = Array.isArray(json) ? json : (json.data ?? []);
    return services.map(mapProduct);
  } catch {
    return [];
  }
}

// ─── Newsletter API ───────────────────────────────────────────────────────────

/**
 * Subscribe an email to the Adhara newsletter.
 * Uses the public spot endpoint — no API key required.
 */
export async function subscribeToAdhara(email: string): Promise<{ ok: boolean; message?: string }> {
  if (!WORKSPACE_SLUG) return { ok: false, message: 'Newsletter not configured' };
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/public/spot/${WORKSPACE_SLUG}/newsletter`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, message: (err as { detail?: string }).detail || 'Subscription failed' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Network error' };
  }
}

// ─── Forms API ────────────────────────────────────────────────────────────────

/**
 * Submit a form to Adhara.
 * Uses the authenticated endpoint so submissions create CRM leads.
 * Call this from a Next.js API route (never expose API_KEY to client).
 */
export async function submitAdharaForm(
  formSlug: string,
  responseData: Record<string, string | string[]>
): Promise<{ ok: boolean; message?: string }> {
  if (!API_KEY) return { ok: false, message: 'Forms not configured' };
  try {
    const res = await fetch(`${BASE_URL}/api/v1/forms/${formSlug}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({ response_data: responseData }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, message: (err as { detail?: string }).detail || 'Submission failed' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Network error' };
  }
}
