import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
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
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn animation="fade-in">
            <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-6 text-glow-warm">
              Oceo Luxe Was Built to Solve the Operational Layer
            </h1>
            <p className="font-script text-2xl italic text-[#CDA7B2]">
              Structure does not limit creativity, it protects it.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Editorial Portrait */}
      <section className="pb-8 lg:pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn animation="fade-in">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="/images/kerri-13-hero.webp"
                alt="Kerri Bridgman, founder of Oceo Luxe"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="space-y-8 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              {/* Paragraph 1 — Foundation */}
              <p>
                Oceo Luxe was founded by Kerri Bridgman. The studio exists because most businesses do not fail at the idea. They fail at the operational layer underneath it. The work is to absorb that layer so the founder can stay in the work only they can do.
              </p>

              {/* Paragraph 2 — Background as credibility (fashion context lives HERE only) */}
              <p>
                Kerri spent the early part of her career inside the production operations of brands where margin compression, supply chain fragility, and tight timelines made operational precision non-negotiable. Production management at Michael Kors. Production coordination at The Shade Store. Project engineering at Atlantic Infra. A degree in Production Management with a minor in Economics from FIT. The pattern across every role was the same: take a chaotic operational environment, build the structure underneath it, and let the creative or commercial work breathe.
              </p>

              {/* Paragraph 3 — Philosophy (industry-agnostic) */}
              <p>
                The work at Oceo Luxe is the same work, applied beyond fashion. Founders in any industry hit the same operational ceiling. The systems that worked at one stage stop working at the next. Oceo Luxe is the operational partner that helps them cross that line without losing the business in the process.
              </p>
            </div>

            <div className="mt-12">
              <Link href="/apply">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3B3937]/20"
                >
                  Apply to Work Together
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
