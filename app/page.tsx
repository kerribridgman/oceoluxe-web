import Link from 'next/link';
import Image from 'next/image';
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
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] animate-fade-in-up">
                Structure as Strategy
              </p>
              <h1 className="font-serif-display text-4xl lg:text-[42px] font-normal text-[#3B3937] leading-[1.15] tracking-tight animate-fade-in-up">
                Operational Partnership for Visionary Fashion Founders
              </h1>
              <p className="text-xl text-[#967F71] font-light leading-relaxed animate-fade-in-up">
                You built the brand. Now build the infrastructure it deserves. Oceo Luxe provides strategic operational partnership rooted in real-world production leadership — so you can scale with precision, not pressure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-in-up">
                <Link href="/apply">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Apply for Partnership
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/work-with-oceo-luxe">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden relative z-10 rounded-lg">
                <Image
                  src="/images/hero-systems.jpeg"
                  alt="Fashion production systems and operational clarity"
                  fill
                  className="object-cover rounded-lg"
                  quality={95}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problem */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">The reality</p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Creative Excellence Requires Operational Precision
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              Most fashion brands are not held back by a lack of creativity. They are held back by systems that cannot keep up with their vision. Production timelines slip, supplier communication fragments, and founders spend more time managing chaos than designing.
            </p>
            <p>
              The cost is not just financial. It is creative. When operations consume your attention, the work that made your brand exceptional takes a back seat.
            </p>
            <p className="text-[#3B3937]">
              The solution is not more hustle. It is operational infrastructure — designed specifically for how fashion brands actually work.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;Structure is not a limitation — it is the foundation that lets creativity scale.&rdquo;
          </p>
        </div>
      </section>

      {/* 3. The Role */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">The approach</p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Your Strategic Operator
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              Oceo Luxe operates as your embedded operational partner — not a consultant who hands you a PDF and disappears. This is production leadership integrated into your business: managing timelines, building systems, aligning your team, and creating the clarity that allows you to focus on what you do best.
            </p>
            <p>
              With over a decade of experience in fashion production and supply chain management, Kerri Bridgman brings the same operational rigor found in luxury houses — delivered at a scale that works for independent and growing brands.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Outcomes */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">What changes</p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Clarity. Timelines. Confidence.
          </h2>
          <p className="text-lg text-[#967F71] font-light leading-relaxed">
            Founders who work with Oceo Luxe gain production calendars that hold, supplier relationships that function, pricing structures they trust, and the operational confidence to make decisions without second-guessing. The work is not theoretical — it is built inside your brand, for your brand, and alongside you.
          </p>
        </div>
      </section>

      {/* 5. Who This Is For */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">Alignment</p>
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
                Designed for Founders Ready to Operate at a Higher Level
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>You are producing and selling, but your operations are reactive instead of strategic</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>You are managing production yourself and need someone who understands the work at a high level</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>You want to scale without sacrificing the quality or integrity of your brand</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>You value precision, clear communication, and long-term operational excellence</span>
                </li>
              </ul>
              <p className="text-[#3B3937] mt-10 text-lg font-light">
                This is not entry-level support. This is partnership for brands that are ready.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-[4/5] overflow-hidden relative rounded-lg">
                <Image
                  src="/images/ideal-client.png"
                  alt="Fashion founder at work"
                  fill
                  className="object-cover rounded-lg"
                  quality={95}
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
              &ldquo;She brought systems, structure, and a fresh perspective that reshaped how we work.&rdquo;
            </p>
            <p className="text-[#967F71] font-light text-sm mt-4 tracking-wide uppercase">— Former Colleague</p>
          </div>
        </div>
      </section>

      {/* Editorial Block */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-script text-2xl lg:text-3xl italic text-[#CDA7B2] mb-4">The belief</p>
          <h3 className="font-serif-display text-2xl lg:text-3xl font-normal text-white tracking-tight">
            At Oceo Luxe, we believe structure is a form of support — not restriction.
          </h3>
        </div>
      </section>

      {/* 6. Pathways */}
      <section className="section-spacing bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">Pathways</p>
            <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] tracking-tight">
              Three Ways to Work With Oceo Luxe
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#faf8f5] rounded-xl p-8 border border-[#EDEBE8] hover:shadow-lg transition-shadow">
              <h3 className="font-serif-display text-xl font-normal text-[#3B3937] mb-3">
                Operational Partnership
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-6">
                Embedded, ongoing operational leadership for brands that need a strategic partner inside the business.
              </p>
              <Link href="/operational-partnership" className="inline-flex items-center text-[#3B3937] font-medium text-sm hover:text-[#967F71] transition-colors">
                Learn More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="bg-[#faf8f5] rounded-xl p-8 border border-[#EDEBE8] hover:shadow-lg transition-shadow">
              <h3 className="font-serif-display text-xl font-normal text-[#3B3937] mb-3">
                Studio Systems
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-6">
                Operational systems, frameworks, and community built from real-world production leadership for independent fashion brands.
              </p>
              <Link href="/studio-systems" className="inline-flex items-center text-[#3B3937] font-medium text-sm hover:text-[#967F71] transition-colors">
                Explore <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="bg-[#faf8f5] rounded-xl p-8 border border-[#EDEBE8] hover:shadow-lg transition-shadow">
              <h3 className="font-serif-display text-xl font-normal text-[#3B3937] mb-3">
                Blog
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-6">
                Insights on fashion operations, production clarity, and building brands designed for longevity.
              </p>
              <Link href="/blog" className="inline-flex items-center text-[#3B3937] font-medium text-sm hover:text-[#967F71] transition-colors">
                Read <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="section-spacing bg-[#3B3937]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">
            The next step
          </p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-6 tracking-tight">
            Build with Structure. Scale with Calm.
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            Your brand deserves operational infrastructure that matches your creative vision. Start with an application or a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-white text-[#3B3937] hover:bg-white/90 h-12 px-8 text-base font-normal tracking-wide"
              >
                Apply for Partnership
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
