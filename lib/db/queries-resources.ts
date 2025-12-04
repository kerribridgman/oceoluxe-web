import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { db } from './drizzle';
import { resources, Resource, NewResource } from './schema';

// =============================================
// RESOURCE QUERIES
// =============================================

export async function getAllResources(includeUnpublished = false) {
  if (includeUnpublished) {
    return await db
      .select()
      .from(resources)
      .orderBy(asc(resources.displayOrder), desc(resources.createdAt));
  }

  return await db
    .select()
    .from(resources)
    .where(eq(resources.isPublished, true))
    .orderBy(asc(resources.displayOrder), desc(resources.createdAt));
}

export async function getResourcesByCategory(category: string) {
  return await db
    .select()
    .from(resources)
    .where(and(eq(resources.isPublished, true), eq(resources.category, category)))
    .orderBy(asc(resources.displayOrder), desc(resources.createdAt));
}

export async function getFeaturedResources() {
  return await db
    .select()
    .from(resources)
    .where(and(eq(resources.isPublished, true), eq(resources.isFeatured, true)))
    .orderBy(asc(resources.displayOrder));
}

export async function getResourceById(id: number) {
  const [resource] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, id))
    .limit(1);

  return resource || null;
}

export async function getResourceBySlug(slug: string) {
  const [resource] = await db
    .select()
    .from(resources)
    .where(eq(resources.slug, slug))
    .limit(1);

  return resource || null;
}

export async function createResource(data: NewResource): Promise<Resource> {
  const [resource] = await db.insert(resources).values(data).returning();
  return resource;
}

export async function updateResource(
  id: number,
  data: Partial<NewResource>
): Promise<Resource | null> {
  const [updated] = await db
    .update(resources)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(resources.id, id))
    .returning();

  return updated || null;
}

export async function deleteResource(id: number): Promise<boolean> {
  const result = await db.delete(resources).where(eq(resources.id, id)).returning();
  return result.length > 0;
}

export async function incrementDownloadCount(id: number): Promise<void> {
  await db
    .update(resources)
    .set({
      downloadCount: sql`${resources.downloadCount} + 1`,
    })
    .where(eq(resources.id, id));
}

// =============================================
// RESOURCE STATS
// =============================================

export async function getResourceStats() {
  const allResources = await getAllResources(true);

  const byCategory = allResources.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDownloads = allResources.reduce(
    (acc, r) => acc + (r.downloadCount || 0),
    0
  );

  return {
    total: allResources.length,
    published: allResources.filter((r) => r.isPublished).length,
    byCategory,
    totalDownloads,
  };
}

export async function getResourceCategories() {
  return [
    { value: 'templates', label: 'Templates', color: 'bg-blue-100 text-blue-700' },
    { value: 'guides', label: 'Guides', color: 'bg-green-100 text-green-700' },
    { value: 'tech-packs', label: 'Tech Packs', color: 'bg-purple-100 text-purple-700' },
    { value: 'mood-boards', label: 'Mood Boards', color: 'bg-pink-100 text-pink-700' },
    { value: 'patterns', label: 'Patterns', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-700' },
  ];
}
