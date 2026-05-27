import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('home');
}

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* 1. Hero Section */}
      <section className="bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6 py-28 lg:py-40">
          <div className="space-y-8">
            <h1 className="font-serif-display text-5xl lg:text-6xl xl:text-7xl font-normal text-[#3B3937] leading-[1.1] tracking-tight">
              Operational Partnership for Founders Building Businesses They Intend to Keep
            </h1>
            <p className="text-xl lg:text-2xl text-[#967F71] font-light leading-relaxed max-w-3xl">
              Oceo Luxe is a Studio Operational Partner. We translate vision into structured execution through operational systems, decision frameworks, and the kind of behind-the-scenes clarity that lets founders stay in the work only they can do.
            </p>
            <p className="font-script text-2xl italic text-[#CDA7B2]">
              Structure does not limit creativity, it protects it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/apply">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                >
                  Apply to Work Together
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/work-with-oceo-luxe">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
                >
                  Explore the Partnership
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problem */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Growth Without Structure Becomes Chaos
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
            <p>
              Most founders do not have an ideas problem. They have an execution problem. The business grows faster than the systems underneath it, and the founder ends up holding every decision, every process, and every loose end. Creative work suffers. Margins narrow. The founder becomes the bottleneck of the thing they built.
            </p>
            <p className="text-[#3B3937]">
              Oceo Luxe exists to absorb the operational layer so founders can stay in the work only they can do.
            </p>
          </div>
        </div>
      </section>

      {/* Dusty rose hairline divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-[#CDA7B2]/40" />
      </div>

      {/* 3. The Role */}
      <section className="py-20 lg:py-28 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Your Studio Operational Partner
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
            <p>
              Oceo Luxe is not a consultancy, not a coach, and not an agency. We work alongside founders as an internal operator, embedded in the business at a strategic level. We build the systems, hold the calendar, structure the decisions, and quietly run the operational backbone of companies growing into something larger.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How We Work — Three Levels of Operational Depth */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-6 tracking-tight">
            Three Levels of Operational Depth
          </h2>
          <p className="text-lg text-[#967F71] font-light leading-relaxed mb-16" style={{ maxWidth: '65ch' }}>
            Every partnership begins with where the business actually is, not where the founder wishes it were. Oceo Luxe meets founders at three operational depths.
          </p>

          {/* Tier Cards — Stacked Vertically */}
          <div className="space-y-0">
            {/* Private Operational Partnership */}
            <div className="py-10">
              <h3 className="font-serif-display text-2xl font-normal text-[#3B3937] mb-3 tracking-tight">
                Private Operational Partnership
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-4" style={{ maxWidth: '65ch' }}>
                An embedded operator inside the business. Long-form, ongoing, shaped to the company. For founders who need a partner running the operational backbone of a growing business.
              </p>
              <Link href="/operational-partnership" className="inline-flex items-center text-[#3B3937] text-sm font-medium tracking-wider uppercase hover:text-[#967F71] transition-colors">
                Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="h-px bg-[#CDA7B2]/40" />

            {/* Strategic Operational Alignment */}
            <div className="py-10">
              <h3 className="font-serif-display text-2xl font-normal text-[#3B3937] mb-3 tracking-tight">
                Strategic Operational Alignment
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-4" style={{ maxWidth: '65ch' }}>
                A defined engagement for founders who need a focused operational reset. Bounded scope. The studio maps the business, identifies the fractures, and rebuilds the systems slowing growth.
              </p>
              <Link href="/strategic-operational-alignment" className="inline-flex items-center text-[#3B3937] text-sm font-medium tracking-wider uppercase hover:text-[#967F71] transition-colors">
                Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="h-px bg-[#CDA7B2]/40" />

            {/* Studio Systems */}
            <div className="py-10">
              <h3 className="font-serif-display text-2xl font-normal text-[#3B3937] mb-3 tracking-tight">
                Studio Systems
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-4" style={{ maxWidth: '65ch' }}>
                The operational foundation layer. A monthly membership of systems, frameworks, and operational tools for founders building their own internal structure.
              </p>
              <Link href="/studio-systems" className="inline-flex items-center text-[#3B3937] text-sm font-medium tracking-wider uppercase hover:text-[#967F71] transition-colors">
                Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="py-20 lg:py-28 bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-6 tracking-tight">
            Built for Founders Who Take Their Business Seriously
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            Oceo Luxe is application-only. Every partnership begins with a conversation, and the studio is selective about who it works with because the work requires alignment on both sides.
          </p>
          <Link href="/apply">
            <Button
              size="lg"
              className="bg-white text-[#3B3937] hover:bg-white/90 h-12 px-8 text-base font-normal tracking-wide"
            >
              Apply
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
