# Patrick Farrell's Personal Website & Blog

A modern personal website and blog platform with Model Context Protocol (MCP) integration, allowing blog management directly through Claude Desktop.

**Live Site: [https://iampatrickfarrell.com](https://iampatrickfarrell.com)**

## Features

### Blog Platform
- Full-featured blog with markdown support
- Rich image upload and management (Vercel Blob storage)
- SEO optimization with custom meta tags
- Draft and publish workflows
- Application forms (coaching, entrepreneur circle)
- Analytics and link tracking

### MCP Integration
- **Claude Desktop Integration**: Manage blog posts directly from Claude Desktop using natural language
- **API Key Management**: Secure API key generation with granular permissions
- **8 MCP Tools Available**:
  - Create blog posts
  - List and filter posts
  - Update existing posts
  - Publish/unpublish posts
  - Delete posts
  - Upload images
  - Full markdown support

### Authentication & Dashboard
- Email/password authentication with JWTs
- Role-based access control (Owner, Member)
- Activity logging system
- User management
- Team collaboration features

### Content Import
- Notion integration for importing blog posts
- Automatic image downloading and re-uploading to Vercel Blob

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Image Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Payments**: [Stripe](https://stripe.com/)
- **UI**: [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **MCP Server**: [Model Context Protocol SDK](https://modelcontextprotocol.io/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) with rehype plugins

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm package manager

### Installation

```bash
git clone https://github.com/yourusername/iampatrickfarrell.git
cd iampatrickfarrell
pnpm install
```

### Environment Setup

Create a `.env` file with the following variables:

```env
# Database
POSTGRES_URL=your_postgres_connection_string

# Authentication
AUTH_SECRET=your_random_secret_key

# Vercel Blob (for image uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Stripe (optional, for payments)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Base URL
BASE_URL=http://localhost:3000
```

Generate `AUTH_SECRET` with:
```bash
openssl rand -base64 32
```

### Database Setup

Run the database migrations and seed:

```bash
pnpm db:migrate
pnpm db:seed
```

This creates a default user:
- Email: `test@test.com`
- Password: `admin123`

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## MCP Integration Setup

### 1. Generate an API Key

1. Navigate to [http://localhost:3000/dashboard/integrations](http://localhost:3000/dashboard/integrations)
2. Click "Create API Key"
3. Name your key (e.g., "Claude Desktop")
4. Select permissions (Read/Write for blog management)
5. **Copy the API key immediately** - you won't see it again!

### 2. Configure Claude Desktop

Open your Claude Desktop config file:

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

Add the MCP server configuration:

```json
{
  "mcpServers": {
    "iampatrickfarrell-blog": {
      "command": "node",
      "args": ["/absolute/path/to/iampatrickfarrell/mcp-server/index.js"],
      "env": {
        "MCP_API_KEY": "mcp_live_your_actual_key_here",
        "API_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

Completely quit and restart Claude Desktop to load the MCP server.

### 4. Test It Out

In Claude Desktop, try:

```
Create a blog post titled "Hello World" with content about testing the MCP integration
```

Check your dashboard at [http://localhost:3000/dashboard/blog](http://localhost:3000/dashboard/blog) to see the new post!

For more details, see [MCP_SETUP_GUIDE.md](./MCP_SETUP_GUIDE.md)

## Available Scripts

```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm db:setup      # Create .env file
pnpm db:migrate    # Run database migrations
pnpm db:seed       # Seed database with test data
pnpm db:generate   # Generate new migration
pnpm db:studio     # Open Drizzle Studio
```

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── (dashboard)/         # Dashboard routes (protected)
│   ├── api/                 # API routes
│   │   ├── blog/           # Blog CRUD endpoints
│   │   ├── mcp/            # MCP API endpoints
│   │   ├── mcp-keys/       # API key management
│   │   └── notion/         # Notion import
│   └── blog/               # Public blog pages
├── components/              # React components
│   ├── blog/               # Blog-specific components
│   └── ui/                 # shadcn/ui components
├── lib/                     # Utilities and helpers
│   ├── auth/               # Authentication & MCP auth
│   ├── db/                 # Database, schema, queries
│   └── notion-to-markdown.ts
├── mcp-server/             # MCP server for Claude Desktop
│   ├── index.js            # MCP server entry point
│   └── tools/              # MCP tool definitions
└── public/                 # Static assets
```

## API Endpoints

### Blog Management
- `GET /api/blog` - List all blog posts
- `POST /api/blog` - Create new post
- `GET /api/blog/[id]` - Get specific post
- `PUT /api/blog/[id]` - Update post
- `DELETE /api/blog/[id]` - Delete post

### MCP Integration
- `POST /api/mcp-keys` - Create API key
- `GET /api/mcp-keys` - List API keys
- `DELETE /api/mcp-keys/[id]` - Delete API key
- `GET /api/mcp/blog` - List posts (MCP auth)
- `POST /api/mcp/blog` - Create post (MCP auth)
- `POST /api/mcp/upload-image` - Upload image (MCP auth)

### Content Import
- `POST /api/notion/import` - Import from Notion

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com/)
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables for Production

Update these for production:
- `BASE_URL` - Your production domain
- `POSTGRES_URL` - Production database URL
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
- `STRIPE_SECRET_KEY` - Production Stripe key
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret
- `AUTH_SECRET` - Secure random string

### MCP Server in Production

Update your Claude Desktop config to use the production URL:

```json
{
  "mcpServers": {
    "iampatrickfarrell-blog-prod": {
      "command": "node",
      "args": ["/absolute/path/to/iampatrickfarrell/mcp-server/index.js"],
      "env": {
        "MCP_API_KEY": "mcp_live_production_key_here",
        "API_BASE_URL": "https://iampatrickfarrell.com"
      }
    }
  }
}
```

## Security Features

- SHA-256 hashed API keys
- Permission-based access control
- JWT authentication with HTTP-only cookies
- RBAC for team members
- Activity logging for audit trails
- Secure image uploads with validation

## License

MIT License - feel free to use this as a template for your own projects!

## Acknowledgments

Built on the [Next.js SaaS Starter](https://github.com/nextjs/saas-starter) template with extensive customization for blogging and MCP integration.
