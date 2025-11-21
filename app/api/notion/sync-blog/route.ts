import { NextRequest, NextResponse } from 'next/server';
import { syncNotionBlogPosts } from '@/lib/notion-blog-sync';
import { getUser } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Start the sync
    console.log('Starting Notion blog sync...');
    const result = await syncNotionBlogPosts(user.id);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Sync completed with errors',
          synced: result.synced,
          errors: result.errors,
          posts: result.posts,
        },
        { status: 207 } // Multi-status
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${result.synced} blog posts`,
      synced: result.synced,
      posts: result.posts,
    });

  } catch (error) {
    console.error('Error in Notion sync API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status or configuration
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Check if Notion is configured
    const isConfigured = !!(
      process.env.NOTION_API_KEY &&
      process.env.NOTION_BLOG_DATABASE_ID
    );

    return NextResponse.json({
      configured: isConfigured,
      apiKeyPresent: !!process.env.NOTION_API_KEY,
      databaseIdPresent: !!process.env.NOTION_BLOG_DATABASE_ID,
    });

  } catch (error) {
    console.error('Error checking Notion configuration:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
