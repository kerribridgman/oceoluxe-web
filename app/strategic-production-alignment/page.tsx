import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { ChecklistCapture } from '@/components/marketing/checklist-capture';
import { SectionDivider } from '@/components/marketing/section-divider';

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
  description: 'Focused, short-term engagements for fashion brands preparing for a significant production order. Factory vetting, costing audit, timeline pressure-testing, or pre-production risk review.',
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
            Production Risk Assessment
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed max-w-3xl animate-fade-in-up">
            A focused engagement for fashion founders preparing for a significant production order. Factory vetting, costing audit, timeline pressure-testing, or pre-production risk review. Strategic production oversight designed to protect your investment before capital is committed.
          </p>
        </div>
      </section>

      {/* Engagement Structure */}
      <section className="section-spacing bg-[#3B3937]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-10 tracking-tight">
            Engagement Structure
          </h2>
          <p className="text-lg text-white/70 font-light leading-relaxed mb-10">
            A focused, 4&ndash;6 week engagement designed to give you complete visibility into your production risk before capital is committed.
          </p>
          <div className="relative">
            {/* Timeline step 1 */}
            <div className="relative pl-10 pb-10 border-l border-white/20 ml-3">
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#CDA7B2] border-2 border-[#3B3937]" />
              <span className="font-script text-lg italic text-[#CDA7B2] mb-1 block">Week 1</span>
              <h3 className="text-white text-lg font-medium mb-2">Alignment + Scope Definition</h3>
              <p className="text-white/60 font-light leading-relaxed">
                Understanding your brand, your production challenge, and the specific risks that need to be assessed. From here, the engagement is scoped to your situation.
              </p>
            </div>
            {/* Timeline step 2 */}
            <div className="relative pl-10 pb-10 border-l border-white/20 ml-3">
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#CDA7B2] border-2 border-[#3B3937]" />
              <span className="font-script text-lg italic text-[#CDA7B2] mb-1 block">Weeks 2&ndash;3</span>
              <h3 className="text-white text-lg font-medium mb-2">Deep Production Review</h3>
              <p className="text-white/60 font-light leading-relaxed">
                Factory evaluation, costing audit, and timeline analysis. Every detail examined with the precision that protects your investment.
              </p>
            </div>
            {/* Timeline step 3 */}
            <div className="relative pl-10 pb-10 border-l border-white/20 ml-3">
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#CDA7B2] border-2 border-[#3B3937]" />
              <span className="font-script text-lg italic text-[#CDA7B2] mb-1 block">Weeks 4&ndash;5</span>
              <h3 className="text-white text-lg font-medium mb-2">Risk Analysis + Pressure-Testing</h3>
              <p className="text-white/60 font-light leading-relaxed">
                Every assumption in your production plan tested. Every risk identified and quantified before you commit capital.
              </p>
            </div>
            {/* Timeline step 4 (last –no border-l) */}
            <div className="relative pl-10 ml-3">
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#CDA7B2] border-2 border-[#3B3937]" />
              <span className="font-script text-lg italic text-[#CDA7B2] mb-1 block">Weeks 5&ndash;6</span>
              <h3 className="text-white text-lg font-medium mb-2">Delivery of Findings + Strategic Recommendations</h3>
              <p className="text-white/60 font-light leading-relaxed">
                A complete production risk assessment with specific recommendations and a verified plan you can trust.
              </p>
            </div>
          </div>
          <p className="text-white/90 text-lg font-light leading-relaxed mt-10">
            This is a defined engagement with a clear endpoint. You leave with a complete understanding of your production risk and exactly how to address it.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
                What&apos;s Included
              </h2>
              <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
                <p>
                  <span className="text-[#3B3937]">Factory vetting.</span> Supplier evaluation, production partner assessment, and capacity review. Verifying that your factory can actually deliver what they promise –before your capital is on the line.
                </p>
                <p>
                  <span className="text-[#3B3937]">Costing audit.</span> Full production costing review that exposes hidden expenses and validates factory quotes. Ensuring your margins are real –not assumptions that erode once invoices arrive.
                </p>
                <p>
                  <span className="text-[#3B3937]">Timeline pressure-testing.</span> Production calendar audit, milestone sequencing, and delivery risk identification. Catching the timeline failures that delay launches and cost brands money.
                </p>
                <p>
                  <span className="text-[#3B3937]">Pre-production risk review.</span> A comprehensive assessment of your production plan before capital is committed. Every risk identified, every assumption tested, every detail verified.
                </p>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-[3/4] overflow-hidden relative rounded-lg">
                <Image
                  src="/images/runway.png"
                  alt="Fashion runway show"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                  quality={75}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;One unverified assumption in your production plan can cost more than the entire order is worth.&rdquo;
          </p>
        </div>
      </section>

      {/* When Founders Typically Engage */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            When Founders Typically Engage
          </h2>
          <ul className="space-y-4 text-lg text-[#967F71] font-light">
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">&ndash;</span>
              <span>Before placing a production order</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">&ndash;</span>
              <span>After receiving factory quotes that feel unclear</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">&ndash;</span>
              <span>When timelines feel compressed or unrealistic</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">&ndash;</span>
              <span>When something feels off but cannot be identified</span>
            </li>
          </ul>
          <p className="text-[#3B3937] text-lg font-light leading-relaxed mt-10">
            Most production issues are visible before they become expensive. They are just not being reviewed by someone who knows where to look.
          </p>
        </div>
      </section>

      <SectionDivider variant="diamond" className="bg-[#faf8f5] pt-0 pb-0" />

      {/* Lead Capture - Production Risk Checklist */}
      <ChecklistCapture />

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
              Every engagement is designed to protect your production investment before capital is committed. You walk away with the assessment, the framework, and the production knowledge to make stronger decisions going forward.
            </p>
            <blockquote className="border-l-2 border-[#CDA7B2] pl-6 mt-8">
              <p className="font-script text-xl lg:text-2xl italic text-[#3B3937]/80 leading-relaxed">
                &ldquo;One focused engagement. One production risk. Total confidence in the path forward.&rdquo;
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
            Protect Your Next Production Order
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed">
            If you are committing capital to production this season, this is the stage where mistakes are prevented &ndash; not fixed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-white text-[#3B3937] hover:bg-white/90 h-12 px-8 text-base font-normal tracking-wide"
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/book">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-normal tracking-wide"
              >
                Book a Call
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
