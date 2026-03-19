import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';

export async function generateMetadata() {
  return await getPageMetadata('work-with-oceo-luxe');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Work With Oceo Luxe', url: `${baseUrl}/work-with-oceo-luxe` },
]);

const offerings = [
  {
    title: 'Production Risk Assessment',
    description:
      'Focused, short-term engagements for brands preparing for a significant production order. Factory evaluation, costing audit, timeline pressure-testing, or pre-production risk review.',
    href: '/strategic-production-alignment',
    cta: 'Explore Risk Assessment',
    flagship: false,
  },
  {
    title: 'Fractional Production Director',
    description:
      'An embedded, ongoing engagement for fashion founders who need senior production leadership without a full-time hire. Production risk management, factory oversight, costing strategy, and margin protection –deployed inside your business.',
    href: '/operational-partnership',
    cta: 'Learn More',
    flagship: true,
  },
  {
    title: 'Studio Systems',
    description:
      'Operational systems, frameworks, and community designed for independent fashion brands. Production calendars, costing tools, supplier management, and live Q&A. Built from real-world production leadership.',
    href: '/studio-systems',
    cta: 'Explore Studio Systems',
    flagship: false,
  },
];

export default async function WorkWithOceoLuxePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Intro Section */}
      <section className="section-spacing-lg">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4 animate-fade-in-up">
            Work With Oceo Luxe
          </p>
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-8 animate-fade-in-up">
            Production Risk Strategy for Fashion Founders
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed max-w-3xl animate-fade-in-up">
            Oceo Luxe works with fashion founders placing $50K–$500K production orders who need strategic production oversight. Whether you need an embedded production director, a focused risk assessment before a major order, or proven operational systems, we protect your production investment at every stage.
          </p>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;Your factory will say everything is under control. We make sure it actually is.&rdquo;
          </p>
        </div>
      </section>

      {/* Offering Cards */}
      <section className="section-spacing bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {offerings.map((offering) => {
              const isFlagship = offering.flagship;
              return (
                <div
                  key={offering.title}
                  className={`rounded-xl p-8 flex flex-col justify-between transition-shadow hover:shadow-lg ${
                    isFlagship
                      ? 'bg-[#3B3937] border border-[#4A4745]'
                      : 'bg-[#faf8f5] border border-[#EDEBE8]'
                  }`}
                >
                  <div>
                    {isFlagship && (
                      <p className="font-script text-lg italic text-[#CDA7B2] mb-2">Flagship</p>
                    )}
                    <h2 className={`font-serif-display text-2xl font-normal mb-4 tracking-tight ${
                      isFlagship ? 'text-white' : 'text-[#3B3937]'
                    }`}>
                      {offering.title}
                    </h2>
                    <p className={`font-light leading-relaxed mb-8 ${
                      isFlagship ? 'text-white/70' : 'text-[#967F71]'
                    }`}>
                      {offering.description}
                    </p>
                  </div>
                  <Link href={offering.href}>
                    <Button
                      variant="outline"
                      className={`h-12 px-6 text-base font-normal tracking-wide w-full justify-center ${
                        isFlagship
                          ? 'bg-white text-[#3B3937] border-white hover:bg-white/90'
                          : 'border-[#3B3937] text-[#3B3937] hover:bg-[#3B3937] hover:text-white'
                      }`}
                    >
                      {offering.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-script text-2xl italic text-[#CDA7B2] mb-4">Ready to begin?</p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-6 tracking-tight">
            Protect Your Next Production Order
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed">
            Every engagement starts with a conversation about your production risk. Share what you are manufacturing, the capital at stake, and where you need oversight.
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
