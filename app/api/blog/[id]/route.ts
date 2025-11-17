import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  generateSlug,
  isSlugAvailable,
  calculateReadingTime,
} from '@/lib/db/queries-blogs';
import { NewBlogPost } from '@/lib/db/schema';

// GET /api/blog/[id] - Get a blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const post = await getBlogPostById(id);

    if (!post) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();

    // Check if post exists
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
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

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Check if post exists
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    await deleteBlogPost(id);

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
