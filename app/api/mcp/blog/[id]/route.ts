import { NextRequest, NextResponse } from 'next/server';
import { verifyMcpPermission } from '@/lib/auth/mcp-auth';
import {
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  generateSlug,
  isSlugAvailable,
  calculateReadingTime,
} from '@/lib/db/queries-blogs';
import { NewBlogPost } from '@/lib/db/schema';

/**
 * GET /api/mcp/blog/[id] - Get a specific blog post (MCP)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await verifyMcpPermission(request, 'blog', 'read');

    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      );
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const post = await getBlogPostById(id);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/mcp/blog/[id] - Update a blog post (MCP)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await verifyMcpPermission(request, 'blog', 'write');

    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      );
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();

    // Check if post exists
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Handle slug update
    let slug = body.slug || existingPost.slug;
    if (body.title && body.title !== existingPost.title && !body.slug) {
      slug = generateSlug(body.title);
    }

    // Ensure slug is unique (excluding current post)
    if (slug !== existingPost.slug) {
      let slugCounter = 1;
      let originalSlug = slug;
      while (!(await isSlugAvailable(slug, id))) {
        slug = `${originalSlug}-${slugCounter}`;
        slugCounter++;
      }
    }

    // Calculate reading time if content changed
    const readingTimeMinutes =
      body.content !== undefined
        ? calculateReadingTime(body.content)
        : existingPost.readingTimeMinutes;

    // Prepare update data
    const updateData: Partial<NewBlogPost> = {
      title: body.title !== undefined ? body.title : existingPost.title,
      slug,
      author: body.author !== undefined ? body.author : existingPost.author,
      excerpt: body.excerpt !== undefined ? body.excerpt : existingPost.excerpt,
      content: body.content !== undefined ? body.content : existingPost.content,
      coverImageUrl: body.coverImageUrl !== undefined ? body.coverImageUrl : existingPost.coverImageUrl,
      ogImageUrl: body.ogImageUrl !== undefined ? body.ogImageUrl : existingPost.ogImageUrl,
      ogTitle: body.ogTitle !== undefined ? body.ogTitle : existingPost.ogTitle,
      ogDescription: body.ogDescription !== undefined ? body.ogDescription : existingPost.ogDescription,
      metaTitle: body.metaTitle !== undefined ? body.metaTitle : existingPost.metaTitle,
      metaDescription: body.metaDescription !== undefined ? body.metaDescription : existingPost.metaDescription,
      metaKeywords: body.metaKeywords !== undefined ? body.metaKeywords : existingPost.metaKeywords,
      focusKeyword: body.focusKeyword !== undefined ? body.focusKeyword : existingPost.focusKeyword,
      canonicalUrl: body.canonicalUrl !== undefined ? body.canonicalUrl : existingPost.canonicalUrl,
      metaRobots: body.metaRobots !== undefined ? body.metaRobots : existingPost.metaRobots,
      articleType: body.articleType !== undefined ? body.articleType : existingPost.articleType,
      industry: body.industry !== undefined ? body.industry : existingPost.industry,
      targetAudience: body.targetAudience !== undefined ? body.targetAudience : existingPost.targetAudience,
      keyConcepts: body.keyConcepts !== undefined ? body.keyConcepts : existingPost.keyConcepts,
      readingTimeMinutes,
    };

    // Handle publish status change
    if (body.isPublished !== undefined) {
      updateData.isPublished = body.isPublished;
      // Set publishedAt when publishing for the first time
      if (body.isPublished && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
      // Clear publishedAt when unpublishing
      if (!body.isPublished) {
        updateData.publishedAt = null;
      }
    }

    const post = await updateBlogPost(id, updateData);

    return NextResponse.json({ post, message: 'Blog post updated successfully' });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mcp/blog/[id] - Delete a blog post (MCP)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await verifyMcpPermission(request, 'blog', 'write');

    if (!authorized || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      );
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Check if post exists
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await deleteBlogPost(id);

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
