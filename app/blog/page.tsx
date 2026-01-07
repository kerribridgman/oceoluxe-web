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
      <section className="bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6">
            Journal
          </p>
          <h1 className="text-4xl lg:text-5xl font-light text-[#3B3937] leading-[1.15] tracking-tight mb-6">
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
