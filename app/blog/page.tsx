import { getPublishedBlogPosts } from '@/lib/db/queries-blogs';
import { MarketingShell } from '@/components/marketing/marketing-shell';
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

export const dynamic = 'force-dynamic';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Blog', url: `${baseUrl}/blog` },
]);

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <MarketingShell>
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />

      {/* Hero Section */}
      <section className="overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
          <p className="font-script text-3xl lg:text-4xl italic text-[var(--color-dusty-rose)] mb-4 animate-fade-in-up">
            Journal
          </p>
          <h1 className="font-serif-display text-2xl lg:text-3xl font-normal text-[var(--color-cream)] leading-[1.25] tracking-tight mb-6 animate-fade-in-up">
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
      <section className="py-20 bg-[var(--color-charcoal)] border-t border-[var(--color-taupe)]/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Partnership CTA */}
            <div className="space-y-4">
              <p className="font-script text-2xl italic text-[var(--color-dusty-rose)]">
                Work Together
              </p>
              <h3 className="font-serif-display text-2xl font-normal text-[var(--color-cream)] tracking-tight">
                Protect Your Production Investment
              </h3>
              <p className="text-[var(--color-bone)] font-light leading-relaxed">
                Production risk strategy for fashion founders placing $50K–$500K orders who need senior production oversight.
              </p>
              <Link href="/work-with-oceo-luxe">
                <Button
                  size="lg"
                  className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide mt-2"
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Studio Systems CTA */}
            <div className="space-y-4">
              <p className="font-script text-2xl italic text-[var(--color-dusty-rose)]">
                Studio Systems
              </p>
              <h3 className="font-serif-display text-2xl font-normal text-[var(--color-cream)] tracking-tight">
                Operational Systems for Fashion Brands
              </h3>
              <p className="text-[var(--color-bone)] font-light leading-relaxed">
                Production frameworks, supplier management tools, and live Q&A. Built from real-world production leadership.
              </p>
              <Link href="/studio-systems">
                <Button
                  size="lg"
                  className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide mt-2"
                >
                  Explore Studio Systems
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
