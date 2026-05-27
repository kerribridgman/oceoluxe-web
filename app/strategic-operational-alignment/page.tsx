import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';

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
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <JsonLdScript data={serviceJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-4">
            Strategic Operational Alignment
          </h1>
          <p className="font-serif-display text-xl lg:text-2xl font-normal text-[#967F71] mb-8">
            A focused operational reset.
          </p>
          <p className="text-sm tracking-wider uppercase text-[#967F71] font-light">
            Investment: $5,500 to $8,500. Flat engagement.
          </p>
        </div>
      </section>

      {/* Body Section 1 */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
            <p>
              Strategic Operational Alignment is a defined engagement for founders who need an operational reset. Not a partnership, not a membership. A bounded scope of work where Oceo Luxe maps the current state of the business, identifies the operational fractures, and rebuilds the systems that are slowing growth.
            </p>
          </div>
        </div>
      </section>

      {/* Body Section 2 — What you walk away with */}
      <section className="py-20 lg:py-28 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
            <p>
              Every engagement ends with a documented operational architecture the founder owns. The systems built during the engagement are designed to keep working without Oceo Luxe holding them. The point of the alignment is to leave the founder with structure, not dependency.
            </p>

            {/* Pull-quote */}
            <blockquote className="border-l-2 border-[#CDA7B2] pl-6 my-10">
              <p className="font-script text-xl lg:text-2xl italic text-[#CDA7B2] leading-relaxed">
                The point of the alignment is to leave the founder with structure, not dependency.
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Body Section 3 — Who it is for */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
            <p>
              This engagement is for founders who can identify the operational problem but do not have the time or the framework to solve it. Most often the business has grown faster than its systems, and the founder needs an operator to come in, build the structure, and leave it stable.
            </p>
          </div>
          <div className="mt-12">
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
              >
                Apply for Strategic Alignment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
