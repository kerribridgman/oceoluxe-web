# MCP Blog Integration - Quick Start Guide

Your blog now has full Model Context Protocol (MCP) integration! This allows you to manage your blog posts directly from Claude Desktop.

## 🎉 What's Been Built

### Backend Infrastructure
- ✅ `mcp_api_keys` database table with secure key storage
- ✅ MCP authentication middleware (`/lib/auth/mcp-auth.ts`)
- ✅ API key management queries (`/lib/db/queries-mcp.ts`)
- ✅ Dashboard UI for managing API keys (`/dashboard/mcp`)

### API Endpoints
- ✅ `/api/mcp-keys` - Create & list API keys
- ✅ `/api/mcp-keys/[id]` - Get, update, delete keys
- ✅ `/api/mcp/blog` - List & create blog posts
- ✅ `/api/mcp/blog/[id]` - Get, update, delete posts
- ✅ `/api/mcp/upload-image` - Upload images to Vercel Blob

### MCP Server
- ✅ Complete MCP server in `mcp-server/` directory
- ✅ 8 blog management tools
- ✅ Secure authentication with API keys
- ✅ Full markdown and image support

## 🚀 Getting Started

### Step 1: Generate an API Key

1. Start your dev server:
   ```bash
   pnpm dev
   ```

2. Visit http://localhost:3000/dashboard/mcp

3. Sign in with your account

4. Click "Create API Key"

5. Name it (e.g., "Claude Desktop Local")

6. **IMPORTANT:** Copy the API key immediately - you won't see it again!
   - Format: `mcp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Configure Claude Desktop

1. Open your Claude Desktop config file:

   **macOS:**
   ```bash
   code ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

   **Linux:**
   ```bash
   code ~/.config/Claude/claude_desktop_config.json
   ```

   **Windows:**
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Add this configuration (update the path and API key):

   ```json
   {
     "mcpServers": {
       "oceoluxe-blog": {
         "command": "node",
         "args": ["/Users/pfarrell/projects/vercel/oceoluxe/mcp-server/index.js"],
         "env": {
           "MCP_API_KEY": "mcp_live_your_actual_key_here",
           "API_BASE_URL": "http://localhost:3000"
         }
       }
     }
   }
   ```

3. Save the file

4. **Completely quit and restart Claude Desktop**

### Step 3: Test It Out!

Open Claude Desktop and try:

```
Create a blog post titled "Testing MCP Integration" with this content:

"# Hello from Claude!

This blog post was created using the Model Context Protocol. Pretty cool, right?

## Features

- Create posts from Claude Desktop
- Full markdown support
- Image uploads
- SEO metadata

Let's see if this works!"
```

Then check your dashboard at http://localhost:3000/dashboard/blog - you should see the new post!

## 🛠️ Available Commands

### Create a Post
```
Create a blog post titled "My New Post" with content about AI and machine learning
```

### List Posts
```
List all blog posts
Show me all draft posts
List published posts
```

### Get a Post
```
Get blog post with ID 1
Show me the details of post 5
```

### Update a Post
```
Update blog post 1 with a new title "Updated Title"
Change the content of post 3 to include more examples
```

### Publish/Unpublish
```
Publish blog post 2
Unpublish post 5
```

### Upload Images
```
Upload an image from /path/to/image.jpg
```

### Delete
```
Delete blog post 7
```

## 🔧 Production Deployment

When deploying to production:

1. Create a new API key in your production dashboard

2. Update Claude Desktop config with production URL:
   ```json
   {
     "mcpServers": {
       "oceoluxe-blog-prod": {
         "command": "node",
         "args": ["/Users/pfarrell/projects/vercel/oceoluxe/mcp-server/index.js"],
         "env": {
           "MCP_API_KEY": "mcp_live_production_key",
           "API_BASE_URL": "https://oceoluxe.com"
         }
       }
     }
   }
   ```

## 🔐 Security Features

- API keys are SHA-256 hashed in the database
- Only the first 8 chars are stored for identification
- Keys can be deactivated or deleted anytime
- Last used timestamp tracks activity
- Granular permissions (currently blog: read/write)

## 🐛 Troubleshooting

**MCP server not showing in Claude Desktop?**
- Check the path is absolute, not relative
- Verify Node.js is installed: `node --version`
- Look at Claude Desktop logs for errors

**"Unauthorized" errors?**
- Verify API key is correct in config
- Check if key is active in dashboard
- Make sure you copied the full key

**Images not uploading?**
- Verify `BLOB_READ_WRITE_TOKEN` is set in `.env`
- Check file size (max 10MB)
- Ensure file type is supported (JPEG, PNG, GIF, WebP)

**Build errors?**
- Run `pnpm install` to ensure all dependencies are installed
- Check that `date-fns` is installed

## 📝 Next Steps

1. ✅ Test locally with the dev server
2. ✅ Create a few blog posts from Claude Desktop
3. ✅ Upload test images
4. ✅ Deploy to production
5. ✅ Generate production API key
6. ✅ Update Claude config for production use

Enjoy managing your blog with AI! 🚀
