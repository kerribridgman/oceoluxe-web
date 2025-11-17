import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getAllBlogPosts,
  createBlogPost,
  generateSlug,
  isSlugAvailable,
  calculateReadingTime,
} from '@/lib/db/queries-blogs';
import { NewBlogPost } from '@/lib/db/schema';

// GET /api/blog - Get all blog posts (admin view)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const posts = await getAllBlogPosts();

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Generate slug from title if not provided
    let slug = body.slug || generateSlug(body.title);

    // Ensure slug is unique
    let slugCounter = 1;
    let originalSlug = slug;
    while (!(await isSlugAvailable(slug))) {
      slug = `${originalSlug}-${slugCounter}`;
      slugCounter++;
    }

    // Calculate reading time from content
    const readingTimeMinutes = calculateReadingTime(body.content || '');

    // Prepare blog post data
    const blogPostData: NewBlogPost = {
      title: body.title,
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

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
