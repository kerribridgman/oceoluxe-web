/**
 * Delete Blog Post Tool
 */

export const definition = {
  name: 'delete_blog_post',
  description: 'Permanently delete a blog post. This action cannot be undone.',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'Blog post ID to delete',
      },
    },
    required: ['id'],
  },
};

export async function execute(args, { API_BASE_URL, API_KEY }) {
  const response = await fetch(`${API_BASE_URL}/api/mcp/blog/${args.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete blog post');
  }

  return {
    content: [
      {
        type: 'text',
        text: `🗑️ Blog post (ID: ${args.id}) has been permanently deleted.`,
      },
    ],
  };
}
