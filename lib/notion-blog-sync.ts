import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { db } from '@/lib/db/drizzle';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';
import { generateSlug, extractExcerpt } from './notion-import';

interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
  posts: Array<{
    id: string;
    title: string;
    status: 'created' | 'updated' | 'skipped';
  }>;
}

/**
 * Sync blog posts from Notion database to local database
 */
export async function syncNotionBlogPosts(userId: number): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    errors: [],
    posts: [],
  };

  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_BLOG_DATABASE_ID;

    console.log('Environment variables:', {
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 6) + '...' : 'none',
      apiKeyLength: apiKey ? apiKey.length : 0,
      hasDatabaseId: !!databaseId,
      databaseId: databaseId
    });

    if (!apiKey) {
      throw new Error('NOTION_API_KEY not configured');
    }

    if (!databaseId) {
      throw new Error('NOTION_BLOG_DATABASE_ID not configured');
    }

    // Initialize Notion client with the API key
    const notion = new Client({
      auth: apiKey,
    });

    console.log('Notion client initialized:', {
      hasClient: !!notion,
      hasDatabases: !!notion.databases,
      hasQuery: !!(notion.databases && notion.databases.query),
      clientKeys: Object.keys(notion),
      databasesKeys: notion.databases ? Object.keys(notion.databases) : []
    });

    const n2m = new NotionToMarkdown({ notionClient: notion });

    // Query database for all pages
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log(`Found ${response.results.length} posts in Notion`);

    for (const page of response.results) {
      try {
        if (!('properties' in page)) continue;

        // Extract page properties
        const titleProp = page.properties.Title || page.properties.Name;
        const title = titleProp?.type === 'title'
          ? titleProp.title.map((t: any) => t.plain_text).join('')
          : 'Untitled';

        const slug = generateSlug(title);

        // Get page content as markdown
        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const markdown = n2m.toMarkdownString(mdBlocks).parent;

        // Extract excerpt
        const excerpt = extractExcerpt(markdown);

        // Get cover image if exists
        let coverImageUrl: string | undefined;
        if ('cover' in page && page.cover) {
          if (page.cover.type === 'external') {
            coverImageUrl = page.cover.external.url;
          } else if (page.cover.type === 'file') {
            coverImageUrl = page.cover.file.url;
          }
        }

        // Download and rehost cover image if it's a Notion URL (includes S3 URLs used by Notion)
        const isNotionUrl = coverImageUrl && (
          coverImageUrl.includes('notion') ||
          coverImageUrl.includes('s3.us-west-2.amazonaws.com') ||
          coverImageUrl.includes('prod-files-secure')
        );

        if (isNotionUrl && coverImageUrl) {
          try {
            const imageResponse = await fetch(coverImageUrl);
            if (imageResponse.ok) {
              const imageBlob = await imageResponse.blob();
              const contentType = imageResponse.headers.get('content-type') || 'image/png';
              const extension = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png';
              const filename = `blog-covers/notion-${page.id}-${Date.now()}.${extension}`;
              const blob = await put(filename, imageBlob, {
                access: 'public',
                contentType,
              });
              coverImageUrl = blob.url;
            }
          } catch (error) {
            console.error('Failed to rehost cover image:', error);
          }
        }

        // Get published date
        const publishedProp = page.properties.Published || page.properties.Date;
        let publishedAt: Date | undefined;
        if (publishedProp) {
          if (publishedProp.type === 'date' && publishedProp.date) {
            publishedAt = new Date(publishedProp.date.start);
          } else if (publishedProp.type === 'created_time' && 'created_time' in page) {
            publishedAt = new Date(page.created_time);
          }
        }

        // Check if post already exists
        const existing = await db.query.blogPosts.findFirst({
          where: eq(blogPosts.slug, slug),
        });

        if (existing) {
          // Update existing post
          await db.update(blogPosts)
            .set({
              title,
              content: markdown,
              excerpt,
              coverImageUrl,
              publishedAt: publishedAt || existing.publishedAt,
              updatedAt: new Date(),
            })
            .where(eq(blogPosts.id, existing.id));

          result.posts.push({
            id: page.id,
            title,
            status: 'updated',
          });
        } else {
          // Create new post (auto-publish posts from Notion)
          await db.insert(blogPosts).values({
            title,
            slug,
            content: markdown,
            excerpt,
            coverImageUrl,
            author: 'Kerri Bridgman',
            createdBy: userId,
            isPublished: true, // Auto-publish posts synced from Notion
            publishedAt: publishedAt || new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          result.posts.push({
            id: page.id,
            title,
            status: 'created',
          });
        }

        result.synced++;
        console.log(`Synced: ${title} (${existing ? 'updated' : 'created'})`);

      } catch (error) {
        console.error(`Error syncing page ${page.id}:`, error);
        result.errors.push(`Failed to sync page: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

  } catch (error) {
    console.error('Error syncing Notion blog posts:', error);
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
  }

  return result;
}
