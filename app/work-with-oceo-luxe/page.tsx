import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { PageHeader } from '@/components/marketing/page-header';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { AnimateIn } from '@/components/animate-in';

export async function generateMetadata() {
  return await getPageMetadata('work-with-oceo-luxe');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Work With Oceo Luxe', url: `${baseUrl}/work-with-oceo-luxe` },
]);

export default async function WorkWithOceoLuxePage() {
  return (
    <MarketingShell>
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />

      {/* Hero Section */}
      <PageHeader slotId="work-hero-bg" height="60vh">
        <AnimateIn animation="fade-in">
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[var(--color-cream)] leading-[1.15] tracking-tight mb-8 text-glow-warm">
            Three Operational Depths, One Standard
          </h1>
        </AnimateIn>
        <AnimateIn animation="fade-up" delay={200}>
          <p className="text-xl text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
            Oceo Luxe meets founders at three levels of operational depth. The level is matched to where the business is, not where the founder wants it to be. The standard of work is the same across all three.
          </p>
        </AnimateIn>
      </PageHeader>

      {/* Tier Blocks — Three Across */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)] ambient-glow-taupe">
        <div className="max-w-6xl mx-auto px-6 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Private Operational Partnership */}
            <AnimateIn delay={100}>
              <div className="flex flex-col bg-[var(--color-ink)] border border-[var(--color-taupe)]/20 rounded-xl p-8 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(201,160,160,0.3)] hover:border-[var(--color-dusty-rose)]/30">
                <h2 className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-cream)] mb-4 tracking-tight">
                  Private Operational Partnership
                </h2>
                <p className="text-[var(--color-bone)] font-light leading-relaxed mb-6 flex-1">
                  An embedded operator inside the business. Long-form, ongoing, shaped to the company. For founders who need a partner running the operational backbone of a growing business.
                </p>
                <Link href="/operational-partnership" className="inline-flex items-center text-[var(--color-cream)] text-sm font-medium tracking-wider uppercase hover:text-[var(--color-dusty-rose)] transition-colors mt-auto">
                  Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimateIn>

            {/* Strategic Operational Alignment */}
            <AnimateIn delay={200}>
              <div className="flex flex-col bg-[var(--color-ink)] border border-[var(--color-taupe)]/20 rounded-xl p-8 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(201,160,160,0.3)] hover:border-[var(--color-dusty-rose)]/30">
                <h2 className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-cream)] mb-4 tracking-tight">
                  Strategic Operational Alignment
                </h2>
                <p className="text-[var(--color-bone)] font-light leading-relaxed mb-6 flex-1">
                  A defined engagement for founders who need a focused operational reset. Bounded scope. The studio maps the business, identifies the fractures, and rebuilds the systems slowing growth.
                </p>
                <Link href="/strategic-operational-alignment" className="inline-flex items-center text-[var(--color-cream)] text-sm font-medium tracking-wider uppercase hover:text-[var(--color-dusty-rose)] transition-colors mt-auto">
                  Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimateIn>

            {/* Studio Systems */}
            <AnimateIn delay={300}>
              <div className="flex flex-col bg-[var(--color-ink)] border border-[var(--color-taupe)]/20 rounded-xl p-8 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(201,160,160,0.3)] hover:border-[var(--color-dusty-rose)]/30">
                <h2 className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-cream)] mb-4 tracking-tight">
                  Studio Systems
                </h2>
                <p className="text-[var(--color-bone)] font-light leading-relaxed mb-6 flex-1">
                  Hands-on operational and web build support, by the hour. Capped at five hours per week so the work stays focused and the standard stays high. The most direct way to put an operator inside the business without committing to a long-form partnership.
                </p>
                <Link href="/studio-systems" className="inline-flex items-center text-[var(--color-cream)] text-sm font-medium tracking-wider uppercase hover:text-[var(--color-dusty-rose)] transition-colors mt-auto">
                  Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimateIn>
          </div>

        </div>
      </section>
    </MarketingShell>
  );
}
