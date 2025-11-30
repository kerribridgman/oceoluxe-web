import { getPublishedBlogPosts } from '@/lib/db/queries-blogs';
import Link from 'next/link';
import { Metadata } from 'next';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { Calendar, Clock, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | Oceo Luxe',
  description: 'Insights on fashion production, business systems, and building sustainable creative ventures.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#f5f0ea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 bg-[#CDA7B2]/10 border border-[#CDA7B2]/20 rounded-full">
              <BookOpen className="w-4 h-4 text-[#CDA7B2]" />
              <span className="text-[#CDA7B2] text-sm font-medium">Blog</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-light text-[#3B3937] mb-6">
              Insights & Articles
            </h1>
            <p className="text-lg text-[#967F71] max-w-3xl mx-auto font-light leading-relaxed">
              Exploring fashion production, business systems, and the journey of building sustainable creative ventures.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-[#967F71] mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-2">No Blog Posts Yet</h2>
            <p className="text-[#967F71] font-light">Check back soon for insights and articles!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-[#967F71]/10">
                  <div className="aspect-video overflow-hidden">
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#f5f0ea] via-[#faf8f5] to-[#CDA7B2]/10 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-20 h-20 text-[#CDA7B2]/30" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#CDA7B2]/5 to-transparent"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-3 group-hover:text-[#CDA7B2] transition-colors leading-tight">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[#967F71] mb-4 line-clamp-3 font-light leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#967F71] pt-4 border-t border-[#967F71]/10">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span className="font-light">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Draft'}
                        </span>
                      </div>
                      {post.readingTimeMinutes && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span className="font-light">{post.readingTimeMinutes} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <MarketingFooter />
    </div>
  );
}
