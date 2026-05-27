'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Format date using UTC to avoid timezone shifts (sync stores dates at noon Eastern = 5pm UTC)
function formatBlogDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  readingTimeMinutes: number | null;
  industry?: string | null;
}

interface BlogListProps {
  posts: BlogPost[];
  postsPerPage?: number;
}

export function BlogList({ posts, postsPerPage = 12 }: BlogListProps) {
  const [visibleCount, setVisibleCount] = useState(postsPerPage);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  const industries = Array.from(
    new Set(posts.map((p) => p.industry).filter((i): i is string => !!i))
  ).sort();

  const filteredPosts = activeIndustry
    ? posts.filter((p) => p.industry === activeIndustry)
    : posts;

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + postsPerPage);
  };

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-light text-[var(--color-cream)] mb-2">No posts yet</h2>
        <p className="text-[var(--color-bone)] font-light">Check back soon for insights and articles.</p>
      </div>
    );
  }

  return (
    <>
      {industries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => { setActiveIndustry(null); setVisibleCount(postsPerPage); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeIndustry === null
                ? 'bg-[var(--color-dusty-rose)]/10 text-[var(--color-dusty-rose)]'
                : 'text-[var(--color-bone)] hover:text-[var(--color-dusty-rose)]'
            }`}
          >
            All
          </button>
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => { setActiveIndustry(industry); setVisibleCount(postsPerPage); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeIndustry === industry
                  ? 'bg-[var(--color-dusty-rose)]/10 text-[var(--color-dusty-rose)]'
                  : 'text-[var(--color-bone)] hover:text-[var(--color-dusty-rose)]'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
        {visiblePosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="flex gap-4">
              {post.coverImageUrl && (
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative bg-[var(--color-charcoal)]">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                    quality={75}
                  />
                </div>
              )}
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs text-[var(--color-dusty-rose)] font-medium uppercase tracking-wider">
                  {post.publishedAt ? formatBlogDate(post.publishedAt) : 'Draft'}
                </p>
                <h2 className="text-base font-medium text-[var(--color-cream)] group-hover:text-[var(--color-dusty-rose)] transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-[var(--color-bone)] font-light leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSeeMore}
            className="border-[var(--color-taupe)] text-[var(--color-bone)] hover:bg-[var(--color-taupe)] hover:text-[var(--color-cream)] h-12 px-8 text-base font-normal tracking-wide"
          >
            See More
          </Button>
        </div>
      )}
    </>
  );
}
