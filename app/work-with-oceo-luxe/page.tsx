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

export default async function WorkWithOceoLuxePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-8">
            Three Operational Depths, One Standard
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
            Oceo Luxe meets founders at three levels of operational depth. The level is matched to where the business is, not where the founder wants it to be. The standard of work is the same across all three.
          </p>
        </div>
      </section>

      {/* Tier Blocks — Stacked Vertically */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">

          {/* Private Operational Partnership */}
          <div className="py-10">
            <h2 className="font-serif-display text-2xl lg:text-3xl font-normal text-[#3B3937] mb-4 tracking-tight">
              Private Operational Partnership
            </h2>
            <p className="text-lg text-[#967F71] font-light leading-relaxed mb-6" style={{ maxWidth: '65ch' }}>
              An embedded operator inside the business. Long-form, ongoing, shaped to the company. For founders who need a partner running the operational backbone of a growing business.
            </p>
            <Link href="/operational-partnership" className="inline-flex items-center text-[#3B3937] text-sm font-medium tracking-wider uppercase hover:text-[#967F71] transition-colors">
              Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="h-px bg-[#CDA7B2]/40" />

          {/* Strategic Operational Alignment */}
          <div className="py-10">
            <h2 className="font-serif-display text-2xl lg:text-3xl font-normal text-[#3B3937] mb-4 tracking-tight">
              Strategic Operational Alignment
            </h2>
            <p className="text-lg text-[#967F71] font-light leading-relaxed mb-6" style={{ maxWidth: '65ch' }}>
              A defined engagement for founders who need a focused operational reset. Bounded scope. The studio maps the business, identifies the fractures, and rebuilds the systems slowing growth.
            </p>
            <Link href="/strategic-operational-alignment" className="inline-flex items-center text-[#3B3937] text-sm font-medium tracking-wider uppercase hover:text-[#967F71] transition-colors">
              Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="h-px bg-[#CDA7B2]/40" />

          {/* Studio Systems */}
          <div className="py-10">
            <h2 className="font-serif-display text-2xl lg:text-3xl font-normal text-[#3B3937] mb-4 tracking-tight">
              Studio Systems
            </h2>
            <p className="text-lg text-[#967F71] font-light leading-relaxed mb-6" style={{ maxWidth: '65ch' }}>
              The operational foundation layer. A monthly membership of systems, frameworks, and operational tools for founders building their own internal structure.
            </p>
            <Link href="/studio-systems" className="inline-flex items-center text-[#3B3937] text-sm font-medium tracking-wider uppercase hover:text-[#967F71] transition-colors">
              Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
