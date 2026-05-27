// REVIEW FLAG: Studio Systems pricing and model changing.
// Current plan copy uses $77-$111/month membership framing.
// Kerri indicated this is shifting to $111/hr entry-level, max 5hr/week.
// Revisit this page copy after discussion.

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
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
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn animation="fade-in">
            <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-4 text-glow-warm">
              Studio Systems
            </h1>
            <p className="font-serif-display text-xl lg:text-2xl font-normal text-[#967F71] mb-8">
              The operational foundation layer.
            </p>
            <p className="text-sm tracking-wider uppercase text-[#967F71] font-light">
              Investment: $77 to $111 monthly.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 1 */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Studio Systems is for founders who are not yet ready for a private partnership but need structured operational thinking to apply inside their own business. A monthly membership of systems, frameworks, and operational tools built from the same standard as the private partnership work.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 2 — What is delivered */}
      <section className="py-20 lg:py-28 bg-[#faf8f5] ambient-glow-rose">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Each month members receive operational frameworks, decision tools, and structured documents designed to be applied directly to the business. The work is not theoretical and it is not educational. It is the same operational architecture used inside private partnerships, made available at a foundational level.
              </p>

              {/* Pull-quote */}
              <blockquote className="border-l-2 border-[#CDA7B2] pl-6 my-10 py-4 bg-[#CDA7B2]/5 rounded-r-lg">
                <p className="font-script text-xl lg:text-2xl italic text-[#CDA7B2] leading-relaxed">
                  The work is not theoretical and it is not educational.
                </p>
              </blockquote>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Body Section 3 — Who it is for */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Founders building the operational layer of their own business who want a calm, structured source of frameworks and tools rather than a course or a coaching program.
              </p>
            </div>
            <div className="mt-12">
              <Link href="/studio-systems/join">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3B3937]/20"
                >
                  Join Studio Systems
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
