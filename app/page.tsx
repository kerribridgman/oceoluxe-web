import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { MarketingShell } from '@/components/marketing/marketing-shell';
import { getPageMetadata } from '@/lib/seo/metadata';
import { AnimateIn } from '@/components/animate-in';

export async function generateMetadata() {
  return await getPageMetadata('home');
}

export default async function HomePage() {
  return (
    <MarketingShell>
      <MarketingHeader />

      {/* 1. Hero Section */}
      <section className="bg-[var(--color-ink)]">
        <div className="max-w-4xl mx-auto px-6 py-28 lg:py-40">
          <AnimateIn animation="fade-in">
            <div className="space-y-8">
              <h1 className="font-serif-display text-5xl lg:text-6xl xl:text-7xl font-normal text-[var(--color-cream)] leading-[1.1] tracking-tight text-glow-warm">
                Operational Partnership for Founders Building Businesses They Intend to Keep
              </h1>
              <p className="text-xl lg:text-2xl text-[var(--color-bone)] font-light leading-relaxed max-w-3xl">
                Oceo Luxe is a Studio Operational Partner. We translate vision into structured execution through operational systems, decision frameworks, and the kind of behind-the-scenes clarity that lets founders stay in the work only they can do.
              </p>
              <p className="font-script text-2xl italic text-[var(--color-dusty-rose)]">
                Structure does not limit creativity, it protects it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/apply">
                  <Button
                    size="lg"
                    className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Apply to Work Together
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/work-with-oceo-luxe">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[var(--color-taupe)] text-[var(--color-bone)] hover:bg-[var(--color-taupe)] hover:text-[var(--color-cream)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Explore the Partnership
                  </Button>
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* 2. The Problem */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[var(--color-cream)] mb-10 tracking-tight">
              Growth Without Structure Becomes Chaos
            </h2>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Most founders do not have an ideas problem. They have an execution problem. The business grows faster than the systems underneath it, and the founder ends up holding every decision, every process, and every loose end. Creative work suffers. Margins narrow. The founder becomes the bottleneck of the thing they built.
              </p>
              <p className="text-[var(--color-cream)]">
                Oceo Luxe exists to absorb the operational layer so founders can stay in the work only they can do.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="divider-gradient" />
      </div>

      {/* 3. The Role */}
      <section className="py-20 lg:py-28 bg-[var(--color-ink)] ambient-glow-rose">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <AnimateIn>
            <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[var(--color-cream)] mb-10 tracking-tight">
              Your Studio Operational Partner
            </h2>
            <div className="space-y-6 text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
              <p>
                Oceo Luxe is not a consultancy, not a coach, and not an agency. We work alongside founders as an internal operator, embedded in the business at a strategic level. We build the systems, hold the calendar, structure the decisions, and quietly run the operational backbone of companies growing into something larger.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* 4. How We Work — Three Levels of Operational Depth */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <div className="max-w-3xl mb-16">
              <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[var(--color-cream)] mb-6 tracking-tight">
                Three Levels of Operational Depth
              </h2>
              <p className="text-lg text-[var(--color-bone)] font-light leading-relaxed" style={{ maxWidth: '65ch' }}>
                Every partnership begins with where the business actually is, not where the founder wishes it were. Oceo Luxe meets founders at three operational depths.
              </p>
            </div>
          </AnimateIn>

          {/* Tier Cards — Three Across */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Private Operational Partnership */}
            <AnimateIn delay={100}>
              <div className="flex flex-col bg-[var(--color-ink)] border border-[var(--color-taupe)]/20 rounded-xl p-8 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(201,160,160,0.3)] hover:border-[var(--color-dusty-rose)]/30">
                <h3 className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-cream)] mb-3 tracking-tight">
                  Private Operational Partnership
                </h3>
                <p className="text-[var(--color-bone)] font-light leading-relaxed mb-6 flex-1">
                  An embedded operator inside the business. Long-form, ongoing, shaped to the company. For founders who need a partner running the operational backbone of a growing business.
                </p>
                <Link href="/operational-partnership" className="inline-flex items-center text-[var(--color-cream)] text-sm font-medium tracking-wider uppercase hover:text-[var(--color-dusty-rose)] transition-colors mt-auto">
                  Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimateIn>

            {/* Strategic Operational Alignment */}
            <AnimateIn delay={200}>
              <div className="flex flex-col bg-[var(--color-ink)] border border-[var(--color-taupe)]/20 rounded-xl p-8 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(201,160,160,0.3)] hover:border-[var(--color-dusty-rose)]/30">
                <h3 className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-cream)] mb-3 tracking-tight">
                  Strategic Operational Alignment
                </h3>
                <p className="text-[var(--color-bone)] font-light leading-relaxed mb-6 flex-1">
                  A defined engagement for founders who need a focused operational reset. Bounded scope. The studio maps the business, identifies the fractures, and rebuilds the systems slowing growth.
                </p>
                <Link href="/strategic-operational-alignment" className="inline-flex items-center text-[var(--color-cream)] text-sm font-medium tracking-wider uppercase hover:text-[var(--color-dusty-rose)] transition-colors mt-auto">
                  Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimateIn>

            {/* Studio Systems */}
            <AnimateIn delay={300}>
              <div className="flex flex-col bg-[var(--color-ink)] border border-[var(--color-taupe)]/20 rounded-xl p-8 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_rgba(201,160,160,0.3)] hover:border-[var(--color-dusty-rose)]/30">
                <h3 className="font-serif-display text-xl lg:text-2xl font-normal text-[var(--color-cream)] mb-3 tracking-tight">
                  Studio Systems
                </h3>
                <p className="text-[var(--color-bone)] font-light leading-relaxed mb-6 flex-1">
                  Hands-on operational and web build support, by the hour. Capped at five hours per week so the work stays focused and the standard stays high. The most direct way to put an operator inside the business without committing to a long-form partnership.
                </p>
                <Link href="/studio-systems" className="inline-flex items-center text-[var(--color-cream)] text-sm font-medium tracking-wider uppercase hover:text-[var(--color-dusty-rose)] transition-colors mt-auto">
                  Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="py-20 lg:py-28 bg-[var(--color-charcoal)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-6 tracking-tight">
              Built for Founders Who Take Their Business Seriously
            </h2>
            <p className="text-lg text-[var(--color-bone)] mb-10 font-light leading-relaxed max-w-2xl mx-auto">
              Oceo Luxe is application-only. Every partnership begins with a conversation, and the studio is selective about who it works with because the work requires alignment on both sides.
            </p>
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-bone)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Apply
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimateIn>
        </div>
      </section>

      <MarketingFooter />
    </MarketingShell>
  );
}
