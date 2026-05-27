import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { AnimateIn } from '@/components/animate-in';

export async function generateMetadata() {
  return await getPageMetadata('studio-systems');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Studio Systems', url: `${baseUrl}/studio-systems` },
]);

export default async function StudioSystemsPage() {
  return (
    <MarketingShell>
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn animation="fade-in">
            <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[var(--color-cream)] leading-[1.15] tracking-tight mb-4 text-glow-warm">
              Studio Systems
            </h1>
            <p className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-bone)] mb-8">
              Hands-on operational and web build support, by the hour.
            </p>
            <p className="text-sm tracking-wider uppercase text-[var(--color-bone)] font-light">
              Maximum five hours per week.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 1 */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Studio Systems is for founders who need a focused operator inside their business for a few hours a week. Not a partnership, not a membership. A direct working relationship measured in hours, capped at five per week so the work stays high-quality and the calendar stays sustainable on both sides.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 2 — What the hours cover */}
      <section className="py-20 lg:py-28 bg-[var(--color-ink)] ambient-glow-rose">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                The hours are split between operational support and web build support, shaped to what the business actually needs that week. One week the work might be vendor coordination, decision architecture, and weekly operational rhythm. Another week it might be mapping the structure of a website, planning a build, or laying the groundwork for the digital infrastructure the business is about to need. The point is to put real operational and technical hands on the work without committing the founder to a long-form partnership.
              </p>

              {/* Pull-quote */}
              <blockquote className="border-l-2 border-[var(--color-dusty-rose)] pl-6 my-10 py-4 bg-[var(--color-dusty-rose)]/5 rounded-r-lg">
                <p className="font-script text-xl lg:text-2xl italic text-[var(--color-dusty-rose)] leading-relaxed">
                  Real operational and technical hands on the work.
                </p>
              </blockquote>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 3 — Where it leads */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Studio Systems often becomes the first step in something larger. Founders who start here frequently move into a deeper build of their digital infrastructure once the operational picture is clear and the systems underneath the business are ready to support what comes next.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 4 — Who it is for */}
      <section className="py-20 lg:py-28 bg-[var(--color-ink)] ambient-glow-taupe">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Founders who are building, growing, and ready to bring an operator into the work for a few focused hours a week. Founders who want their vision to take shape in real systems and real infrastructure, not slide decks and not theory.
              </p>
            </div>
            <div className="mt-12">
              <Link href="/apply">
                <Button
                  size="lg"
                  className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5"
                >
                  Start with Studio Systems
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </MarketingShell>
  );
}
