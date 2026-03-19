import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { ChecklistCapture } from '@/components/marketing/checklist-capture';
import { SectionDivider } from '@/components/marketing/section-divider';

export async function generateMetadata() {
  return await getPageMetadata('home');
}

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* 1. Hero Section */}
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="animate-fade-in-up">
                <div className="w-12 h-px bg-[#CDA7B2] mb-6" />
                <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2]">
                  Structure as Strategy
                </p>
              </div>
              <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight animate-fade-in-up">
                Your Factory Has a Plan. Who&apos;s Verifying It?
              </h1>
              <p className="text-xl text-[#967F71] font-light leading-relaxed animate-fade-in-up">
                Your next production order is a six-figure decision. One missed deadline, one costing error, one factory miscommunication can cost tens of thousands. Oceo Luxe provides embedded production strategy so you protect your margins before problems start.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-in-up">
                <Link href="/book">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Schedule a Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/work-with-oceo-luxe">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-3 -bottom-3 w-full h-full border border-[#CDA7B2]/40 rounded-lg hidden lg:block" />
              <div className="aspect-[4/3] overflow-hidden relative z-10 rounded-lg">
                <Image
                  src="/images/hero-systems.jpeg"
                  alt="Fashion production strategy and risk management"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                  quality={75}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/wAARCAAGAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAWFhYWFhYmFhYmNiYmJjZJNjY2NklcSUlJSUlcb1xcXFxcXG9vb29vb29vhoaGhoaGnJycnJyvr6+vr6+vr6+v/9sAQwEbHR0tKS1MKSlMt3xmfLe3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3/90ABAAB/9oADAMBAAIRAxEAPwBLx2jhZUJzGVGav/2ww42Vm6h9yb/eWq560Af/2Q=="
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
            Factories Will Tell You Everything Is Under Control. Until It Costs Them Money.
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              Your factory will say they have everything handled. And they mean it –until the mistake costs the factory more time or money than they are willing to absorb. At that point, your brand absorbs the cost. A costing error that was not caught early. A timeline that slipped because nobody was watching the paperwork. A quality issue that surfaces after delivery when it is ten times more expensive to fix.
            </p>
            <p>
              One company spent $35,000 flying product from Italy to New York in a single day because factory paperwork delays were not caught early enough. That is not an unusual story. It is the kind of production risk that brands face every season when nobody is watching the details at the factory level.
            </p>
            <p className="text-[#3B3937]">
              The solution is not more trust. It is strategic production oversight from someone who understands how factories actually operate.
            </p>
          </div>
        </div>
      </section>

      {/* Does This Sound Like You? */}
      <section className="pt-10 pb-20 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">Recognition</p>
            <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] tracking-tight">
              Does This Sound Like You?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-8 border border-[#e8e2dc] hover:shadow-md transition-shadow flex flex-col">
              <p className="font-script text-xl text-[#CDA7B2] italic mb-3">The quotes</p>
              <p className="text-[#3B3937] font-light leading-relaxed flex-1">
                &ldquo;I received factory quotes that <span className="text-[#CDA7B2] font-medium">don&apos;t add up</span> &ndash; but I don&apos;t know enough about their cost structure to push back.&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[#e8e2dc] hover:shadow-md transition-shadow flex flex-col">
              <p className="font-script text-xl text-[#CDA7B2] italic mb-3">The timeline</p>
              <p className="text-[#3B3937] font-light leading-relaxed flex-1">
                &ldquo;My factory says everything is <span className="text-[#CDA7B2] font-medium">on schedule</span> &ndash; but last season they said the same thing and we shipped six weeks late.&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[#e8e2dc] hover:shadow-md transition-shadow flex flex-col">
              <p className="font-script text-xl text-[#CDA7B2] italic mb-3">The stakes</p>
              <p className="text-[#3B3937] font-light leading-relaxed flex-1">
                &ldquo;I&apos;m about to commit <span className="text-[#CDA7B2] font-medium">six figures</span> to a production run and I have no one reviewing the details at the factory level.&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[#e8e2dc] hover:shadow-md transition-shadow flex flex-col">
              <p className="font-script text-xl text-[#CDA7B2] italic mb-3">The instinct</p>
              <p className="text-[#3B3937] font-light leading-relaxed flex-1">
                &ldquo;I know something feels <span className="text-[#CDA7B2] font-medium">off</span> with my production plan &ndash; but I can&apos;t identify exactly what it is.&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-[#CDA7B2]/30 hover:shadow-md transition-shadow flex flex-col md:col-span-2">
              <p className="font-script text-xl text-[#CDA7B2] italic mb-3">The weight</p>
              <p className="text-[#3B3937] font-light leading-relaxed">
                &ldquo;I&apos;m managing production <span className="text-[#CDA7B2] font-medium">myself</span> &ndash; and I&apos;m not sure if what I&apos;m doing is protecting my margins or quietly eroding them.&rdquo;
              </p>
            </div>
          </div>
          <p className="text-[#967F71] font-light text-lg mt-12 leading-relaxed text-center max-w-2xl mx-auto">
            If any of this resonates, you are not behind. You are simply operating without the production oversight that protects brands at this level.
          </p>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;The most expensive production mistakes are the ones nobody saw coming. The second most expensive are the ones someone saw but did not escalate.&rdquo;
          </p>
        </div>
      </section>

      {/* 3. The Role */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">The approach</p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            Your Fractional Production Director
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              Oceo Luxe operates as your embedded production strategist. Not a consultant who reviews your tech packs and disappears. Your factory communication gets audited. Your costing errors get caught before they compound. Your timelines get pressure-tested. Your production investment is protected at every stage.
            </p>
            <p>
              Kerri Bridgman has spent over a decade inside fashion production –on factory floors, in supply chain operations, in the rooms where production decisions get made under pressure. She has cut over $10 million in production orders over five years, tracked five seasons simultaneously, and managed active production across 15 suppliers. She has been trusted to hire over 100 people based on her understanding of a founder&apos;s vision and standards. The factory and supplier relationships she built over seven years have followed her across companies and industries. She brings the rigor of established houses, a systematic approach to building production frameworks that outlast any single season, and the composure to hold steady when factories start missing deadlines.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Outcomes */}
      <section className="section-spacing bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">What changes</p>
            <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] tracking-tight">
              Protection. Precision. Profit.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#faf8f5] rounded-lg p-8 border border-[#e8e2dc] hover:shadow-md transition-shadow">
              <p className="font-script text-2xl text-[#CDA7B2] italic mb-3">Fewer surprises</p>
              <p className="text-[#3B3937] font-light leading-relaxed">
                Costing errors, timeline delays, and factory miscommunications get caught before they cost you money. Not after.
              </p>
            </div>
            <div className="bg-[#faf8f5] rounded-lg p-8 border border-[#e8e2dc] hover:shadow-md transition-shadow">
              <p className="font-script text-2xl text-[#CDA7B2] italic mb-3">Stronger margins</p>
              <p className="text-[#3B3937] font-light leading-relaxed">
                Every line item in your production budget verified. Every factory quote pressure-tested. Margins that are real, not assumptions.
              </p>
            </div>
            <div className="bg-[#faf8f5] rounded-lg p-8 border border-[#e8e2dc] hover:shadow-md transition-shadow">
              <p className="font-script text-2xl text-[#CDA7B2] italic mb-3">Frameworks that stay</p>
              <p className="text-[#3B3937] font-light leading-relaxed">
                The costing structures, communication protocols, and production systems built during the engagement belong to your brand. Long after the season ends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Who This Is For */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4">Alignment</p>
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
                Built for Founders With Production at Stake
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>You are placing production orders between $50K and $500K and cannot afford costly mistakes</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>You are trusting factories with significant capital but have no production expert reviewing the details</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>You need someone who understands how factories actually operate –not how they say they operate</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">&ndash;</span>
                  <span>You want strategic oversight on costing, timelines, and supplier communication before committing capital</span>
                </li>
              </ul>
              <p className="text-[#3B3937] mt-10 text-lg font-light">
                This is not general consulting. This is production risk management for brands with real money on the line.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-[4/5] overflow-hidden relative rounded-lg">
                <Image
                  src="/images/ideal-client.png"
                  alt="Fashion founder at work"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/wAARCAAGAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAWFhYWFhYmFhYmNiYmJjZJNjY2NklcSUlJSUlcb1xcXFxcXG9vb29vb29vhoaGhoaGnJycnJyvr6+vr6+vr6+v/9sAQwEbHR0tKS1MKSlMt3xmfLe3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3/90ABAAB/9oADAMBAAIRAxEAPwBROINzqOeM+nPFbSQjYMk9BXOzfdb/AID/ADFdQn3R9KSGz//Z"
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
            <p className="text-[#967F71] font-light text-sm mt-4 tracking-wide uppercase">– C-Suite Executive</p>
          </div>
        </div>
      </section>

      {/* Editorial Block */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-script text-2xl lg:text-3xl italic text-[#CDA7B2] mb-4">The belief</p>
          <h3 className="font-serif-display text-2xl lg:text-3xl font-normal text-white tracking-tight">
            At Oceo Luxe, we believe the most expensive production mistake is the one you did not know to look for.
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
                Fractional Production Director
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-6">
                Your production orders are protected by someone who has been on the factory floor. Senior oversight embedded in your brand, season after season.
              </p>
              <Link href="/operational-partnership" className="inline-flex items-center text-[#3B3937] font-medium text-sm hover:text-[#967F71] transition-colors">
                See How It Works <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="relative bg-[#3B3937] rounded-xl p-8 border-2 border-[#CDA7B2] shadow-lg md:-mt-2 md:mb-[-8px]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#CDA7B2] text-white text-xs font-medium tracking-wider uppercase px-4 py-1 rounded-full">
                Start Here
              </span>
              <h3 className="font-serif-display text-xl font-normal text-white mb-3">
                Production Risk Assessment
              </h3>
              <p className="text-white/70 font-light leading-relaxed mb-6">
                Know exactly what you are committing to before you write the check. One focused engagement, one production risk, total clarity.
              </p>
              <Link href="/strategic-production-alignment" className="inline-flex items-center text-[#CDA7B2] font-medium text-sm hover:text-white transition-colors">
                View the Process <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="bg-[#faf8f5] rounded-xl p-8 border border-[#EDEBE8] hover:shadow-lg transition-shadow">
              <h3 className="font-serif-display text-xl font-normal text-[#3B3937] mb-3">
                Studio Systems
              </h3>
              <p className="text-[#967F71] font-light leading-relaxed mb-6">
                Production frameworks, templates, and community access built from real experience &ndash; so you can operate with more structure and less guesswork.
              </p>
              <Link href="/studio-systems" className="inline-flex items-center text-[#3B3937] font-medium text-sm hover:text-[#967F71] transition-colors">
                Explore <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
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
            Protect Your Production Investment.
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            Before you commit capital to your next production run, make sure someone who understands factory operations is reviewing the details. Start with a conversation.
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

          {/* Checklist Lead Capture */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <ChecklistCapture variant="dark" />
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
