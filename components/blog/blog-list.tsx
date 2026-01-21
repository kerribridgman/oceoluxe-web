'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  readingTimeMinutes: number | null;
}

interface BlogListProps {
  posts: BlogPost[];
  postsPerPage?: number;
}

export function BlogList({ posts, postsPerPage = 12 }: BlogListProps) {
  const [visibleCount, setVisibleCount] = useState(postsPerPage);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + postsPerPage);
  };

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-light text-[#3B3937] mb-2">No posts yet</h2>
        <p className="text-[#967F71] font-light">Check back soon for insights and articles.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
        {visiblePosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="flex gap-4">
              {post.coverImageUrl && (
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative bg-[#f5f0ea]">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    quality={75}
                  />
                </div>
              )}
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs text-[#CDA7B2] font-medium uppercase tracking-wider">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        timeZone: 'America/New_York',
                      })
                    : 'Draft'}
                </p>
                <h2 className="text-base font-medium text-[#3B3937] group-hover:text-[#CDA7B2] transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-[#967F71] font-light leading-relaxed line-clamp-2">
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
            className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
          >
            See More
          </Button>
        </div>
      )}
    </>
  );
}
