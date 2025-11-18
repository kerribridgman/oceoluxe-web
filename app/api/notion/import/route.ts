import { NextRequest, NextResponse } from 'next/server';
import { NotionAPI } from 'notion-client';
import { getUser } from '@/lib/db/queries';
import {
  extractNotionPageId,
  isValidNotionUrl,
  extractImageUrls,
  replaceImageUrls,
  generateSlug,
  extractExcerpt,
} from '@/lib/notion-import';
import { notionToMarkdown, getPageTitle } from '@/lib/notion-to-markdown';

export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin/owner
  if (user.role !== 'owner' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Notion URL is required' },
        { status: 400 }
      );
    }

    // Validate Notion URL
    if (!isValidNotionUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid Notion URL. Please provide a valid Notion page URL.' },
        { status: 400 }
      );
    }

    // Extract page ID
    const pageId = extractNotionPageId(url);
    if (!pageId) {
      return NextResponse.json(
        { error: 'Could not extract page ID from URL' },
        { status: 400 }
      );
    }

    // Initialize Notion client
    const notion = new NotionAPI();

    // Fetch page data
    let recordMap;
    try {
      recordMap = await notion.getPage(pageId);
    } catch (error: any) {
      console.error('Error fetching Notion page:', error);

      if (error.message?.includes('not found')) {
        return NextResponse.json(
          {
            error:
              'Notion page not found or is not public. Please make sure the page is publicly accessible.',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to fetch Notion page. Please check the URL and try again.',
        },
        { status: 500 }
      );
    }

    // Extract page title
    let title;
    try {
      title = getPageTitle(recordMap, pageId);
    } catch (error) {
      console.error('Error extracting title:', error);
      title = 'Untitled';
    }

    // Convert to Markdown
    let markdown;
    try {
      markdown = notionToMarkdown(recordMap, pageId);
    } catch (error) {
      console.error('Error converting to markdown:', error);
      return NextResponse.json(
        { error: 'Failed to convert Notion page to markdown' },
        { status: 500 }
      );
    }

    // Extract and process images
    const imageUrls = extractImageUrls(markdown);
    const urlMap = new Map<string, string>();

    // Download and upload images
    for (const imageUrl of imageUrls) {
      try {
        // Download image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) continue;

        const imageBlob = await imageResponse.blob();
        const filename = `notion-${pageId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${imageBlob.type.split('/')[1] || 'png'}`;

        // Upload to Vercel Blob
        const formData = new FormData();
        formData.append('file', imageBlob, filename);
        formData.append('type', 'cover');

        const uploadResponse = await fetch(
          `${request.nextUrl.origin}/api/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          urlMap.set(imageUrl, uploadResult.url);
        }
      } catch (error) {
        console.error(`Failed to process image ${imageUrl}:`, error);
        // Continue with other images
      }
    }

    // Replace image URLs in markdown
    const updatedMarkdown = replaceImageUrls(markdown, urlMap);

    // Get first image as cover image
    const firstNewImageUrl = urlMap.size > 0 ? Array.from(urlMap.values())[0] : undefined;

    // Generate slug from title
    const slug = generateSlug(title);

    // Extract excerpt
    const excerpt = extractExcerpt(updatedMarkdown);

    // Return the imported data
    return NextResponse.json({
      title,
      slug,
      content: updatedMarkdown,
      excerpt,
      coverImageUrl: firstNewImageUrl,
      author: user.name || user.email,
    });
  } catch (error) {
    console.error('Error importing from Notion:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while importing from Notion',
      },
      { status: 500 }
    );
  }
}
