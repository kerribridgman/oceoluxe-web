import { getPublishedBlogPosts } from '@/lib/db/queries-blogs';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { BlogList } from '@/components/blog/blog-list';
import { getPageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-[#967F71]/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Quiz CTA */}
            <div className="space-y-4">
              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium">
                Take the Quiz
              </p>
              <h3 className="text-2xl font-light text-[#3B3937] tracking-tight">
                Find Your Designer Archetype
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                Discover your production style and get personalized recommendations for building systems that match how you work.
              </p>
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-12 px-8 text-base font-normal tracking-wide mt-2"
                >
                  Take the Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Services CTA */}
            <div className="space-y-4">
              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium">
                Work With Us
              </p>
              <h3 className="text-2xl font-light text-[#3B3937] tracking-tight">
                Need Production Systems?
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                From factory communication setup to full production dashboards, we build the systems so you can focus on designing.
              </p>
              <Link href="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide mt-2"
                >
                  View Services
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
