/**
 * Update Blog Post Tool
 */

export const definition = {
  name: 'update_blog_post',
  description: 'Update an existing blog post. Only provide fields you want to change.',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'Blog post ID',
      },
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
        description: 'URL-friendly slug',
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
        description: 'URL to Open Graph image',
      },
      metaTitle: {
        type: 'string',
        description: 'SEO meta title',
      },
      metaDescription: {
        type: 'string',
        description: 'SEO meta description',
      },
      metaKeywords: {
        type: 'string',
        description: 'SEO keywords (comma-separated)',
      },
      isPublished: {
        type: 'boolean',
        description: 'Published status',
      },
    },
    required: ['id'],
  },
};

export async function execute(args, { API_BASE_URL, API_KEY }) {
  const { id, ...updateData } = args;

  const response = await fetch(`${API_BASE_URL}/api/mcp/blog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update blog post');
  }

  const data = await response.json();

  return {
    content: [
      {
        type: 'text',
        text: `✅ Blog post updated successfully!

**${data.post.title}**
ID: ${data.post.id}
Slug: ${data.post.slug}
Status: ${data.post.isPublished ? 'Published ✓' : 'Draft 📝'}

${data.post.isPublished ? `View at: ${API_BASE_URL}/blog/${data.post.slug}` : ''}`,
      },
    ],
  };
}
