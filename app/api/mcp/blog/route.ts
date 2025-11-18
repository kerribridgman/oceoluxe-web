import { NextRequest, NextResponse } from 'next/server';
import { verifyMcpPermission } from '@/lib/auth/mcp-auth';
import {
  getAllBlogPosts,
  createBlogPost,
  generateSlug,
  isSlugAvailable,
  calculateReadingTime,
} from '@/lib/db/queries-blogs';
import { NewBlogPost } from '@/lib/db/schema';

/**
 * GET /api/mcp/blog - List all blog posts (MCP)
 */
export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await verifyMcpPermission(request, 'blog', 'read');

    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all'; // 'all', 'draft', 'published'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const posts = await getAllBlogPosts();

    // Filter by status
    let filteredPosts = posts;
    if (status === 'draft') {
      filteredPosts = posts.filter((p) => !p.isPublished);
    } else if (status === 'published') {
      filteredPosts = posts.filter((p) => p.isPublished);
    }

    // Apply pagination
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    return NextResponse.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      count: paginatedPosts.length,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error in GET /api/mcp/blog:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mcp/blog - Create a new blog post (MCP)
 */
export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await verifyMcpPermission(request, 'blog', 'write');

    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Generate or use provided slug
    let slug = body.slug || generateSlug(body.title);

    // Ensure slug is unique
    let slugCounter = 1;
    let originalSlug = slug;
    while (!(await isSlugAvailable(slug))) {
      slug = `${originalSlug}-${slugCounter}`;
      slugCounter++;
    }

    // Calculate reading time
    const readingTimeMinutes = calculateReadingTime(body.content);

    // Prepare blog post data
    const blogPostData: NewBlogPost = {
      title: body.title.trim(),
      slug,
      author: body.author || user.name || user.email,
      excerpt: body.excerpt || null,
      content: body.content,
      coverImageUrl: body.coverImageUrl || null,
      ogImageUrl: body.ogImageUrl || null,
      ogTitle: body.ogTitle || null,
      ogDescription: body.ogDescription || null,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      metaKeywords: body.metaKeywords || null,
      focusKeyword: body.focusKeyword || null,
      canonicalUrl: body.canonicalUrl || null,
      metaRobots: body.metaRobots || 'index, follow',
      articleType: body.articleType || 'BlogPosting',
      industry: body.industry || null,
      targetAudience: body.targetAudience || null,
      keyConcepts: body.keyConcepts || null,
      publishedAt: body.isPublished ? new Date() : null,
      isPublished: body.isPublished || false,
      readingTimeMinutes,
      createdBy: user.id,
    };

    const post = await createBlogPost(blogPostData);

    return NextResponse.json(
      {
        post,
        message: 'Blog post created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/mcp/blog:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
