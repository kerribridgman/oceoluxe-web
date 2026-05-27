import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { AnimateIn } from '@/components/animate-in';

export async function generateMetadata() {
  return await getPageMetadata('operational-partnership');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Work With Oceo Luxe', url: `${baseUrl}/work-with-oceo-luxe` },
  { name: 'Operational Partnership', url: `${baseUrl}/operational-partnership` },
]);

const serviceJsonLd = getServiceJsonLd([{
  name: 'Private Operational Partnership',
  description: 'An embedded operator inside your business. Long-form, ongoing operational partnership for founders who need a partner running the operational backbone of a growing business.',
  url: `${baseUrl}/operational-partnership`,
}]);

export default async function OperationalPartnershipPage() {
  return (
    <MarketingShell>
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <JsonLdScript data={serviceJsonLd as unknown as Record<string, unknown>} />

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn animation="fade-in">
            <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[var(--color-cream)] leading-[1.15] tracking-tight mb-4 text-glow-warm">
              Private Operational Partnership
            </h1>
            <p className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-bone)] mb-8">
              An embedded operator inside your business.
            </p>
            <p className="text-sm tracking-wider uppercase text-[var(--color-bone)] font-light">
              Investment: $8,500 to $12,000 monthly. Application-only.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 1 */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-10 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Private Operational Partnership is for founders who need an internal operator, not an external consultant. This is not a project, not a deliverable, and not a fixed engagement. Oceo Luxe becomes a calm, structured presence inside the company, running the operational layer the founder no longer has time to hold.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 2 — What it covers */}
      <section className="py-20 lg:py-28 bg-[var(--color-ink)] ambient-glow-rose">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                The partnership covers operational system design, vendor and team coordination, decision architecture, weekly operational rhythm, calendar and priority structure, and the strategic execution layer that translates founder vision into actual movement. The scope is shaped to the business, not pre-packaged. Some partnerships are heavy on systems design. Others are heavy on team coordination. The work is determined by what the business needs, not by what is easy to sell.
              </p>

              {/* Pull-quote */}
              <blockquote className="border-l-2 border-[var(--color-dusty-rose)] pl-6 my-10 py-4 bg-[var(--color-dusty-rose)]/5 rounded-r-lg">
                <p className="font-script text-xl lg:text-2xl italic text-[var(--color-dusty-rose)] leading-relaxed">
                  The scope is shaped to the business, not pre-packaged.
                </p>
              </blockquote>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 3 — Who it is for */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                This partnership is for founders generating revenue, with a team or contractors, who need operational structure to scale without losing the integrity of the brand. It is not for early-stage founders still finding the offer.
              </p>
            </div>
            <div className="mt-12">
              <Link href="/apply">
                <Button
                  size="lg"
                  className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5"
                >
                  Apply
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Editorial Image */}
      <section className="py-16 lg:py-24 bg-[var(--color-ink)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn animation="fade-in">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
              <Image
                src="/images/Kerri-11.webp"
                alt="Kerri Bridgman"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </AnimateIn>
        </div>
      </section>
    </MarketingShell>
  );
}
