/**
 * Get Blog Post Tool
 */

export const definition = {
  name: 'get_blog_post',
  description: 'Get a specific blog post by ID with all its content and metadata',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'Blog post ID',
      },
    },
    required: ['id'],
  },
};

export async function execute(args, { API_BASE_URL, API_KEY }) {
  const response = await fetch(`${API_BASE_URL}/api/mcp/blog/${args.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get blog post');
  }

  const data = await response.json();
  const post = data.post;

  return {
    content: [
      {
        type: 'text',
        text: `📄 **${post.title}**

**ID:** ${post.id}
**Slug:** ${post.slug}
**Author:** ${post.author}
**Status:** ${post.isPublished ? '✓ Published' : '📝 Draft'}
**Published:** ${post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
**Reading Time:** ${post.readingTimeMinutes} minutes
**Created:** ${new Date(post.createdAt).toLocaleDateString()}

${post.excerpt ? `**Excerpt:**\n${post.excerpt}\n\n` : ''}**Content:**
${post.content}

${post.coverImageUrl ? `\n**Cover Image:** ${post.coverImageUrl}` : ''}
${post.metaTitle ? `\n**SEO Title:** ${post.metaTitle}` : ''}
${post.metaDescription ? `\n**SEO Description:** ${post.metaDescription}` : ''}`,
      },
    ],
  };
}
