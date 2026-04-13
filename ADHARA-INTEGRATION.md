# Adhara Integration

This document captures what was connected, how it works, what to do next, and what still needs to be wired.

---

## What Was Done

### 1. New file: `lib/adhara.ts`

The core Adhara API client. All public-facing content now flows through this file.

Key exports:
- `fetchAdharaBlogPosts()` — all published posts
- `fetchAdharaBlogPostBySlug(slug)` — single post
- `fetchAdharaRelatedPosts(slug, industry)` — related posts for detail page
- `fetchAdharaAdjacentPosts(slug, publishedAt)` — prev/next nav for detail page
- `fetchAdharaProducts()` — published products (uses public endpoint)
- `fetchAdharaProductBySlug(slug)` — single product
- `subscribeToAdhara(email)` — newsletter signup via Adhara
- `submitAdharaForm(formSlug, data)` — form submission → Adhara CRM lead
- `dbPostToAdharaPost(dbPost)` — converts a Drizzle DB post to the unified `AdharaPost` type

**Fallback strategy:** Every fetch function returns `[]` or `null` if the env vars are missing. The pages then fall back to the local PostgreSQL DB. This means the site works with zero Adhara credentials — you just flip on the vars when ready.

### 2. Blog pages rewired

**`app/blog/page.tsx`**
- Changed from `force-dynamic` to `revalidate = 60` (ISR — cached, revalidates every 60 seconds)
- Tries Adhara first; falls back to DB if no posts returned
- Passes unified `AdharaPost[]` to `BlogList`

**`app/blog/[slug]/page.tsx`**
- Changed from `force-dynamic` to `revalidate = 60`
- Tries Adhara first for both the main post and related/adjacent posts
- Falls back to DB (existing behavior) if Adhara returns nothing
- HTML vs Markdown rendering: posts from Adhara are HTML; posts from DB are markdown. A single condition handles both paths.

### 3. Products page rewired

**`app/products/page.tsx`**
- Tries Adhara products first (`fetchAdharaProducts()` using the public shop API)
- Falls back to existing Notion + Dashboard products if Adhara returns nothing
- Requires `NEXT_PUBLIC_ADHARA_WORKSPACE_SLUG` env var

### 4. Minor type updates

**`components/blog/blog-list.tsx`**
- `id` field: `number` → `string | number` (Adhara uses UUID strings; DB uses integers)

**`components/blog/related-posts.tsx`**
- Removed import of `BlogPost` from Drizzle schema
- Uses a local minimal interface — decouples component from the ORM type

### 5. Image domains added (`next.config.ts`)

- `storage.googleapis.com` — Adhara stores images in Google Cloud Storage
- `api.adharaweb.com` — Adhara proxy-served images
- Both also added to the Content-Security-Policy `img-src` and `connect-src`

### 6. Environment variables (`.env.example`)

Four new vars added:
```
ADHARA_API_KEY=adhara_pk_xxx
ADHARA_WORKSPACE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_ADHARA_BASE_URL=https://api.adharaweb.com
NEXT_PUBLIC_ADHARA_WORKSPACE_SLUG=your-workspace-slug
```

---

## How to Activate

1. Get your API key and workspace details from the Adhara dashboard.
2. Add to `.env.local`:
   ```
   ADHARA_API_KEY=adhara_pk_...
   ADHARA_WORKSPACE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   NEXT_PUBLIC_ADHARA_BASE_URL=https://api.adharaweb.com
   NEXT_PUBLIC_ADHARA_WORKSPACE_SLUG=your-slug
   ```
3. Run `npm run dev` — blog and products will now pull from Adhara.

---

## Migrating Existing Content

### Export blog posts from the local DB

```bash
pip install psycopg2-binary markdown python-dotenv
python3 scripts/export-posts-to-adhara.py
```

This creates `posts-export.json` with all published posts, markdown converted to HTML.

### Seed posts into Adhara

Using the AdharaWebIntegrate CLI tool:

```bash
cd ~/.claude/skills/AdharaWebIntegrate

# Dry run first to preview
ADHARA_PROFILE=lana-victoria python3 -m commands.seed_blog \
  --file /path/to/oceoluxe-web/posts-export.json \
  --author "Kerri Bridgman" \
  --dry-run

# Real seed
ADHARA_PROFILE=lana-victoria python3 -m commands.seed_blog \
  --file /path/to/oceoluxe-web/posts-export.json \
  --author "Kerri Bridgman"
```

Or using the binary (once macOS security is cleared):
```bash
adhara-integrate seed-blog \
  --file posts-export.json \
  --author "Kerri Bridgman" \
  --dir .
```

### Export Notion products (future)

The Notion product import flow (Notion → local DB → Adhara) can be done similarly.
The products from the DB have a `slug`, `title`, `description`, `price`, `coverImageUrl` etc.
These map directly to Adhara's commerce product fields.

---

## Features Connected

| Feature | Status | Notes |
|---------|--------|-------|
| Blog listing | Connected | Adhara primary, DB fallback |
| Blog detail | Connected | Adhara primary, DB fallback |
| Blog SEO metadata | Connected | meta_title, meta_description, og fields |
| Blog ISR caching | Connected | 60-second revalidation (was force-dynamic) |
| Related posts | Connected | Adhara-backed with tag/industry matching |
| Adjacent post navigation | Connected | Sorted by publishedAt from Adhara |
| Products listing | Connected | Adhara primary, DB fallback |
| Newsletter signup API | Connected | `subscribeToAdhara(email)` in `lib/adhara.ts` |
| Form submissions → CRM | Connected | `submitAdharaForm(slug, data)` in `lib/adhara.ts` |
| GCS image serving | Connected | `next/image` domain allowlist updated |

---

## Features Not Yet Wired

These need Adhara backend configuration and/or frontend work to complete.

### Newsletter component wiring

The `InlineEmailSignup` component in blog posts still uses the local `email_list` table. Wire it to `subscribeToAdhara(email)` from `lib/adhara.ts` instead.

**How:** Create a Next.js API route `/api/adhara/newsletter` that calls `subscribeToAdhara(email)`, then update the `InlineEmailSignup` client component to POST to that route.

### Contact/Apply form submissions → Adhara CRM

The contact and application forms (`/apply`, contact page) currently write to the local DB. Wire them to `submitAdharaForm()` so submissions also create leads in Adhara's CRM.

**How:** In the form server actions, call `submitAdharaForm('contact', data)` after (or instead of) the DB write. Requires a form with that slug to exist in Adhara.

### Products payment flow

The product detail page (`app/products/[slug]/page.tsx`) still uses Stripe keys wired directly to this site. Adhara has its own Stripe Connect checkout.

**Decision needed:** Keep this site's Stripe checkout, or switch to Adhara's checkout API (`POST /api/v1/public/checkout/{workspace_slug}/payment-intent`)?

If switching: the cart, checkout, and purchase tracking flows all need to be rewired to Adhara's commerce API.

### Course/LMS content

The courses, lessons, enrollments, and progress tracking all live in the local DB. Adhara has a Courses feature — but migrating this requires:
1. Recreating all courses/modules/lessons in Adhara
2. Rewiring enrollment and progress APIs
3. Migrating student data

### Community posts

The community board (`/studio/community`) has no Adhara equivalent. If Adhara adds a community feature, this can be wired. Otherwise it stays local.

### Email campaigns and drips

`EmailCampaigns` and `EmailDrips` in the local DB. Adhara has email broadcast and drip features. Needs:
1. Migrating templates to Adhara email templates
2. Rewiring send logic to `POST /api/v1/email/send`
3. Moving subscriber sync to Adhara's subscriber list

### Admin dashboard

The `/dashboard/*` routes manage blog, products, users, etc. These currently read/write the local DB. Long-term, content management should go through Adhara's own dashboard. For now, the local admin is still functional as a parallel management interface.

### Scheduling / booking page

The "book a call" links currently use hardcoded Cal.com URLs from the `link_settings` DB table. Adhara has a Scheduling feature. Wire with `fetchAdharaSchedulingLinks()` to serve booking pages dynamically from Adhara.

### Testimonials

No testimonials component exists on the site yet. When added, use:
```
GET /api/v1/public/testimonials/{workspace_slug}/embed
```
or the `spot` API which includes testimonials.

---

## Architecture Notes

```
oceoluxe-web (Next.js 15)
  └── lib/adhara.ts            ← Adhara API client (all Adhara calls go here)
        │
        ├── blog-posts?workspace_id=…   ← Authenticated, server-side only
        │     X-API-Key header
        │
        ├── public/shop/{slug}/products  ← Public, no auth
        │
        └── public/spot/{slug}/newsletter ← Public, no auth

PostgreSQL (Drizzle ORM)
  └── Still used for:
        admin dashboard, auth sessions, user accounts,
        courses, community, purchases, CRM leads (local),
        email campaigns, analytics settings
```

The Adhara client always checks `isAdharaConfigured()` before making API calls. If the env vars are missing, it returns empty arrays/null immediately. This makes local development possible without credentials.

---

## Workspace Info

From `~/.adhara/config` (profile: `lana-victoria`):
- Workspace ID: `76d454f7-8863-4a2b-8f46-71df7ea9ab3d`
- API Key: see config file
- Workspace Slug: **needs to be confirmed** — the storefront may need to be published in the Adhara dashboard before the public endpoints work. Check Adhara Dashboard > Storefront > Publish.
