import { getPublishedBlogPostBySlug } from '@/lib/db/queries-blogs';
import { MarkdownRenderer } from '@/components/blog/markdown-renderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';

// Format date using UTC to avoid timezone shifts for date-only values
function formatBlogDate(date: Date | string, format: 'short' | 'long' = 'long'): string {
  const d = new Date(date);
  // Add 12 hours to prevent timezone shift causing day change
  const adjusted = new Date(d.getTime() + 12 * 60 * 60 * 1000);
  return adjusted.toLocaleDateString('en-US', {
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

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
      name: post.author || 'Kerri Bridgman',
    },
    publisher: {
      '@type': 'Person',
      name: 'Kerri Bridgman',
    },
    keywords: post.metaKeywords || post.focusKeyword,
    articleSection: post.industry,
    audience: post.targetAudience,
    about: post.keyConcepts,
  };

  const blogBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: blogBaseUrl },
    { name: 'Blog', url: `${blogBaseUrl}/blog` },
    { name: post.title, url: `${blogBaseUrl}/blog/${slug}` },
  ]);

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-[#faf8f5]">
        <MarketingHeader />

        {/* Back Navigation */}
        <div className="bg-[#faf8f5] border-b border-[#967F71]/10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-[#967F71] hover:text-[#3B3937] transition-colors font-light"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Link>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="w-full h-80 lg:h-96 overflow-hidden relative bg-[#f5f0ea]">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              quality={95}
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 py-16">
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#967F71] font-light">
              <span className="text-[#3B3937]">{post.author || 'Kerri Bridgman'}</span>
              {post.publishedAt && (
                <>
                  <span className="text-[#CDA7B2]">—</span>
                  <time dateTime={new Date(post.publishedAt).toISOString()}>
                    {formatBlogDate(post.publishedAt)}
                  </time>
                </>
              )}
              {post.readingTimeMinutes && (
                <>
                  <span className="text-[#CDA7B2]">—</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-[#967F71] mt-8 leading-relaxed border-l-2 border-[#CDA7B2] pl-6 font-light italic">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Article Body */}
          <div className="prose-container">
            <MarkdownRenderer content={post.content} excerpt={post.excerpt || undefined} />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-[#967F71]/10">
            <Link
              href="/blog"
              className="inline-flex items-center text-[#3B3937] hover:text-[#CDA7B2] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Link>
          </footer>
        </article>

        <MarketingFooter />
      </div>
    </>
  );
}
