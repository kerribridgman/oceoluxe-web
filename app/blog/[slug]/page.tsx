import {
  fetchAdharaBlogPostBySlug,
  fetchAdharaRelatedPosts,
  fetchAdharaAdjacentPosts,
  dbPostToAdharaPost,
  type AdharaPost,
} from '@/lib/adhara';
import { getPublishedBlogPostBySlug } from '@/lib/db/queries-blogs';
import {
  getRelatedBlogPosts,
  getRecommendedProducts,
  getAdjacentPosts,
} from '@/lib/db/queries-blog-related';
import { MarkdownRenderer } from '@/components/blog/markdown-renderer';
import { RelatedPosts } from '@/components/blog/related-posts';
import { RecommendedProducts } from '@/components/blog/recommended-products';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { PostCta } from '@/components/blog/post-cta';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { InlineEmailSignup } from '@/components/blog/inline-email-signup';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';

// ISR: revalidate cached blog post pages every 60 seconds
export const revalidate = 60;

// Format date using UTC to avoid timezone shifts
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Try Adhara first, fall back to DB
  const adharaPost = await fetchAdharaBlogPostBySlug(slug);
  const post: AdharaPost | null = adharaPost ?? await getPublishedBlogPostBySlug(slug).then(
    (dbPost) => dbPost ? dbPostToAdharaPost(dbPost) : null
  );

  if (!post) {
    return { title: 'Post Not Found' };
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
      publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
      authors: post.author ? [post.author] : undefined,
      images: ogImage
        ? [{ url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`, width: 1200, height: 630, alt: post.title }]
        : undefined,
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

  // ── Data fetching: Adhara primary, DB fallback ──────────────────────────────
  const adharaPost = await fetchAdharaBlogPostBySlug(slug);

  let post: AdharaPost;
  let relatedPosts: AdharaPost[];
  let recommendedProducts: Awaited<ReturnType<typeof getRecommendedProducts>>;
  let adjacentPosts: {
    previous: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
  };

  if (adharaPost) {
    // Adhara path
    post = adharaPost;
    [relatedPosts, recommendedProducts, adjacentPosts] = await Promise.all([
      fetchAdharaRelatedPosts(slug, post.industry),
      getRecommendedProducts(),
      fetchAdharaAdjacentPosts(slug, post.publishedAt),
    ]);
  } else {
    // DB fallback path
    const dbPost = await getPublishedBlogPostBySlug(slug);
    if (!dbPost) notFound();

    const [dbRelated, dbProducts, dbAdjacent] = await Promise.all([
      getRelatedBlogPosts(dbPost.id, dbPost.industry),
      getRecommendedProducts(),
      dbPost.publishedAt
        ? getAdjacentPosts(dbPost.id, new Date(dbPost.publishedAt))
        : Promise.resolve({ previous: null, next: null }),
    ]);

    post = dbPostToAdharaPost(dbPost);
    relatedPosts = dbRelated.map(dbPostToAdharaPost);
    recommendedProducts = dbProducts;
    adjacentPosts = dbAdjacent;
  }

  // ── JSON-LD ─────────────────────────────────────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.articleType || 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.coverImageUrl || post.ogImageUrl,
    datePublished: post.publishedAt ? post.publishedAt.toISOString() : undefined,
    dateModified: post.updatedAt ? post.updatedAt.toISOString() : undefined,
    author: { '@type': 'Person', name: post.author || 'Kerri Bridgman' },
    publisher: { '@type': 'Person', name: 'Kerri Bridgman' },
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
            <h1 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#967F71] font-light">
              <span className="text-[#3B3937]">{post.author || 'Kerri Bridgman'}</span>
              {post.publishedAt && (
                <>
                  <span className="text-[#CDA7B2]">–</span>
                  <time dateTime={post.publishedAt.toISOString()}>
                    {formatBlogDate(post.publishedAt)}
                  </time>
                </>
              )}
              {post.readingTimeMinutes && (
                <>
                  <span className="text-[#CDA7B2]">–</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </>
              )}
            </div>

            {post.excerpt && (
              <p className="text-xl text-[#967F71] mt-8 leading-relaxed border-l-2 border-[#CDA7B2] pl-6 font-light italic">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Table of Contents — only for markdown (Adhara HTML has heading anchors inline) */}
          {!post.contentIsHtml && (
            <TableOfContents markdown={post.content} />
          )}

          {/* Article Body */}
          <div className="prose-container">
            {post.contentIsHtml ? (
              // Adhara CMS content is HTML — render directly with prose styles
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-orange-600 prose-strong:text-gray-900 prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              // Legacy DB content is Markdown
              <MarkdownRenderer content={post.content} excerpt={post.excerpt || undefined} />
            )}
          </div>

          <PostCta />
          <InlineEmailSignup />

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-[#967F71]/10">
            <Link
              href="/blog"
              className="inline-flex items-center text-[#3B3937] hover:text-[#CDA7B2] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Link>

            {(adjacentPosts.previous || adjacentPosts.next) && (
              <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-[#967F71]/10">
                <div>
                  {adjacentPosts.previous && (
                    <Link href={`/blog/${adjacentPosts.previous.slug}`} className="group block">
                      <p className="text-xs text-[#967F71] uppercase tracking-wider mb-1">Previous</p>
                      <p className="text-[#3B3937] group-hover:text-[#CDA7B2] transition-colors font-medium leading-snug">
                        <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                        {adjacentPosts.previous.title}
                      </p>
                    </Link>
                  )}
                </div>
                <div className="text-right">
                  {adjacentPosts.next && (
                    <Link href={`/blog/${adjacentPosts.next.slug}`} className="group block">
                      <p className="text-xs text-[#967F71] uppercase tracking-wider mb-1">Next</p>
                      <p className="text-[#3B3937] group-hover:text-[#CDA7B2] transition-colors font-medium leading-snug">
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

        <MarketingFooter />
      </div>
    </>
  );
}
