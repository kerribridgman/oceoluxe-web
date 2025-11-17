import { getPublishedBlogPosts } from '@/lib/db/queries-blogs';
import Link from 'next/link';
import { Metadata } from 'next';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export const metadata: Metadata = {
  title: 'Blog | Patrick Farrell',
  description: 'Read the latest articles on technology, entrepreneurship, and personal development.',
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      <div className="bg-gradient-to-br from-[#1a2332] via-[#1e2838] to-[#1a2332]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-6xl text-[#4a9fd8]/10 font-mono">&lt;/&gt;</div>
        <div className="absolute top-40 right-20 text-6xl text-[#4a9fd8]/10 font-mono">&#123;&#125;</div>
        <div className="absolute bottom-20 left-1/4 text-6xl text-[#4a9fd8]/10 font-mono">( )</div>

        {/* Colored blur effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4a9fd8]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4a9fd8]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-[#4a9fd8]/10 border border-[#4a9fd8]/20 rounded-full">
              <span className="text-[#4a9fd8] text-sm font-medium">Blog</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Insights & Articles
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exploring technology, entrepreneurship, and the journey of building meaningful digital experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-300 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#4a9fd8]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#4a9fd8]/10 h-full flex flex-col">
                  {post.coverImageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#4a9fd8] transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Draft'}
                      </span>
                      {post.readingTimeMinutes && (
                        <span>{post.readingTimeMinutes} min read</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
