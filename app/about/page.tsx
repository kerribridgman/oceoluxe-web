import Image from 'next/image';
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
  return await getPageMetadata('about');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'About', url: `${baseUrl}/about` },
]);

export default async function AboutPage() {
  return (
    <MarketingShell>
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />

      {/* Hero Section */}
      <PageHeader slotId="about-hero-bg" height="60vh">
        <AnimateIn animation="fade-in">
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[var(--color-cream)] leading-[1.15] tracking-tight mb-6 text-glow-warm">
            Oceo Luxe Was Built to Solve the Operational Layer
          </h1>
        </AnimateIn>
        <AnimateIn animation="fade-up" delay={200}>
          <p className="font-script text-2xl italic text-[var(--color-dusty-rose)]">
            Structure does not limit creativity, it protects it.
          </p>
        </AnimateIn>
      </PageHeader>

      {/* Body 1 — Foundation + Portrait */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            <AnimateIn className="flex-1">
              <div className="space-y-6 text-xl text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
                <p>
                  Oceo Luxe was founded by Kerri Bridgman. The studio exists because most businesses do not fail at the idea. They fail at the operational layer underneath it. The work is to absorb that layer so the founder can stay in the work only they can do.
                </p>
                <p>
                  Kerri spent the early part of her career inside the production operations of brands where margin compression, supply chain fragility, and tight timelines made operational precision non-negotiable. Production management at Michael Kors. Production coordination at The Shade Store. Project engineering at Atlantic Infra. A degree in Production Management with a minor in Economics from FIT. The pattern across every role was the same: take a chaotic operational environment, build the structure underneath it, and let the creative or commercial work breathe.
                </p>
              </div>
            </AnimateIn>
            <AnimateIn animation="fade-in" className="w-full lg:w-[360px] lg:flex-shrink-0">
              <div className="relative aspect-[2/3] w-full mx-auto lg:mx-0 overflow-hidden rounded-lg">
                <Image
                  src="/images/Kerri-13.webp"
                  alt="Kerri Bridgman, founder of Oceo Luxe, in a champagne dress"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 320px, 360px"
                  priority
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Body 2 — Philosophy */}
      <section className="py-20 lg:py-28 bg-[var(--color-ink)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-6 text-xl text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                The work at Oceo Luxe is the same work, applied beyond fashion. Founders in any industry hit the same operational ceiling. The systems that worked at one stage stop working at the next. Oceo Luxe is the operational partner that helps them cross that line without losing the business in the process.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center">
              <Link href="/apply">
                <Button
                  size="lg"
                  className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5"
                >
                  Apply to Work Together
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
