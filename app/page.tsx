import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight, FileText, Briefcase } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { WhoIHelpSection } from '@/components/marketing/who-i-help-section';
import { FactoryTruthsSection } from '@/components/marketing/factory-truths-section';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('home');
}

export default async function HomePage() {
  const idealClientIndicators = [
    "Unsure what your factory does and doesn't handle for you",
    "Overwhelmed by fabric choices and don't know how to narrow them down",
    "Struggling to keep track of samples, suppliers, and production details",
    "Confused about what information to send your factory (and in what format)",
    "Experiencing delays that feel unreasonable but might actually be normal",
    "Want to produce sustainably but feel paralyzed by perfectionism"
  ];

  const offerings = [
    {
      icon: <Briefcase className="h-10 w-10 text-[#CDA7B2]" />,
      title: "Consulting &\nProject Support",
      description: "Hourly or project-based guidance for factory vetting, production planning, supplier communication, and navigating challenges as they come up"
    },
    {
      icon: <FileText className="h-10 w-10 text-[#CDA7B2]" />,
      title: "Tech Pack &\nSpec Development",
      description: "Help creating the detailed specifications factories need, so your vision translates clearly and you avoid costly miscommunication"
    },
    {
      icon: <FileText className="h-10 w-10 text-[#CDA7B2]" />,
      title: "Production Resources\n& Notion Templates",
      description: "Ready-to-use templates designed for fashion production: collection planners, costing sheets, supplier trackers, and production calendars"
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#f5f0ea]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-serif font-light text-[#3B3937] leading-tight">
                  Clarity and Structure for Designers Who Want to Produce Consciously<span className="text-[#CDA7B2]"> - Without the Overwhelm</span>
                </h1>
                <p className="text-xl text-[#967F71] font-light leading-relaxed">
                  I help you communicate clearly with factories, avoid costly production mistakes, choose the right materials, and build systems that support your growth.
                </p>
                <p className="text-lg text-[#3B3937] font-light leading-relaxed">
                  With a decade of luxury-level production experience and a background in production management from FIT, I guide independent designers through manufacturing with confidence and intention.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-14 px-10 text-lg font-light group w-full sm:w-auto"
                  >
                    Work With Me
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-14 px-10 text-lg font-light w-full sm:w-auto"
                  >
                    Discover Your Archetype
                  </Button>
                </Link>
              </div>
            </div>
            {/* Right: Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
                <Image
                  src="/images/hero-systems.png"
                  alt="Fashion production systems and factory guidance for designers"
                  fill
                  className="object-cover"
                  quality={95}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who I Help Section */}
      <WhoIHelpSection />

      {/* What Factories Won't Tell You Section */}
      <FactoryTruthsSection />

      {/* Studio Systems Section */}
      <section className="py-24 bg-[#3B3937]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-light">Ongoing Support</p>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-tight">
                Studio Systems Membership
              </h2>
              <p className="text-xl text-white/80 font-light leading-relaxed">
                A membership built for fashion designers who want structure as support. Learn The Oceo Method™ framework to bring clarity to your production process and scale without burning out.
              </p>
              <ul className="text-white/80 font-light space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span>Monthly Studio Sessions and community calls</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span>Full course library on production and operations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span>Notion templates, calendars, and costing tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-0.5" />
                  <span>A supportive community of fellow fashion founders</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/studio-systems">
                  <Button
                    size="lg"
                    className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-14 px-10 text-lg font-light group w-full sm:w-auto"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 h-14 px-10 text-lg font-light w-full sm:w-auto"
                  >
                    Take the Quiz First
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="aspect-square w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
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

      {/* How I Help Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
              How I Help
            </h2>
            <p className="text-xl text-[#967F71] max-w-4xl mx-auto leading-relaxed font-light">
              Whether you're just starting out or already working with a factory, I help you understand how production actually works so you can make better decisions and avoid costly mistakes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {offerings.map((offering, index) => (
              <Card key={index} className="border-[#EDEBE8] bg-[#F5F3F0] hover:shadow-lg transition-shadow">
                <CardContent className="pt-10 pb-8 text-center">
                  <div className="flex justify-center mb-6 bg-[#CDA7B2]/10 w-16 h-16 rounded-full items-center mx-auto">
                    {offering.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-4 whitespace-pre-line">
                    {offering.title}
                  </h3>
                  <p className="text-[#6B655C] leading-relaxed font-light">
                    {offering.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Ideal Client Section */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl relative">
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
            <div className="order-1 lg:order-2 space-y-10">
              <div>
                <h2 className="text-4xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
                  You're in the right place if you're experiencing...
                </h2>
              </div>
              <div className="space-y-4">
                {idealClientIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-start gap-4 bg-[#F5F3F0] p-5 rounded-lg border border-[#EDEBE8] shadow-sm">
                    <Check className="h-5 w-5 text-[#CDA7B2] flex-shrink-0 mt-1" />
                    <span className="text-[#3B3937] font-light leading-relaxed">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-8 leading-tight">
            Let's Make Production<br />Feel Manageable
          </h2>
          <p className="text-xl text-[#967F71] mb-12 leading-relaxed font-light">
            You don't have to figure this out alone. Whether you need a quick consultation<br />or ongoing support, I'm here to help you move forward with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button
                size="lg"
                className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-16 px-12 text-xl font-light group w-full sm:w-auto"
              >
                Work With Me
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/quiz/about">
              <Button
                size="lg"
                variant="outline"
                className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-16 px-12 text-xl font-light w-full sm:w-auto"
              >
                Take the Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
