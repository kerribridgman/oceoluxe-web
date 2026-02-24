import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';

export async function generateMetadata() {
  return await getPageMetadata('strategic-production-alignment');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Work With Oceo Luxe', url: `${baseUrl}/work-with-oceo-luxe` },
  { name: 'Strategic Production Alignment', url: `${baseUrl}/strategic-production-alignment` },
]);

const serviceJsonLd = getServiceJsonLd([{
  name: 'Strategic Production Alignment',
  description: 'Focused, short-term engagements for fashion brands that need clarity on a specific production challenge — sourcing strategy, factory evaluation, timeline restructuring, or launch readiness.',
  url: `${baseUrl}/strategic-production-alignment`,
}]);

export default async function StrategicProductionAlignmentPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <JsonLdScript data={serviceJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="section-spacing-lg">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4 animate-fade-in-up">
            Focused Engagement
          </p>
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-8 animate-fade-in-up">
            Strategic Production Alignment
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed max-w-3xl animate-fade-in-up">
            A focused, short-term engagement for fashion founders who need clarity on a specific production challenge. Whether it is sourcing strategy, factory evaluation, timeline restructuring, or launch readiness — this is targeted operational support designed to move your brand forward with precision.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            What&apos;s Included
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              <span className="text-[#3B3937]">Sourcing strategy.</span> Supplier evaluation, vendor alignment, and sourcing clarity — so you can move forward with confidence in your production partners.
            </p>
            <p>
              <span className="text-[#3B3937]">Factory evaluation.</span> Production partner assessment, capacity and quality review — ensuring your factory relationships are set up for long-term success.
            </p>
            <p>
              <span className="text-[#3B3937]">Timeline restructuring.</span> Production calendar audit and milestone clarity — transforming chaotic timelines into structured, actionable plans.
            </p>
            <p>
              <span className="text-[#3B3937]">Launch readiness.</span> Pre-launch operational review and workflow sequencing — making sure every piece is in place before you go to market.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;Clarity on a single production challenge can reshape how your entire brand operates.&rdquo;
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <span className="font-serif-display text-3xl text-[#CDA7B2] font-light leading-none mt-1">01</span>
              <div>
                <h3 className="text-[#3B3937] text-lg font-medium mb-2">Apply</h3>
                <p className="text-[#967F71] font-light leading-relaxed">
                  Share where your brand is and the specific production challenge you are facing. This helps determine whether a focused engagement is the right fit.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <span className="font-serif-display text-3xl text-[#CDA7B2] font-light leading-none mt-1">02</span>
              <div>
                <h3 className="text-[#3B3937] text-lg font-medium mb-2">Alignment call</h3>
                <p className="text-[#967F71] font-light leading-relaxed">
                  A conversation to understand the full picture — your brand, your challenge, and the outcome you need. From here, we scope the engagement together.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <span className="font-serif-display text-3xl text-[#CDA7B2] font-light leading-none mt-1">03</span>
              <div>
                <h3 className="text-[#3B3937] text-lg font-medium mb-2">Focused engagement</h3>
                <p className="text-[#967F71] font-light leading-relaxed">
                  Targeted operational support delivered with precision. You receive clear recommendations, actionable next steps, and the clarity to move forward.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Investment
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              This engagement is scoped and project-based. Investment is discussed during the alignment call and depends on the specific challenge, depth of review, and deliverables required.
            </p>
            <p className="text-[#3B3937]">
              Every engagement is tailored to deliver maximum clarity on the challenge at hand.
            </p>
            <blockquote className="border-l-2 border-[#CDA7B2] pl-6 mt-8">
              <p className="font-script text-xl lg:text-2xl italic text-[#3B3937]/80 leading-relaxed">
                &ldquo;One focused engagement. One clear challenge. Total clarity on the path forward.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-script text-2xl italic text-[#CDA7B2] mb-4">Next step</p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-6 tracking-tight">
            Get Clarity on Your Production Challenge
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed">
            Share where your brand is and the challenge you are facing. If aligned, we will scope a focused engagement together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-white text-[#3B3937] hover:bg-white/90 h-12 px-8 text-base font-normal tracking-wide"
              >
                Book a Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/apply">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-normal tracking-wide"
              >
                Apply
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
