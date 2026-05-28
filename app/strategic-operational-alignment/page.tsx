import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { PageHeader } from '@/components/marketing/page-header';
import { MediaSlot } from '@/components/marketing/media-slot';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { AnimateIn } from '@/components/animate-in';

export async function generateMetadata() {
  return await getPageMetadata('strategic-operational-alignment');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Work With Oceo Luxe', url: `${baseUrl}/work-with-oceo-luxe` },
  { name: 'Strategic Operational Alignment', url: `${baseUrl}/strategic-operational-alignment` },
]);

const serviceJsonLd = getServiceJsonLd([{
  name: 'Strategic Operational Alignment',
  description: 'A focused operational reset for founders. Bounded scope engagement where Oceo Luxe maps the business, identifies operational fractures, and rebuilds the systems slowing growth.',
  url: `${baseUrl}/strategic-operational-alignment`,
}]);

export default async function StrategicOperationalAlignmentPage() {
  return (
    <MarketingShell>
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <JsonLdScript data={serviceJsonLd as unknown as Record<string, unknown>} />

      {/* Hero Section */}
      <PageHeader slotId="align-hero-bg" height="60vh">
        <AnimateIn animation="fade-in">
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[var(--color-cream)] leading-[1.15] tracking-tight mb-4 text-glow-warm">
            Strategic Operational Alignment
          </h1>
        </AnimateIn>
        <AnimateIn animation="fade-up" delay={200}>
          <p className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-bone)] mb-8">
            A focused operational reset.
          </p>
        </AnimateIn>
        <AnimateIn animation="fade-up" delay={400}>
          <p className="text-sm tracking-wider uppercase text-[var(--color-bone)] font-light">
            Flat engagement.
          </p>
        </AnimateIn>
      </PageHeader>

      {/* Body Section 1 */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Strategic Operational Alignment is a defined engagement for founders who need an operational reset. Not a partnership, not a membership. A bounded scope of work where Oceo Luxe maps the current state of the business, identifies the operational fractures, and rebuilds the systems that are slowing growth.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Mid-page editorial image */}
      <section className="py-20 lg:py-28 bg-[var(--color-ink)]">
        <div className="max-w-4xl mx-auto px-6">
          <MediaSlot slotId="align-mid-image" className="aspect-[16/10] w-full" />
        </div>
      </section>

      {/* Body Section 2 — What you walk away with */}
      <section className="py-20 lg:py-28 bg-[var(--color-ink)] ambient-glow-taupe">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Every engagement ends with a documented operational architecture the founder owns. The systems built during the engagement are designed to keep working without Oceo Luxe holding them. The point of the alignment is to leave the founder with structure, not dependency.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn animation="reveal-quote">
            <blockquote className="border-l-2 border-[var(--color-dusty-rose)] pl-6 my-10 py-4 bg-[var(--color-dusty-rose)]/5 rounded-r-lg" style={{ maxWidth: '65ch' }}>
              <p className="font-script text-xl lg:text-2xl italic text-[var(--color-dusty-rose)] leading-relaxed">
                The point of the alignment is to leave the founder with structure, not dependency.
              </p>
            </blockquote>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 3 — Who it is for */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                This engagement is for founders who can identify the operational problem but do not have the time or the framework to solve it. Most often the business has grown faster than its systems, and the founder needs an operator to come in, build the structure, and leave it stable.
              </p>
            </div>
            <div className="mt-12">
              <Link href="/apply">
                <Button
                  size="lg"
                  className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5"
                >
                  Apply for Strategic Alignment
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
