import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';

export async function generateMetadata() {
  return await getPageMetadata('consultations');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'Work With Oceo Luxe', url: `${baseUrl}/work-with-oceo-luxe` },
  { name: 'Consultations', url: `${baseUrl}/consultations` },
]);

const consultations = [
  {
    title: 'The Production Pulse',
    price: '$500',
    tagline: 'Fast, expert clarity on a specific production problem.',
    description:
      'A one-hour live consultation built for designers who need fast, expert clarity on a specific production problem. Before the call, you complete a structured intake form covering your current production stage, active issues, factory situation, timeline pressure, and the top three questions you want answered. I arrive prepared. The hour is spent diagnosing what is actually happening and giving direct guidance you can act on the same week.',
    included: [
      'Structured intake form',
      '60-minute live consultation call',
      'Full call recording',
      'Short Loom or written recap with 3\u20135 priority actions discussed',
    ],
    positioning:
      'The intake form does the qualifying work. I arrive prepared instead of cold. The price filters out tire-kickers while keeping the offer accessible to early-stage designers and Studio Systems members who need a one-time intervention.',
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_PRODUCTION_PULSE || '/book',
  },
  {
    title: 'The Production Audit',
    price: '$750',
    tagline: 'A focused diagnostic for designers with active production running.',
    description:
      'A focused diagnostic for designers who have active production running and suspect something is breaking. The differentiator versus the Pulse is pre-call review of your actual materials. You send your tech packs, factory communication threads, production calendar, or sample correspondence in advance. I review before the call, identify the structural gaps, then use the hour to walk you through what I found and what to fix first.',
    included: [
      'Materials review (up to 90 minutes of pre-work)',
      '60-minute strategic call',
      'Full call recording',
      'Written one-page summary with prioritized findings and the next three actions in sequence',
    ],
    positioning:
      'The right fit for designers in production now who need a senior set of eyes on the work itself \u2014 not just verbal advice on what to do hypothetically.',
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_PRODUCTION_AUDIT || '/book',
  },
  {
    title: 'The Production Strategy Session',
    price: '$900',
    tagline: 'A senior strategic consultation for real decision points.',
    description:
      'A senior strategic consultation for designers standing at a real decision point. Common triggers: deciding whether to switch factories, scoping a new product category, evaluating whether to move into wholesale, or restructuring how your production calendar interacts with your cash flow. This is the hour where the question is not tactical \u2014 it is directional.',
    included: [
      'Deeper pre-work questionnaire plus materials review',
      '60-minute strategy call',
      'Written 30/60/90 day roadmap with clear sequencing',
      'One optional 15-minute follow-up call within 30 days to pressure-test execution',
    ],
    positioning:
      'For designers who are not looking for advice \u2014 they are looking for a directional decision they can build the next two quarters around.',
    flagship: true,
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_STRATEGY_SESSION || '/book',
  },
];

export default async function ConsultationsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader theme="light" />

      {/* Hero Section */}
      <section className="section-spacing-lg">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-script text-3xl lg:text-4xl italic text-[#CDA7B2] mb-4 animate-fade-in-up">
            One-Hour Consultations
          </p>
          <h1 className="font-serif-display text-4xl lg:text-5xl font-normal text-[#3B3937] leading-[1.15] tracking-tight mb-8 animate-fade-in-up">
            Expert Production Guidance, One Hour at a Time
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed max-w-3xl animate-fade-in-up">
            Focused, one-hour sessions designed for fashion designers who need senior production expertise
            on a specific challenge. No retainer. No long-term commitment. Just direct guidance you can act on immediately.
          </p>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="bg-[#3B3937] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-[#CDA7B2] mx-auto mb-8" />
          <p className="font-script text-2xl lg:text-3xl italic text-white/90 leading-relaxed">
            &ldquo;The right hour with the right person can save you a season.&rdquo;
          </p>
        </div>
      </section>

      {/* Consultation Tiers */}
      <section className="section-spacing bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-16">
            {consultations.map((consultation) => {
              return (
                <div
                  key={consultation.title}
                  className="rounded-xl overflow-hidden bg-[#faf8f5] border border-[#EDEBE8]"
                >
                  <div className="p-8 lg:p-12">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                      <div>
                        <h2 className="font-serif-display text-2xl lg:text-3xl font-normal tracking-tight text-[#3B3937]">
                          {consultation.title}
                        </h2>
                        <p className="text-lg font-light mt-2 text-[#967F71]">
                          {consultation.tagline}
                        </p>
                      </div>
                      <div className="text-3xl lg:text-4xl font-light tracking-tight shrink-0 text-[#3B3937]">
                        {consultation.price}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-lg font-light leading-relaxed mb-8 text-[#967F71]">
                      {consultation.description}
                    </p>

                    {/* What's Included */}
                    <div className="mb-8">
                      <h3 className="text-sm uppercase tracking-widest font-medium mb-4 text-[#967F71]/70">
                        What&apos;s Included
                      </h3>
                      <ul className="space-y-3">
                        {consultation.included.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <Check className="h-5 w-5 mt-0.5 shrink-0 text-[#CDA7B2]" />
                            <span className="text-base font-light text-[#3B3937]">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Positioning */}
                    <div className="border-l-2 border-[#CDA7B2] pl-6 mb-8">
                      <p className="font-light leading-relaxed italic text-[#967F71]">
                        {consultation.positioning}
                      </p>
                    </div>

                    {/* CTA */}
                    {consultation.paymentLink.startsWith('http') ? (
                      <a href={consultation.paymentLink} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="lg"
                          className="h-12 px-8 text-base font-normal tracking-wide bg-[#3B3937] text-white hover:bg-[#4A4745]"
                        >
                          Book This Session
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    ) : (
                      <Link href={consultation.paymentLink}>
                        <Button
                          size="lg"
                          className="h-12 px-8 text-base font-normal tracking-wide bg-[#3B3937] text-white hover:bg-[#4A4745]"
                        >
                          Book This Session
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-[#3B3937] mb-10 tracking-tight">
            How It Works
          </h2>
          <div className="relative">
            <div className="relative pl-10 pb-10 border-l border-[#3B3937]/20 ml-3">
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#CDA7B2] border-2 border-[#faf8f5]" />
              <span className="font-script text-lg italic text-[#CDA7B2] mb-1 block">Step 1</span>
              <h3 className="text-[#3B3937] text-lg font-medium mb-2">Choose Your Session</h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                Select the consultation tier that matches where you are in production and the type of guidance you need.
              </p>
            </div>
            <div className="relative pl-10 pb-10 border-l border-[#3B3937]/20 ml-3">
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#CDA7B2] border-2 border-[#faf8f5]" />
              <span className="font-script text-lg italic text-[#CDA7B2] mb-1 block">Step 2</span>
              <h3 className="text-[#3B3937] text-lg font-medium mb-2">Complete Your Intake</h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                Fill out the structured intake form or send your production materials. This ensures the hour is focused and productive from the first minute.
              </p>
            </div>
            <div className="relative pl-10 pb-10 border-l border-[#3B3937]/20 ml-3">
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#CDA7B2] border-2 border-[#faf8f5]" />
              <span className="font-script text-lg italic text-[#CDA7B2] mb-1 block">Step 3</span>
              <h3 className="text-[#3B3937] text-lg font-medium mb-2">Your Consultation</h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                A focused 60-minute session where I diagnose, advise, and give you a clear path forward. No filler.
              </p>
            </div>
            <div className="relative pl-10 ml-3">
              <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-[#CDA7B2] border-2 border-[#faf8f5]" />
              <span className="font-script text-lg italic text-[#CDA7B2] mb-1 block">Step 4</span>
              <h3 className="text-[#3B3937] text-lg font-medium mb-2">Your Deliverables</h3>
              <p className="text-[#967F71] font-light leading-relaxed">
                Walk away with the recording, a written recap or roadmap, and priority actions you can execute immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-script text-2xl italic text-[#CDA7B2] mb-4">Ready to begin?</p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-normal text-white mb-6 tracking-tight">
            Book Your Consultation
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light leading-relaxed">
            Choose the session that fits your production challenge. Every consultation starts with preparation so the hour delivers maximum value.
          </p>
          <Link href="/book">
            <Button
              size="lg"
              className="bg-white text-[#3B3937] hover:bg-white/90 h-12 px-8 text-base font-normal tracking-wide"
            >
              Schedule a Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter theme="light" />
    </div>
  );
}
