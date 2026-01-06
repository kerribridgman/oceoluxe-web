import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { WhoIHelpSection } from '@/components/marketing/who-i-help-section';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('home');
}

export default async function HomePage() {
  const idealClientIndicators = [
    "Overwhelmed by production decisions",
    "Unclear on factory communication",
    "Second-guessing your pricing",
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section - Editorial, Single Statement */}
      <section className="bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6 py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-light text-[#3B3937] leading-[1.2] tracking-tight mb-8">
              Clarity and structure for designers who want to produce consciously.
            </h1>
            <p className="text-xl text-[#967F71] font-light leading-relaxed mb-12 max-w-2xl">
              I help independent fashion designers communicate with factories, build production systems, and scale without the overwhelm.
            </p>
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-[#3B3937] text-[#3B3937] hover:bg-[#3B3937] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
              >
                Work With Me
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Full Width Image */}
      <section className="bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="aspect-[16/9] lg:aspect-[21/9] overflow-hidden relative">
            <Image
              src="/images/hero-systems.png"
              alt="Fashion production systems"
              fill
              className="object-cover"
              quality={95}
              priority
            />
          </div>
        </div>
      </section>

      {/* Who I Help Section */}
      <WhoIHelpSection />

      {/* Studio Systems Section */}
      <section className="py-32 bg-[#3B3937]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-light">Ongoing Support</p>
              <h2 className="text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight">
                Studio Systems Membership
              </h2>
              <p className="text-xl text-white/80 font-light leading-relaxed">
                A membership built for fashion designers who want structure as support. Learn The Oceo Method™ framework to bring clarity to your production process and scale without burning out.
              </p>
              <ul className="text-white/70 font-light space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span>Twice-monthly live Q&A calls for real-time support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span>Complete Notion system for production, marketing & launches</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span>Private designer community with insider supplier info</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span>Leadership, mindset & somatic support for creative founders</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/studio-systems">
                  <Button
                    size="lg"
                    className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Take the Quiz First
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="aspect-[4/5] w-full max-w-md overflow-hidden relative">
                <Image
                  src="/images/hero-workspace.jpg"
                  alt="Studio Systems Membership"
                  fill
                  className="object-cover"
                  quality={95}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How I Help Section - Simplified Text Block */}
      <section className="py-32 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-8 tracking-tight">
            How I Help
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              Whether you're just starting out or already working with a factory, I help you understand how production actually works so you can make better decisions and avoid costly mistakes.
            </p>
            <p>
              <span className="text-[#3B3937]">Factory communication support.</span> Learn what to say, how to say it, and when. Get scripts, templates, and guidance for clear communication that prevents costly misunderstandings.
            </p>
            <p>
              <span className="text-[#3B3937]">Production systems & workflows.</span> Build the operational backbone your brand needs: production calendars, sampling trackers, costing sheets, and supplier management.
            </p>
            <p>
              <span className="text-[#3B3937]">Sustainable sourcing guidance.</span> Navigate ethical production without the overwhelm. Get clear guidance on materials, suppliers, and relationships that align with your values.
            </p>
          </div>
          <div className="mt-12">
            <Link href="/book">
              <Button
                variant="outline"
                size="lg"
                className="border-[#3B3937] text-[#3B3937] hover:bg-[#3B3937] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
              >
                Book a Discovery Call
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ideal Client Section - Simplified */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src="/images/ideal-client.png"
                  alt="Creative professional working"
                  fill
                  className="object-cover"
                  quality={95}
                />
              </div>
            </div>
            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-10 tracking-tight">
                You're in the right place if you're experiencing...
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                {idealClientIndicators.map((indicator, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="text-[#CDA7B2] mt-1">—</span>
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12">
                <Link href="/book">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#3B3937] text-[#3B3937] hover:bg-[#3B3937] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Let's Fix This Together
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Quiet */}
      <section className="py-32 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-6 tracking-tight">
            Let's make production feel manageable.
          </h2>
          <p className="text-lg text-[#967F71] mb-10 font-light">
            You don't have to figure this out alone.
          </p>
          <Link href="/services">
            <Button
              variant="outline"
              size="lg"
              className="border-[#3B3937] text-[#3B3937] hover:bg-[#3B3937] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
            >
              Work With Me
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
