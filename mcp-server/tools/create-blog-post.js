/**
 * Create Blog Post Tool
 */

export const definition = {
  name: 'create_blog_post',
  description: 'Create a new blog post with full SEO metadata. Can be created as draft or published immediately.',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Blog post title',
      },
      content: {
        type: 'string',
        description: 'Blog post content in markdown format',
      },
      excerpt: {
        type: 'string',
        description: 'Short excerpt/summary of the post',
      },
      slug: {
        type: 'string',
        description: 'URL-friendly slug (auto-generated from title if not provided)',
      },
      author: {
        type: 'string',
        description: 'Author name',
      },
      coverImageUrl: {
        type: 'string',
        description: 'URL to cover image',
      },
      ogImageUrl: {
        type: 'string',
        description: 'URL to Open Graph image for social sharing',
      },
      metaTitle: {
        type: 'string',
        description: 'SEO meta title (60 chars max)',
      },
      metaDescription: {
        type: 'string',
        description: 'SEO meta description (160 chars max)',
      },
      metaKeywords: {
        type: 'string',
        description: 'SEO keywords (comma-separated)',
      },
      isPublished: {
        type: 'boolean',
        description: 'Publish immediately (true) or save as draft (false)',
        default: false,
      },
    },
    required: ['title', 'content'],
  },
};

export async function execute(args, { API_BASE_URL, API_KEY }) {
  const response = await fetch(`${API_BASE_URL}/api/mcp/blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create blog post');
  }

  const data = await response.json();

  return {
    content: [
      {
        type: 'text',
        text: `✅ Blog post created successfully!

**${data.post.title}**
ID: ${data.post.id}
Slug: ${data.post.slug}
Status: ${data.post.isPublished ? 'Published ✓' : 'Draft 📝'}

${data.post.isPublished ? `View at: ${API_BASE_URL}/blog/${data.post.slug}` : 'Use publish_blog_post to make it live.'}`,
      },
    ],
  };
}
