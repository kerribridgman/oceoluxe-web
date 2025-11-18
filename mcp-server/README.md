# Patrick Farrell's Blog MCP Server

Model Context Protocol (MCP) server for managing Patrick Farrell's blog through Claude Desktop.

## Features

- **Create Blog Posts** - Write new blog posts with full markdown support
- **List Blog Posts** - View all posts with filtering options
- **Update Blog Posts** - Edit existing posts
- **Delete Blog Posts** - Remove posts permanently
- **Publish/Unpublish** - Control post visibility
- **Upload Images** - Upload images to Vercel Blob storage
- **Full SEO Support** - Manage meta titles, descriptions, keywords, and more

## Installation

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Get Your API Key

1. Visit https://iampatrickfarrell.com/dashboard/mcp
2. Sign in to your account
3. Click "Create API Key"
4. Give it a name (e.g., "Claude Desktop")
5. Copy the API key (you'll only see it once!)

### 3. Configure Claude Desktop

Add to your Claude Desktop configuration file:

**macOS/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "iampatrickfarrell-blog": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/mcp-server/index.js"],
      "env": {
        "MCP_API_KEY": "mcp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "API_BASE_URL": "https://iampatrickfarrell.com"
      }
    }
  }
}
```

Replace:
- `/ABSOLUTE/PATH/TO/mcp-server/index.js` with the actual path
- `mcp_live_xxx...` with your actual API key

### 4. Restart Claude Desktop

Close and reopen Claude Desktop completely for the changes to take effect.

## Available Tools

### create_blog_post
Create a new blog post with markdown content and SEO metadata.

**Example:**
```
Create a blog post titled "Getting Started with AI" with this content:
"# Introduction\n\nAI is transforming how we work..."
```

### list_blog_posts
List all blog posts with optional filtering.

**Example:**
```
List all published blog posts
```

### get_blog_post
Get full details of a specific blog post.

**Example:**
```
Get blog post with ID 5
```

### update_blog_post
Update an existing blog post.

**Example:**
```
Update blog post 5 with new title "AI Best Practices"
```

### publish_blog_post
Publish a draft post.

**Example:**
```
Publish blog post 5
```

### unpublish_blog_post
Unpublish a post (make it a draft).

**Example:**
```
Unpublish blog post 5
```

### delete_blog_post
Permanently delete a blog post.

**Example:**
```
Delete blog post 5
```

### upload_image
Upload an image for use in blog posts.

**Example:**
```
Upload image from /path/to/image.jpg
```

## Security

- API keys are securely hashed in the database
- All requests require authentication
- Keys can be revoked anytime from the dashboard
- Last used timestamps track key activity

## Development

Run the server in development mode:

```bash
npm run dev
```

## Troubleshooting

**Issue:** "MCP_API_KEY environment variable is required"
- Make sure you've added your API key to the Claude Desktop config

**Issue:** Server not appearing in Claude Desktop
- Check the path to index.js is absolute, not relative
- Verify Node.js is installed (`node --version`)
- Check Claude Desktop logs for errors

**Issue:** "Unauthorized" errors
- Verify your API key is correct
- Check if the key is still active in the dashboard
- Regenerate a new key if needed

## Support

For issues or questions:
- Dashboard: https://iampatrickfarrell.com/dashboard
- GitHub Issues: [Report an issue]

## License

MIT
