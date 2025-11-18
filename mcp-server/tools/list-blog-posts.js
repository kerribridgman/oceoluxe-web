/**
 * List Blog Posts Tool
 */

export const definition = {
  name: 'list_blog_posts',
  description: 'List all blog posts with optional filtering by status (all, draft, published)',
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'Filter by status',
        enum: ['all', 'draft', 'published'],
        default: 'all',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of posts to return',
        default: 20,
      },
      offset: {
        type: 'number',
        description: 'Number of posts to skip',
        default: 0,
      },
    },
  },
};

export async function execute(args, { API_BASE_URL, API_KEY }) {
  const params = new URLSearchParams({
    status: args.status || 'all',
    limit: String(args.limit || 20),
    offset: String(args.offset || 0),
  });

  const response = await fetch(`${API_BASE_URL}/api/mcp/blog?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to list blog posts');
  }

  const data = await response.json();

  let postList = data.posts.map((post) => {
    const status = post.isPublished ? '✓ Published' : '📝 Draft';
    const publishedDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published';
    return `${post.id}. **${post.title}**
   Slug: ${post.slug}
   Status: ${status}
   Author: ${post.author}
   Published: ${publishedDate}
   Reading time: ${post.readingTimeMinutes} min`;
  }).join('\n\n');

  return {
    content: [
      {
        type: 'text',
        text: `📚 Blog Posts (${data.count} of ${data.total} total)

${postList || 'No blog posts found'}`,
      },
    ],
  };
}
