import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';

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
  description: 'Embedded operational partnership for growing fashion brands. Production leadership, systems architecture, strategic advisory, and team alignment.',
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
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4 animate-fade-in-up">
            Flagship Engagement
          </p>
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-8 animate-fade-in-up">
            Embedded Operational Partnership for Growing Fashion Brands
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed max-w-3xl animate-fade-in-up">
            This is not consulting from the sidelines. This is an embedded operational partnership — a strategic operator working inside your brand, building the systems, managing the timelines, and creating the clarity your team needs to execute at a higher level.
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
              <span className="text-[#3B3937]">Production leadership.</span> Oversight of your production calendar, sampling timelines, and factory relationships — ensuring nothing falls through the cracks and every deadline is met with precision.
            </p>
            <p>
              <span className="text-[#3B3937]">Systems architecture.</span> Custom operational systems built for your brand: supplier management, costing frameworks, launch workflows, and communication protocols that scale with you.
            </p>
            <p>
              <span className="text-[#3B3937]">Strategic advisory.</span> Ongoing decision support on sourcing, pricing, production sequencing, and growth strategy — rooted in over a decade of real-world production experience.
            </p>
            <p>
              <span className="text-[#3B3937]">Team alignment.</span> Clear documentation, process handoffs, and training so your internal team can operate with confidence — whether you have a team of two or twenty.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;This is not consulting from the sidelines. This is operational leadership, embedded in your brand.&rdquo;
          </p>
        </div>
      </section>

      {/* Ideal Client */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            This Partnership Is Designed For
          </h2>
          <ul className="space-y-4 text-lg text-[#967F71] font-light">
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Fashion founders generating revenue and producing collections, but operating without a dedicated operations lead</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Brands managing multiple suppliers, SKUs, or production cycles who need someone to hold the operational overview</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Founders who are ready to step back from day-to-day production management and focus on creative direction and growth</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Brands that value precision, clear communication, and long-term operational excellence over quick fixes</span>
            </li>
          </ul>
          <p className="text-[#3B3937] mt-10 text-lg font-light">
            This is not entry-level support. This is a partnership built for brands operating at a level where operational clarity is no longer optional — it is essential.
          </p>
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
              Ready to bring real clarity to how your brand operates? It starts with an application.
            </p>
            <blockquote className="border-l-2 border-[#CDA7B2] pl-6 mt-8">
              <p className="font-script text-xl lg:text-2xl italic text-[#3B3937]/80 leading-relaxed">
                &ldquo;If your brand has outgrown guesswork, this is where precision begins.&rdquo;
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
            Apply to Work Together
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed">
            Share where your brand is and what you need. If aligned, you will receive next steps to discuss partnership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-white text-[#3B3937] hover:bg-white/90 h-12 px-8 text-base font-normal tracking-wide"
              >
                Apply Now
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
