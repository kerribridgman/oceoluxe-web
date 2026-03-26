import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { SectionDivider } from '@/components/marketing/section-divider';

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
  name: 'Operational Partnership',
  description: 'Embedded production leadership for fashion brands placing significant production orders. Factory oversight, costing audits, timeline pressure-testing, and margin protection.',
  url: `${baseUrl}/operational-partnership`,
}]);

export default async function OperationalPartnershipPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <JsonLdScript data={serviceJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="section-spacing-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4 animate-fade-in-up">
                Flagship Engagement
              </p>
              <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-8 animate-fade-in-up">
                Fractional Production Director for Fashion Brands
              </h1>
              <p className="text-xl text-[#967F71] font-light leading-relaxed animate-fade-in-up">
                This is not consulting from the sidelines. This is embedded production leadership. A senior production strategist working inside your brand –managing factory relationships, auditing costing, pressure-testing timelines, and catching the risks that cost brands tens of thousands of dollars every season. Kerri has managed four concurrent production lines while owning all buying and purchasing for those lines. She has helped scale an account 10x in a single year by identifying operational inefficiencies that everyone else walked past.
              </p>
            </div>
            <div className="animate-fade-in-up">
              <div className="aspect-[3/4] overflow-hidden relative rounded-lg">
                <Image
                  src="/images/kerri-13-hero.jpg"
                  alt="Kerri Bridgman, Fractional Production Director"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Structure */}
      <section className="section-spacing bg-[#3B3937]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-10 tracking-tight">
            Engagement Structure
          </h2>
          <p className="text-lg text-white/70 font-light leading-relaxed mb-10">
            A 3-month minimum engagement designed to transform reactive production management into a structured, oversight-driven operation.
          </p>
          <div className="space-y-8">
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-white font-medium mb-2 text-lg">Month 1: Full Production Audit + Immediate Risk Stabilization</p>
              <p className="text-white/60 font-light">Complete review of your production operation. Factory communication, costing, timelines, and supplier relationships assessed and stabilized.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-white font-medium mb-2 text-lg">Month 2: Systems Implementation + Supplier Alignment</p>
              <p className="text-white/60 font-light">Production systems built and embedded into your operation. Factory relationships structured for accountability, clarity, and consistent delivery.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-white font-medium mb-2 text-lg">Month 3: Production Oversight + Optimization</p>
              <p className="text-white/60 font-light">Ongoing production management with continuous oversight. Systems refined, margins protected, and your operation running with precision.</p>
            </div>
          </div>
          <p className="text-white/90 text-lg font-light leading-relaxed mt-10">
            This is not advisory. This is operational leadership embedded inside your business.
          </p>
        </div>
      </section>

      {/* What the Engagement Includes */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            What This Engagement Includes
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              <span className="text-[#3B3937]">Factory oversight.</span> Direct management of factory communication, production milestones, and quality checkpoints. When other departments are not getting answers from the people they should be, this engagement bridges that gap. Every detail reviewed before it becomes a problem –not after it becomes an expense.
            </p>
            <p>
              <span className="text-[#3B3937]">Costing and margin protection.</span> Full production costing audits that expose hidden expenses, validate factory quotes, and ensure your margins are real –not assumptions that erode once invoices arrive.
            </p>
            <p>
              <span className="text-[#3B3937]">Production risk management.</span> Timeline pressure-testing, supplier vetting, and pre-production reviews. Identifying the specific risks in your production plan before capital is committed.
            </p>
            <p>
              <span className="text-[#3B3937]">Strategic advisory.</span> Ongoing decision support on sourcing, pricing architecture, production sequencing, and factory negotiation. Not reactive problem-solving –a systematic production intelligence that deepens with every season your brand grows.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;Factories will tell you everything is under control. We verify that it actually is –before your capital is on the line.&rdquo;
          </p>
        </div>
      </section>

      {/* What This Replaces + Where I Step In */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* What This Replaces */}
            <div className="bg-white rounded-lg p-8 lg:p-10 border border-[#e8e2dc]">
              <h2 className="font-serif-display text-2xl lg:text-3xl font-normal text-[#3B3937] mb-8 tracking-tight">
                What This Replaces
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Guesswork in factory communication</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Unverified costing decisions</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Reactive production management</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Founder-led problem solving under pressure</span>
                </li>
              </ul>
            </div>

            {/* Where I Step In */}
            <div className="bg-white rounded-lg p-8 lg:p-10 border border-[#e8e2dc]">
              <h2 className="font-serif-display text-2xl lg:text-3xl font-normal text-[#3B3937] mb-8 tracking-tight">
                Where I Step In
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Before production orders are placed</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>When factories begin slipping timelines</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>When costing needs validation before approval</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>When teams are not getting clear answers</span>
                </li>
              </ul>
            </div>
          </div>

          <blockquote className="border-l-2 border-[#CDA7B2] pl-6 mt-12">
            <p className="font-serif-display text-xl lg:text-2xl font-normal text-[#3B3937] leading-relaxed">
              Factories do not operate based on your brand&apos;s priorities. They operate based on their own capacity, margins, and constraints. Without oversight, your brand absorbs the risk.
            </p>
          </blockquote>
        </div>
      </section>

      <SectionDivider variant="dots" className="bg-[#faf8f5] pt-0 pb-0" />

      {/* Ideal Client */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
                This Partnership Is Designed For
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Fashion founders placing production orders between $50K and $500K who need expert production oversight</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Brands managing multiple factories and complex supply chains without a senior production person reviewing the details</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Founders who have been burned by factory miscommunication, costing surprises, or timeline failures and refuse to let it happen again</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>Brands that understand production risk management is not optional –it is the difference between profit and loss</span>
                </li>
              </ul>
              <p className="text-[#3B3937] mt-10 text-lg font-light">
                This is not general consulting. This is embedded production leadership for brands with significant capital at stake. The longer we work together, the sharper your production operation becomes.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-square overflow-hidden relative rounded-lg">
                <Image
                  src="/images/designer-fabrics-cityview.png"
                  alt="Fashion designer reviewing fabric swatches with city skyline in background"
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

      {/* Testimonial */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="border-l-2 border-[#CDA7B2] pl-8">
            <p className="font-serif-display text-xl lg:text-2xl font-normal text-[#3B3937] leading-relaxed">
              &ldquo;If you&apos;re looking for someone who combines sharp business instincts with strong people skills, someone who brings both order and energy, Kerri&apos;s it.&rdquo;
            </p>
            <p className="text-[#967F71] font-light text-sm mt-4 tracking-wide uppercase">– C-Suite Executive</p>
          </div>
        </div>
      </section>

      {/* Expected Outcome After 90 Days */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Expected Outcome After 90 Days
          </h2>
          <ul className="space-y-4 text-lg text-[#967F71] font-light">
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">&ndash;</span>
              <span>Production system fully structured</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">&ndash;</span>
              <span>Costing verified and margin clarity established</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">&ndash;</span>
              <span>Supplier communication stabilized</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">&ndash;</span>
              <span>Founder no longer operating reactively</span>
            </li>
          </ul>
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
              This engagement is application-based and scoped to your brand's specific needs. Investment is discussed during the alignment call and depends on the depth, duration, and complexity of the partnership.
            </p>
            <p className="text-[#3B3937]">
              Ready to protect your next production investment? It starts with a conversation about your risk.
            </p>
            <blockquote className="border-l-2 border-[#CDA7B2] pl-6 mt-8">
              <p className="font-script text-xl lg:text-2xl italic text-[#3B3937]/80 leading-relaxed">
                &ldquo;If your brand has outgrown trusting factories without verification, this is where protection begins.&rdquo;
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
            Protect Your Production Investment
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed">
            If your production decisions involve real capital, this is the stage where oversight is required &ndash; not optional.
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
