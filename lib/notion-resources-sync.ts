import { Client } from '@notionhq/client';
import { db } from '@/lib/db/drizzle';
import { resources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';
import { generateSlug } from './notion-import';

// Helper to safely get select value
function getSelectValue(prop: any): string | null {
  if (!prop) return null;
  if (prop.type === 'select' && prop.select?.name) {
    return prop.select.name;
  }
  if (prop.type === 'multi_select' && Array.isArray(prop.multi_select) && prop.multi_select[0]?.name) {
    return prop.multi_select[0].name;
  }
  return null;
}

// Helper to safely get URL value
function getUrlValue(prop: any): string | null {
  if (!prop) return null;
  if (prop.type === 'url' && prop.url) {
    return prop.url;
  }
  return null;
}

// Helper to safely get checkbox value
function getCheckboxValue(prop: any): boolean {
  if (!prop) return false;
  if (prop.type === 'checkbox') {
    return prop.checkbox === true;
  }
  return false;
}

interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
  resources: Array<{
    id: string;
    title: string;
    status: 'created' | 'updated' | 'skipped';
  }>;
}

interface SyncProgress {
  current: number;
  total: number;
  currentTitle: string;
  status: 'created' | 'updated' | 'skipped' | 'error';
}

type ProgressCallback = (progress: SyncProgress) => void;

/**
 * Map Notion category values to our category slugs
 */
function mapCategory(notionCategory: string | null): string {
  if (!notionCategory) return 'general';

  const categoryMap: Record<string, string> = {
    'Template': 'templates',
    'Templates': 'templates',
    'Guide': 'guides',
    'Guides': 'guides',
    'Tech Pack': 'tech-packs',
    'Tech Packs': 'tech-packs',
    'Mood Board': 'mood-boards',
    'Mood Boards': 'mood-boards',
    'Pattern': 'patterns',
    'Patterns': 'patterns',
    'General': 'general',
  };

  return categoryMap[notionCategory] || notionCategory.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Extract file type from URL or Notion property
 */
function extractFileType(url: string | null, notionUrl: string | null): string {
  // If there's a Notion URL but no download URL, it's a Notion template
  if (notionUrl && !url) return 'notion';

  // Check download URL for Notion links
  if (url) {
    if (url.includes('notion.so') || url.includes('notion.site')) return 'notion';

    const extension = url.split('.').pop()?.toLowerCase()?.split('?')[0];
    if (extension && ['pdf', 'xlsx', 'docx', 'figma', 'zip'].includes(extension)) {
      return extension;
    }
  }

  // Default to notion if we have a notion URL, otherwise pdf
  return notionUrl ? 'notion' : 'pdf';
}

/**
 * Sync resources from Notion database to local database
 */
export async function syncNotionResources(
  userId: number,
  onProgress?: ProgressCallback
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    errors: [],
    resources: [],
  };

  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_RESOURCES_DB_ID;

    if (!apiKey) {
      throw new Error('NOTION_API_KEY not configured');
    }

    if (!databaseId) {
      throw new Error('NOTION_RESOURCES_DB_ID not configured. Add this to your environment variables.');
    }

    // Initialize Notion client
    const notion = new Client({ auth: apiKey });

    // Query database for all resources
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    });

    console.log(`Found ${response.results.length} resources in Notion`);

    const totalResources = response.results.length;
    let currentIndex = 0;

    for (const page of response.results) {
      currentIndex++;
      try {
        if (!('properties' in page)) continue;

        // Extract title - try multiple common property names
        let title = 'Untitled Resource';
        const titleProp = page.properties.Name || page.properties.Title || page.properties.title;
        if (titleProp?.type === 'title' && titleProp.title) {
          title = titleProp.title.map((t: any) => t.plain_text).join('');
        }

        const slug = generateSlug(title);

        // Extract description
        let description = '';
        const descProp = page.properties.Description || page.properties.description;
        if (descProp?.type === 'rich_text' && descProp.rich_text) {
          description = descProp.rich_text.map((t: any) => t.plain_text).join('');
        }

        // Extract category
        let category = 'general';
        const catProp = page.properties.Category || page.properties.Type || page.properties.category;
        const catValue = getSelectValue(catProp);
        if (catValue) {
          category = mapCategory(catValue);
        }

        // Extract download URL
        const urlProp = page.properties.URL || page.properties.Link || page.properties['Download URL'];
        const downloadUrl = getUrlValue(urlProp);

        // Get the Notion URL early so we can use it for file type detection
        const notionPageUrl = 'url' in page ? page.url : null;

        // Extract file type
        let fileType = 'pdf';
        const fileTypeProp = page.properties['File Type'] || page.properties.FileType;
        const fileTypeValue = getSelectValue(fileTypeProp);
        if (fileTypeValue) {
          fileType = fileTypeValue.toLowerCase();
        } else {
          // Pass both downloadUrl and notionUrl to detect Notion templates
          fileType = extractFileType(downloadUrl, notionPageUrl);
        }

        // Get cover image as thumbnail
        let thumbnailUrl: string | null = null;
        if ('cover' in page && page.cover) {
          if (page.cover.type === 'external') {
            thumbnailUrl = page.cover.external.url;
          } else if (page.cover.type === 'file') {
            thumbnailUrl = page.cover.file.url;
          }
        }

        // Rehost thumbnail if it's a Notion URL (they expire)
        if (thumbnailUrl && (
          thumbnailUrl.includes('notion') ||
          thumbnailUrl.includes('s3.us-west-2.amazonaws.com') ||
          thumbnailUrl.includes('prod-files-secure')
        )) {
          try {
            const imageResponse = await fetch(thumbnailUrl);
            if (imageResponse.ok) {
              const imageBlob = await imageResponse.blob();
              const contentType = imageResponse.headers.get('content-type') || 'image/png';
              const extension = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png';
              const filename = `resource-thumbnails/notion-${page.id}-${Date.now()}.${extension}`;
              const blob = await put(filename, imageBlob, {
                access: 'public',
                contentType,
              });
              thumbnailUrl = blob.url;
            }
          } catch (error) {
            console.error('Failed to rehost thumbnail:', error);
          }
        }

        // Check for featured flag
        const featuredProp = page.properties.Featured || page.properties.featured;
        const isFeatured = getCheckboxValue(featuredProp);

        // Check for published status
        let isPublished = true;
        const publishedProp = page.properties.Published || page.properties.Status;
        if (publishedProp?.type === 'checkbox') {
          isPublished = getCheckboxValue(publishedProp);
        } else if (publishedProp?.type === 'select') {
          const statusValue = getSelectValue(publishedProp);
          isPublished = statusValue?.toLowerCase() === 'published';
        }

        // Check if resource already exists by slug
        const existing = await db.query.resources.findFirst({
          where: eq(resources.slug, slug),
        });

        if (existing) {
          // Update existing resource
          await db.update(resources)
            .set({
              title,
              description,
              category,
              thumbnailUrl,
              downloadUrl,
              notionUrl: notionPageUrl,
              fileType,
              isPublished,
              isFeatured,
              updatedAt: new Date(),
            })
            .where(eq(resources.id, existing.id));

          result.resources.push({
            id: page.id,
            title,
            status: 'updated',
          });

          if (onProgress) {
            onProgress({
              current: currentIndex,
              total: totalResources,
              currentTitle: title,
              status: 'updated',
            });
          }
        } else {
          // Create new resource
          await db.insert(resources).values({
            title,
            slug,
            description,
            category,
            thumbnailUrl,
            downloadUrl,
            notionUrl: notionPageUrl,
            fileType,
            isPublished,
            isFeatured,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          result.resources.push({
            id: page.id,
            title,
            status: 'created',
          });

          if (onProgress) {
            onProgress({
              current: currentIndex,
              total: totalResources,
              currentTitle: title,
              status: 'created',
            });
          }
        }

        result.synced++;
        console.log(`Synced: ${title} (${existing ? 'updated' : 'created'})`);

      } catch (error) {
        console.error(`Error syncing resource ${page.id}:`, error);
        result.errors.push(`Failed to sync resource: ${error instanceof Error ? error.message : 'Unknown error'}`);

        if (onProgress) {
          onProgress({
            current: currentIndex,
            total: totalResources,
            currentTitle: 'Error syncing resource',
            status: 'error',
          });
        }
      }
    }

  } catch (error) {
    console.error('Error syncing Notion resources:', error);
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
  }

  return result;
}

/**
 * Sync a single resource by its database ID (local)
 */
export async function syncSingleResource(
  userId: number,
  resourceId: number
): Promise<{ success: boolean; message: string; status?: 'updated' }> {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_RESOURCES_DB_ID;

    if (!apiKey || !databaseId) {
      throw new Error('Notion API not configured');
    }

    // Get the resource from database to find its slug/notionUrl
    const existingResource = await db.query.resources.findFirst({
      where: eq(resources.id, resourceId),
    });

    if (!existingResource) {
      throw new Error('Resource not found');
    }

    if (!existingResource.notionUrl) {
      throw new Error('Resource does not have a Notion URL to sync from');
    }

    const notion = new Client({ auth: apiKey });

    // Query Notion for the resource with matching slug
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    // Find the matching Notion page by URL or title
    let matchedPage = null;
    for (const page of response.results) {
      if (!('properties' in page)) continue;
      if (!('url' in page)) continue;

      // Match by Notion URL
      if (page.url === existingResource.notionUrl) {
        matchedPage = page;
        break;
      }

      // Or match by title/slug
      const titleProp = page.properties.Name || page.properties.Title || page.properties.title;
      if (titleProp?.type === 'title' && titleProp.title) {
        const title = titleProp.title.map((t: any) => t.plain_text).join('');
        const slug = generateSlug(title);
        if (slug === existingResource.slug) {
          matchedPage = page;
          break;
        }
      }
    }

    if (!matchedPage || !('properties' in matchedPage)) {
      throw new Error('Could not find matching resource in Notion');
    }

    // Extract title
    let title = existingResource.title;
    const titleProp = matchedPage.properties.Name || matchedPage.properties.Title || matchedPage.properties.title;
    if (titleProp?.type === 'title' && titleProp.title) {
      title = titleProp.title.map((t: any) => t.plain_text).join('');
    }

    // Extract description
    let description = existingResource.description;
    const descProp = matchedPage.properties.Description || matchedPage.properties.description;
    if (descProp?.type === 'rich_text' && descProp.rich_text) {
      description = descProp.rich_text.map((t: any) => t.plain_text).join('');
    }

    // Extract category
    let category = existingResource.category;
    const catProp = matchedPage.properties.Category || matchedPage.properties.Type || matchedPage.properties.category;
    const catValue = getSelectValue(catProp);
    if (catValue) {
      category = mapCategory(catValue);
    }

    // Extract download URL
    const urlProp = matchedPage.properties.URL || matchedPage.properties.Link || matchedPage.properties['Download URL'];
    const downloadUrl = getUrlValue(urlProp);

    // Get cover image as thumbnail
    let thumbnailUrl: string | null = existingResource.thumbnailUrl;
    if ('cover' in matchedPage && matchedPage.cover) {
      let coverUrl: string | null = null;
      if (matchedPage.cover.type === 'external') {
        coverUrl = matchedPage.cover.external.url;
      } else if (matchedPage.cover.type === 'file') {
        coverUrl = matchedPage.cover.file.url;
      }

      // Rehost if it's a Notion URL
      if (coverUrl && (
        coverUrl.includes('notion') ||
        coverUrl.includes('s3.us-west-2.amazonaws.com') ||
        coverUrl.includes('prod-files-secure')
      )) {
        try {
          const imageResponse = await fetch(coverUrl);
          if (imageResponse.ok) {
            const imageBlob = await imageResponse.blob();
            const contentType = imageResponse.headers.get('content-type') || 'image/png';
            const extension = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png';
            const filename = `resource-thumbnails/notion-${matchedPage.id}-${Date.now()}.${extension}`;
            const blob = await put(filename, imageBlob, {
              access: 'public',
              contentType,
            });
            thumbnailUrl = blob.url;
          }
        } catch (error) {
          console.error('Failed to rehost thumbnail:', error);
        }
      } else if (coverUrl) {
        thumbnailUrl = coverUrl;
      }
    }

    // Get Notion URL and determine file type
    const notionPageUrl = 'url' in matchedPage ? matchedPage.url : existingResource.notionUrl;
    let fileType = existingResource.fileType || 'pdf';
    const fileTypeProp = matchedPage.properties['File Type'] || matchedPage.properties.FileType;
    const fileTypeValue = getSelectValue(fileTypeProp);
    if (fileTypeValue) {
      fileType = fileTypeValue.toLowerCase();
    } else {
      fileType = extractFileType(downloadUrl, notionPageUrl);
    }

    // Update the resource
    await db.update(resources)
      .set({
        title,
        description,
        category,
        thumbnailUrl,
        downloadUrl,
        notionUrl: notionPageUrl,
        fileType,
        updatedAt: new Date(),
      })
      .where(eq(resources.id, resourceId));

    return {
      success: true,
      message: `Successfully synced "${title}"`,
      status: 'updated',
    };

  } catch (error) {
    console.error('Error syncing single resource:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
