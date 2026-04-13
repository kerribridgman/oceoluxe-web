import { getPublishedBlogPosts } from '@/lib/db/queries-blogs';
import { fetchAdharaBlogPosts, dbPostToAdharaPost } from '@/lib/adhara';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { BlogList } from '@/components/blog/blog-list';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export async function generateMetadata() {
  return await getPageMetadata('blog');
}

// ISR: revalidate cached blog list every 60 seconds
export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Blog', url: `${baseUrl}/blog` },
]);

export default async function BlogPage() {
  // Adhara is the primary CMS source. Falls back to local DB if not configured.
  const adharaPosts = await fetchAdharaBlogPosts();
  const posts = adharaPosts.length > 0
    ? adharaPosts
    : (await getPublishedBlogPosts()).map(dbPostToAdharaPost);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4 animate-fade-in-up">
            Journal
          </p>
          <h1 className="font-serif-display text-2xl lg:text-3xl font-normal text-[#3B3937] leading-[1.25] tracking-tight mb-6 animate-fade-in-up">
            Insights on fashion production strategy, factory management, and protecting your brand&apos;s bottom line.
          </h1>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <BlogList posts={posts} postsPerPage={12} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-[#967F71]/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Partnership CTA */}
            <div className="space-y-4">
              <p className="font-script text-2xl italic text-[#CDA7B2]">
                Work Together
              </p>
              <h3 className="font-serif-display text-2xl font-normal text-[#3B3937] tracking-tight">
                Protect Your Production Investment
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                Production risk strategy for fashion founders placing $50K–$500K orders who need senior production oversight.
              </p>
              <Link href="/work-with-oceo-luxe">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide mt-2"
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Studio Systems CTA */}
            <div className="space-y-4">
              <p className="font-script text-2xl italic text-[#CDA7B2]">
                Studio Systems
              </p>
              <h3 className="font-serif-display text-2xl font-normal text-[#3B3937] tracking-tight">
                Operational Systems for Fashion Brands
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                Production frameworks, supplier management tools, and live Q&A. Built from real-world production leadership.
              </p>
              <Link href="/studio-systems">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide mt-2"
                >
                  Explore Studio Systems
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
