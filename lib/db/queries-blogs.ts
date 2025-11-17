import { db } from './drizzle';
import { blogPosts, type BlogPost, type NewBlogPost } from './schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Get all blog posts (admin view - includes unpublished)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt));
}

/**
 * Get all published blog posts (public view)
 */
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
}

/**
 * Get a blog post by ID
 */
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const results = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  return results[0] || null;
}

/**
 * Get a published blog post by slug (public view)
 */
export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const results = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.isPublished, true)
      )
    )
    .limit(1);

  return results[0] || null;
}

/**
 * Get a blog post by slug (admin view - includes unpublished)
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const results = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  return results[0] || null;
}

/**
 * Create a new blog post
 */
export async function createBlogPost(data: NewBlogPost): Promise<BlogPost> {
  const [blogPost] = await db
    .insert(blogPosts)
    .values(data)
    .returning();

  return blogPost;
}

/**
 * Update a blog post
 */
export async function updateBlogPost(
  id: number,
  data: Partial<NewBlogPost>
): Promise<BlogPost | null> {
  const [blogPost] = await db
    .update(blogPosts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();

  return blogPost || null;
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number): Promise<void> {
  await db
    .delete(blogPosts)
    .where(eq(blogPosts.id, id));
}

/**
 * Generate a unique slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string, excludeId?: number): Promise<boolean> {
  const results = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (results.length === 0) {
    return true;
  }

  // If we're excluding an ID (for updates), check if the found post is the one we're updating
  if (excludeId && results[0].id === excludeId) {
    return true;
  }

  return false;
}

/**
 * Calculate reading time from markdown content (rough estimate)
 * Average reading speed: 200-250 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}
