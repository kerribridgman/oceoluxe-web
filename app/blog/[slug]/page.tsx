import { getPublishedBlogPostBySlug } from '@/lib/db/queries-blogs';
import { MarkdownRenderer } from '@/components/blog/markdown-renderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const ogImage = post.ogImageUrl || post.coverImageUrl;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    keywords: post.metaKeywords || undefined,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.ogTitle || post.title,
      description: post.ogDescription || post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: post.author ? [post.author] : undefined,
      images: ogImage ? [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.ogTitle || post.title,
      description: post.ogDescription || post.excerpt || '',
      images: ogImage ? [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || undefined,
    },
    robots: post.metaRobots || 'index, follow',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.articleType || 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.coverImageUrl || post.ogImageUrl,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: post.author || 'Patrick Farrell',
    },
    publisher: {
      '@type': 'Person',
      name: 'Patrick Farrell',
    },
    keywords: post.metaKeywords || post.focusKeyword,
    articleSection: post.industry,
    audience: post.targetAudience,
    about: post.keyConcepts,
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        <MarketingHeader />
        {/* Header Navigation */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-gray-600 hover:text-[#4a9fd8] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="w-full h-96 overflow-hidden bg-gray-900">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{post.author || 'Patrick Farrell'}</span>
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={new Date(post.publishedAt).toISOString()}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              )}
              {post.readingTimeMinutes && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mt-6 leading-relaxed border-l-4 border-[#4a9fd8] pl-6 italic">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Article Body */}
          <div className="prose-container">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center text-[#4a9fd8] hover:text-[#3a8fc8] font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to all posts
              </Link>
            </div>
          </footer>
        </article>

        <MarketingFooter />
      </div>
    </>
  );
}
