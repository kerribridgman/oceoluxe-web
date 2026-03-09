import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/db/schema';

function formatBlogDate(date: Date | string): string {
  const d = new Date(date);
  const adjusted = new Date(d.getTime() + 12 * 60 * 60 * 1000);
  return adjusted.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-[#967F71]/10 bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-light text-[#3B3937] mb-8">Keep Reading</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {posts.map((post) => (
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
                      sizes="80px"
                      className="object-cover"
                      quality={75}
                    />
                  </div>
                )}
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xs text-[#CDA7B2] font-medium uppercase tracking-wider">
                    {post.publishedAt ? formatBlogDate(post.publishedAt) : 'Draft'}
                  </p>
                  <h3 className="text-base font-medium text-[#3B3937] group-hover:text-[#CDA7B2] transition-colors leading-snug">
                    {post.title}
                  </h3>
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
      </div>
    </section>
  );
}
