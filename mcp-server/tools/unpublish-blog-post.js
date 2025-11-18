/**
 * Unpublish Blog Post Tool
 */

export const definition = {
  name: 'unpublish_blog_post',
  description: 'Unpublish a blog post, making it a draft again and hiding it from the public',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'Blog post ID to unpublish',
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
    body: JSON.stringify({ isPublished: false }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to unpublish blog post');
  }

  const data = await response.json();

  return {
    content: [
      {
        type: 'text',
        text: `📝 Blog post unpublished successfully!

**${data.post.title}**
Status: Draft

The post is no longer visible to the public.`,
      },
    ],
  };
}
