
you have access in this project to a Next.js project that is connected to postgres. We are going to use
  it to build a simple website with a blog for now. This is going to build my personal website
  "oceoluxe.com" You are going to rebuild the home page with information from my current website
  https://patrickfarrell.life and I want you to also build a blog feature for this site based on the blog
  engine in the make-money-from-coding admin blog, you have access to this code base as a separate folder
  right now, pull that admin blog into this system. Also create a services page based on
  https://patrickfarrell.life keep this simple for now with just a main website, services page and blog. if
  you have anymore questions please let me know before you build 


Implementation Plan: oceoluxe.com

     Phase 1: Database Schema & Setup

     - Create blog_posts table with full SEO/OG fields (title, slug, content, excerpt, cover image, OG image, meta tags, etc.)
     - Add Drizzle migration for blog schema
     - Install dependencies: react-markdown, remark-gfm, rehype-raw, rehype-sanitize

     Phase 2: Copy & Adapt Blog Engine

     - Copy markdown-renderer.tsx from make-money-from-coding
     - Copy blog queries (queries-blogs.ts) - simplified for single-tier (no user blogs, just admin)
     - Set up /uploads/blog/ directory for images
     - Create upload API route for blog images

     Phase 3: Admin Blog Interface

     - Build /dashboard/blog - list all blog posts (published/drafts)
     - Build /dashboard/blog/new - create new post with markdown editor, image uploads, SEO fields
     - Build /dashboard/blog/[id]/edit - edit existing posts
     - Add "Delete" and "Publish/Unpublish" actions

     Phase 4: Public Blog Pages

     - Build /blog - blog listing with cards, hero section, filtering
     - Build /blog/[slug] - individual post with full OG/SEO meta tags, JSON-LD structured data
     - Implement hero sections with gradient backgrounds (similar to make-money-from-coding style)

     Phase 5: Marketing Pages

     - Home page (/): Hero section with your tagline, bio section, services overview, CTA buttons
     - Services page (/services): Three service cards (AI/App Consulting, 1:1 Coaching, Entrepreneur Circle) with CTAs
     - Build reusable components: ServiceCard, HeroSection, CTAButton

     Phase 6: Navigation & Layout

     - Update marketing header with navigation: Home, Services, Blog, About
     - Add social links (Instagram, LinkedIn) to footer
     - Ensure responsive design across all pages

     Phase 7: SEO & Polish

     - Add OG image generation for blog posts
     - Create sitemap.xml and robots.txt
     - Implement JSON-LD structured data for blog posts
     - Set up reading time calculation
     - Add analytics integration

     Key Features

     ✅ Full admin blog editor with markdown support
     ✅ Image uploads for cover and OG images
     ✅ Comprehensive SEO meta tags per post
     ✅ Auto-slug generation from titles
     ✅ Draft/publish workflow
     ✅ Hero sections with modern gradients
     ✅ Tailwind CSS styling throughout
  ⎿  PostToolUse:ExitPlanMode hook error



