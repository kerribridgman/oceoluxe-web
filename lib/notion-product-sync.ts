import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { db } from '@/lib/db/drizzle';
import { notionProducts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { put } from '@vercel/blob';
import { generateSlug, extractExcerpt } from './notion-import';

interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
  products: Array<{
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
 * Sync products from Notion database to local database
 * @param userId - The user ID
 * @param onProgress - Optional callback for progress updates
 * @param limit - Optional limit on number of products to sync (syncs most recent first)
 */
export async function syncNotionProducts(userId: number, onProgress?: ProgressCallback, limit?: number): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    errors: [],
    products: [],
  };

  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_PRODUCTS_DATABASE_ID;

    console.log('Environment variables for products:', {
      hasApiKey: !!apiKey,
      hasDatabaseId: !!databaseId,
      databaseId: databaseId
    });

    if (!apiKey) {
      throw new Error('NOTION_API_KEY not configured');
    }

    if (!databaseId) {
      throw new Error('NOTION_PRODUCTS_DATABASE_ID not configured');
    }

    // Initialize Notion client with the API key
    const notion = new Client({
      auth: apiKey,
    });

    const n2m = new NotionToMarkdown({ notionClient: notion });

    // Query database for all pages, sorted by last edited time (most recent first)
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          timestamp: 'last_edited_time',
          direction: 'descending',
        },
      ],
    });

    console.log(`Found ${response.results.length} products in Notion`);

    // Apply limit if specified
    const productsToSync = limit ? response.results.slice(0, limit) : response.results;
    const totalProducts = productsToSync.length;
    let currentIndex = 0;

    console.log(`Syncing ${totalProducts} products${limit ? ` (limited to ${limit})` : ''}`);

    for (const page of productsToSync) {
      currentIndex++;
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

        // Extract excerpt from content
        const excerpt = extractExcerpt(markdown);

        // Get description property if exists
        const descProp = page.properties.Description;
        let description: string | undefined;
        if (descProp?.type === 'rich_text') {
          description = descProp.rich_text.map((t: any) => t.plain_text).join('');
        }

        // Get price property
        const priceProp = page.properties.Price;
        let price: string | undefined;
        if (priceProp?.type === 'number' && priceProp.number !== null) {
          price = `$${priceProp.number}`;
        } else if (priceProp?.type === 'rich_text') {
          price = priceProp.rich_text.map((t: any) => t.plain_text).join('');
        }

        // Get sale price property
        const salePriceProp = page.properties['Sale Price'];
        let salePrice: string | undefined;
        if (salePriceProp?.type === 'number' && salePriceProp.number !== null) {
          salePrice = `$${salePriceProp.number}`;
        } else if (salePriceProp?.type === 'rich_text') {
          salePrice = salePriceProp.rich_text.map((t: any) => t.plain_text).join('');
        }

        // Get product type property
        const typeProp = page.properties.Type || page.properties['Product Type'];
        let productType: string | undefined;
        if (typeProp?.type === 'select' && typeProp.select) {
          productType = (typeProp.select as any).name;
        } else if (typeProp?.type === 'rich_text') {
          productType = typeProp.rich_text.map((t: any) => t.plain_text).join('');
        }

        // Get category property
        const categoryProp = page.properties.Category;
        let category: string | undefined;
        if (categoryProp?.type === 'select' && categoryProp.select) {
          category = (categoryProp.select as any).name;
        } else if (categoryProp?.type === 'multi_select') {
          category = (categoryProp.multi_select as any[]).map((t: any) => t.name).join(', ');
        }

        // Get checkout URL
        const checkoutProp = page.properties['Checkout URL'] || page.properties.Checkout || page.properties.URL;
        let checkoutUrl: string | undefined;
        if (checkoutProp?.type === 'url') {
          checkoutUrl = (checkoutProp.url as string) || undefined;
        } else if (checkoutProp?.type === 'rich_text') {
          checkoutUrl = checkoutProp.rich_text.map((t: any) => t.plain_text).join('');
        }

        // Get preview URL
        const previewProp = page.properties['Preview URL'] || page.properties.Preview || page.properties.Demo;
        let previewUrl: string | undefined;
        if (previewProp?.type === 'url') {
          previewUrl = (previewProp.url as string) || undefined;
        } else if (previewProp?.type === 'rich_text') {
          previewUrl = previewProp.rich_text.map((t: any) => t.plain_text).join('');
        }

        // Get published status - check for Live, Published, or Status properties
        const publishedProp = page.properties.Live || page.properties.Published || page.properties.Status;
        let isPublished = false; // Default to NOT published for safety
        if (publishedProp?.type === 'checkbox') {
          isPublished = publishedProp.checkbox as boolean;
        } else if (publishedProp?.type === 'select' && publishedProp.select) {
          isPublished = (publishedProp.select as any).name.toLowerCase() === 'published';
        }

        // Get featured status
        const featuredProp = page.properties.Featured;
        let isFeatured = false;
        if (featuredProp?.type === 'checkbox') {
          isFeatured = featuredProp.checkbox as boolean;
        }

        // Get display order
        const orderProp = page.properties.Order || page.properties['Display Order'];
        let displayOrder = 0;
        if (orderProp?.type === 'number' && orderProp.number !== null) {
          displayOrder = orderProp.number as number;
        }

        // Get cover image if exists
        let coverImageUrl: string | undefined;
        if ('cover' in page && page.cover) {
          if (page.cover.type === 'external') {
            coverImageUrl = page.cover.external.url;
          } else if (page.cover.type === 'file') {
            coverImageUrl = page.cover.file.url;
          }
        }

        // Download and rehost cover image if it's a Notion URL
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
              const filename = `product-covers/notion-${page.id}-${Date.now()}.${extension}`;
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

        // Check if product already exists by Notion page ID
        const existing = await db.query.notionProducts.findFirst({
          where: eq(notionProducts.notionPageId, page.id),
        });

        if (existing) {
          // Update existing product
          await db.update(notionProducts)
            .set({
              title,
              slug,
              description: description || excerpt,
              content: markdown,
              excerpt,
              price,
              salePrice,
              productType,
              category,
              coverImageUrl,
              checkoutUrl,
              previewUrl,
              isPublished,
              isFeatured,
              displayOrder,
              updatedAt: new Date(),
            })
            .where(eq(notionProducts.id, existing.id));

          result.products.push({
            id: page.id,
            title,
            status: 'updated',
          });

          // Report progress
          if (onProgress) {
            onProgress({
              current: currentIndex,
              total: totalProducts,
              currentTitle: title,
              status: 'updated',
            });
          }
        } else {
          // Create new product
          await db.insert(notionProducts).values({
            notionPageId: page.id,
            title,
            slug,
            description: description || excerpt,
            content: markdown,
            excerpt,
            price,
            salePrice,
            productType,
            category,
            coverImageUrl,
            checkoutUrl,
            previewUrl,
            isPublished,
            isFeatured,
            displayOrder,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          result.products.push({
            id: page.id,
            title,
            status: 'created',
          });

          // Report progress
          if (onProgress) {
            onProgress({
              current: currentIndex,
              total: totalProducts,
              currentTitle: title,
              status: 'created',
            });
          }
        }

        result.synced++;
        console.log(`Synced: ${title} (${existing ? 'updated' : 'created'})`);

      } catch (error) {
        console.error(`Error syncing page ${page.id}:`, error);
        result.errors.push(`Failed to sync product: ${error instanceof Error ? error.message : 'Unknown error'}`);

        // Report error progress
        if (onProgress) {
          onProgress({
            current: currentIndex,
            total: totalProducts,
            currentTitle: 'Error syncing product',
            status: 'error',
          });
        }
      }
    }

  } catch (error) {
    console.error('Error syncing Notion products:', error);
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
  }

  return result;
}

/**
 * Sync a single product by its database ID (local)
 */
export async function syncSingleProduct(userId: number, productId: number): Promise<{ success: boolean; message: string; status?: 'created' | 'updated' }> {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_PRODUCTS_DATABASE_ID;

    if (!apiKey || !databaseId) {
      throw new Error('Notion API not configured for products');
    }

    // Get the product from database to find its Notion page ID
    const existingProduct = await db.query.notionProducts.findFirst({
      where: eq(notionProducts.id, productId),
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const notion = new Client({ auth: apiKey });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    // Get the page directly by Notion page ID
    const page = await notion.pages.retrieve({ page_id: existingProduct.notionPageId });

    if (!('properties' in page)) {
      throw new Error('Invalid page response from Notion');
    }

    // Extract properties (same logic as bulk sync)
    const titleProp = page.properties.Title || page.properties.Name;
    const title = titleProp?.type === 'title'
      ? titleProp.title.map((t: any) => t.plain_text).join('')
      : 'Untitled';

    const slug = generateSlug(title);

    // Get page content as markdown
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const markdown = n2m.toMarkdownString(mdBlocks).parent;
    const excerpt = extractExcerpt(markdown);

    // Get description
    const descProp = page.properties.Description;
    let description: string | undefined;
    if (descProp?.type === 'rich_text') {
      description = descProp.rich_text.map((t: any) => t.plain_text).join('');
    }

    // Get price
    const priceProp = page.properties.Price;
    let price: string | undefined;
    if (priceProp?.type === 'number' && priceProp.number !== null) {
      price = `$${priceProp.number}`;
    } else if (priceProp?.type === 'rich_text') {
      price = priceProp.rich_text.map((t: any) => t.plain_text).join('');
    }

    // Get sale price
    const salePriceProp = page.properties['Sale Price'];
    let salePrice: string | undefined;
    if (salePriceProp?.type === 'number' && salePriceProp.number !== null) {
      salePrice = `$${salePriceProp.number}`;
    } else if (salePriceProp?.type === 'rich_text') {
      salePrice = salePriceProp.rich_text.map((t: any) => t.plain_text).join('');
    }

    // Get product type
    const typeProp = page.properties.Type || page.properties['Product Type'];
    let productType: string | undefined;
    if (typeProp?.type === 'select' && typeProp.select) {
      productType = (typeProp.select as any).name;
    }

    // Get category
    const categoryProp = page.properties.Category;
    let category: string | undefined;
    if (categoryProp?.type === 'select' && categoryProp.select) {
      category = (categoryProp.select as any).name;
    } else if (categoryProp?.type === 'multi_select') {
      category = categoryProp.multi_select.map((t: any) => t.name).join(', ');
    }

    // Get checkout URL
    const checkoutProp = page.properties['Checkout URL'] || page.properties.Checkout || page.properties.URL;
    let checkoutUrl: string | undefined;
    if (checkoutProp?.type === 'url') {
      checkoutUrl = checkoutProp.url || undefined;
    }

    // Get preview URL
    const previewProp = page.properties['Preview URL'] || page.properties.Preview || page.properties.Demo;
    let previewUrl: string | undefined;
    if (previewProp?.type === 'url') {
      previewUrl = previewProp.url || undefined;
    }

    // Get cover image
    let coverImageUrl: string | undefined;
    if ('cover' in page && page.cover) {
      if (page.cover.type === 'external') {
        coverImageUrl = page.cover.external.url;
      } else if (page.cover.type === 'file') {
        coverImageUrl = page.cover.file.url;
      }
    }

    // Rehost cover image if needed
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
          const filename = `product-covers/notion-${page.id}-${Date.now()}.${extension}`;
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

    // Update the product
    await db.update(notionProducts)
      .set({
        title,
        slug,
        description: description || excerpt,
        content: markdown,
        excerpt,
        price,
        salePrice,
        productType,
        category,
        coverImageUrl,
        checkoutUrl,
        previewUrl,
        updatedAt: new Date(),
      })
      .where(eq(notionProducts.id, productId));

    return {
      success: true,
      message: `Successfully synced "${title}"`,
      status: 'updated',
    };

  } catch (error) {
    console.error('Error syncing single product:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
