import { getPublishedBlogPostBySlug } from '@/lib/db/queries-blogs';
import { getRelatedBlogPosts, getRecommendedProducts, getAdjacentPosts } from '@/lib/db/queries-blog-related';
import { MarkdownRenderer } from '@/components/blog/markdown-renderer';
import { RelatedPosts } from '@/components/blog/related-posts';
import { RecommendedProducts } from '@/components/blog/recommended-products';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { PostCta } from '@/components/blog/post-cta';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { InlineEmailSignup } from '@/components/blog/inline-email-signup';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';

// Format date using UTC to avoid timezone shifts (sync stores dates at noon Eastern = 5pm UTC)
function formatBlogDate(date: Date | string, format: 'short' | 'long' = 'long'): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';
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
          url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
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
      images: ogImage ? [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || `${siteUrl}/blog/${slug}`,
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

  const [relatedPosts, recommendedProducts, adjacentPosts] = await Promise.all([
    getRelatedBlogPosts(post.id, post.industry),
    getRecommendedProducts(),
    post.publishedAt ? getAdjacentPosts(post.id, new Date(post.publishedAt)) : Promise.resolve({ previous: null, next: null }),
  ]);

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

      <MarketingShell>

        {/* Back Navigation */}
        <div className="border-b border-[var(--color-taupe)]/10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-[var(--color-bone)] hover:text-[var(--color-cream)] transition-colors font-light"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Link>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="w-full h-80 lg:h-96 overflow-hidden relative bg-[var(--color-charcoal)]">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              quality={75}
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 py-16">
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-light text-[var(--color-cream)] mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-bone)] font-light">
              <span className="text-[var(--color-cream)]">{post.author || 'Kerri Bridgman'}</span>
              {post.publishedAt && (
                <>
                  <span className="text-[var(--color-dusty-rose)]">–</span>
                  <time dateTime={new Date(post.publishedAt).toISOString()}>
                    {formatBlogDate(post.publishedAt)}
                  </time>
                </>
              )}
              {post.readingTimeMinutes && (
                <>
                  <span className="text-[var(--color-dusty-rose)]">–</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-[var(--color-bone)] mt-8 leading-relaxed border-l-2 border-[var(--color-dusty-rose)] pl-6 font-light italic">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Table of Contents */}
          <TableOfContents markdown={post.content} />

          {/* Article Body */}
          <div className="prose-container">
            <MarkdownRenderer content={post.content} excerpt={post.excerpt || undefined} />
          </div>

          {/* Contextual CTA */}
          <PostCta />

          {/* Inline Email Signup */}
          <InlineEmailSignup />

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-[var(--color-taupe)]/10">
            <Link
              href="/blog"
              className="inline-flex items-center text-[var(--color-cream)] hover:text-[var(--color-dusty-rose)] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Link>

            {(adjacentPosts.previous || adjacentPosts.next) && (
              <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-[var(--color-taupe)]/10">
                <div>
                  {adjacentPosts.previous && (
                    <Link
                      href={`/blog/${adjacentPosts.previous.slug}`}
                      className="group block"
                    >
                      <p className="text-xs text-[var(--color-taupe)] uppercase tracking-wider mb-1">Previous</p>
                      <p className="text-[var(--color-cream)] group-hover:text-[var(--color-dusty-rose)] transition-colors font-medium leading-snug">
                        <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                        {adjacentPosts.previous.title}
                      </p>
                    </Link>
                  )}
                </div>
                <div className="text-right">
                  {adjacentPosts.next && (
                    <Link
                      href={`/blog/${adjacentPosts.next.slug}`}
                      className="group block"
                    >
                      <p className="text-xs text-[var(--color-taupe)] uppercase tracking-wider mb-1">Next</p>
                      <p className="text-[var(--color-cream)] group-hover:text-[var(--color-dusty-rose)] transition-colors font-medium leading-snug">
                        {adjacentPosts.next.title}
                        <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </footer>
        </article>

        <RelatedPosts posts={relatedPosts} />
        <RecommendedProducts products={recommendedProducts} />

      </MarketingShell>
    </>
  );
}
