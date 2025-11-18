/**
 * Publish Blog Post Tool
 */

export const definition = {
  name: 'publish_blog_post',
  description: 'Publish a draft blog post, making it visible to the public',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'Blog post ID to publish',
      },
    },
    required: ['id'],
  },
};

export async function execute(args, { API_BASE_URL, API_KEY }) {
  const response = await fetch(`${API_BASE_URL}/api/mcp/blog/${args.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ isPublished: true }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to publish blog post');
  }

  const data = await response.json();

  return {
    content: [
      {
        type: 'text',
        text: `🎉 Blog post published successfully!

**${data.post.title}**
View at: ${API_BASE_URL}/blog/${data.post.slug}`,
      },
    ],
  };
}
