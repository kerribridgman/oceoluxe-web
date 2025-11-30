import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight, Layers, Heart, Users } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('home');
}

export default async function HomePage() {
  const idealClientIndicators = [
    "Overwhelmed by supplier and manufacturer options",
    "Strong design vision but unclear production process",
    "Unsure how many pieces to produce or how to price them",
    "Spending more time managing chaos than designing",
    "Following industry advice that does not fit your brand",
    "Ready to build a sustainable fashion business on your terms"
  ];

  const offerings = [
    {
      icon: <Layers className="h-10 w-10 text-[#CDA7B2]" />,
      title: "Production Systems\n& Workflow Setup",
      description: "Notion templates, production calendars, and streamlined workflows that take you from concept to finished collection"
    },
    {
      icon: <Users className="h-10 w-10 text-[#CDA7B2]" />,
      title: "Understand Your\nIdeal Client",
      description: "Discover your designer archetype and learn how to position your brand for the clients who truly value your work"
    },
    {
      icon: <Heart className="h-10 w-10 text-[#CDA7B2]" />,
      title: "Build With\nClarity & Calm",
      description: "Strategic guidance and sustainable systems that protect your creative energy while scaling your fashion business"
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
                  Build a Fashion Brand With <span className="text-[#CDA7B2]">Clarity, Structure</span> & Zero Guesswork
                </h1>
                <p className="text-xl text-[#967F71] font-light leading-relaxed">
                  Oceo Luxe helps independent designers and visionary founders bring their ideas to life with real production guidance, streamlined systems, and AI-powered operations support.
                </p>
                <p className="text-lg text-[#3B3937] font-light leading-relaxed">
                  Turn your creative vision into a profitable, organized, sustainable fashion business.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-14 px-10 text-lg font-light group w-full sm:w-auto"
                  >
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/studio-systems">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-14 px-10 text-lg font-light w-full sm:w-auto"
                  >
                    Join Studio Systems
                  </Button>
                </Link>
              </div>
            </div>
            {/* Right: Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
                <Image
                  src="/images/hero-systems.png"
                  alt="Business systems and organization"
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

      {/* What You Will Find Here Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
              How We Help Fashion Designers
            </h2>
            <p className="text-xl text-[#967F71] max-w-4xl mx-auto leading-relaxed font-light">
              Production guidance, Notion templates, and sustainable systems designed specifically for independent fashion brands.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {offerings.map((offering, index) => (
              <Card key={index} className="border-[#967F71]/20 bg-gradient-to-br from-[#faf8f5] to-white hover:shadow-lg transition-shadow">
                <CardContent className="pt-10 pb-8 text-center">
                  <div className="flex justify-center mb-6">
                    {offering.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-4 whitespace-pre-line">
                    {offering.title}
                  </h3>
                  <p className="text-[#967F71] leading-relaxed font-light">
                    {offering.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#faf8f5] to-[#CDA7B2]/5 rounded-2xl p-10 border border-[#CDA7B2]/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-serif font-light text-[#3B3937] mb-6">
                  Production Resources & Notion Templates
                </h3>
                <p className="text-[#967F71] leading-relaxed font-light text-lg mb-6">
                  Ready-to-use Notion templates for fashion production: collection planners, costing sheets, supplier trackers, and production calendars. Many available for free to help you get started.
                </p>
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white"
                  >
                    Browse Resources
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="aspect-square w-full max-w-md rounded-xl overflow-hidden shadow-lg relative">
                  <Image
                    src="/images/ai-systems.png"
                    alt="Fashion production Notion templates"
                    fill
                    className="object-cover"
                    quality={95}
                  />
                </div>
              </div>
            </div>
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
                  <div key={index} className="flex items-start gap-4 bg-white p-5 rounded-lg border border-[#967F71]/10 shadow-sm">
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
            Ready to bring clarity to<br />your fashion business?
          </h2>
          <p className="text-xl text-[#967F71] mb-12 leading-relaxed font-light">
            Take the quiz to discover your designer archetype, or explore our production resources and membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz/about">
              <Button
                size="lg"
                className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-16 px-12 text-xl font-light group w-full sm:w-auto"
              >
                Take the Quiz
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/studio-systems">
              <Button
                size="lg"
                variant="outline"
                className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-16 px-12 text-xl font-light w-full sm:w-auto"
              >
                Join Studio Systems
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
