import { getPublishedBlogPosts } from '@/lib/db/queries-blogs';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { BlogList } from '@/components/blog/blog-list';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('blog');
}

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24 relative">
          {/* Decorative circles */}
          <div
            className="absolute top-8 right-0 w-20 h-20 rounded-full bg-[#CDA7B2] opacity-20 animate-float hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 -left-16 w-14 h-14 rounded-full bg-[#967F71] opacity-15 animate-float-slow hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-4 -left-8 w-8 h-8 rounded-full bg-[#CDA7B2] opacity-25 animate-float-delayed hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-12 right-12 w-12 h-12 rounded-full bg-[#967F71] opacity-10 animate-float hidden lg:block"
            aria-hidden="true"
          />

          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Journal
          </p>
          {/* Decorative line under tagline */}
          <div className="w-16 h-0.5 bg-[#CDA7B2] opacity-60 mb-6" aria-hidden="true" />
          <h1 className="text-4xl lg:text-5xl font-light text-[#3B3937] leading-[1.15] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Insights on fashion production and building sustainable creative ventures.
          </h1>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <BlogList posts={posts} postsPerPage={12} />
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
