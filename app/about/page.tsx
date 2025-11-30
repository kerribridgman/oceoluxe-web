import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, Target, Heart } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('about');
}

export default async function AboutPage() {
  const coreValues = [
    {
      icon: <Sparkles className="h-8 w-8 text-[#CDA7B2]" />,
      title: "Structure Supports Creativity",
      description: "Systematized processes don't constrain creative work—they enable it. The right structure frees mental space for innovation and strategic thinking."
    },
    {
      icon: <Target className="h-8 w-8 text-[#CDA7B2]" />,
      title: "Ideas to Momentum",
      description: "Brilliant ideas require operational infrastructure to become reality. Every system is designed to transform vision into measurable progress."
    },
    {
      icon: <Heart className="h-8 w-8 text-[#CDA7B2]" />,
      title: "Proven, Not Generic",
      description: "These aren't theoretical frameworks. Every tool and template represents battle-tested systems used successfully with real founders and executives."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#f5f0ea]">
        <div className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Left: Content */}
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl lg:text-5xl font-serif font-light text-[#3B3937] leading-tight">
                Hi, I'm <span className="text-[#CDA7B2]">Kerri Bridgman</span>
              </h1>
              <p className="text-lg text-[#967F71] font-light leading-relaxed">
                Founder of Oceo Luxe, an operations strategist dedicated to building systems that support creative vision.
              </p>
              <p className="text-lg text-[#967F71] font-light leading-relaxed">
                My mission is simple: help designers and visionaries understand who they are designing for and how to build their business in a way that is sustainable, intentional, and true to their creative vision.
              </p>
            </div>
            {/* Right: Image */}
            <div className="flex-shrink-0">
              <div className="aspect-square w-48 lg:w-56 rounded-2xl overflow-hidden shadow-xl relative">
                <Image
                  src="/images/kerri-profile.png"
                  alt="Kerri Bridgman"
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

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-12 text-center leading-tight">
            My Story
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              I studied Production Management at the Fashion Institute of Technology and have spent the last decade working behind the scenes in fashion production, supply chain management, and executive support.
            </p>
            <p>
              My approach centers on a fundamental belief: <span className="italic text-[#3B3937] font-medium">"structure is the soul of sustainable creativity."</span> My work focuses on organizing operational chaos so that creative leaders can concentrate on their core mission—making exceptional work.
            </p>
            <p>
              Oceo Luxe was created in direct response to challenges I witnessed repeatedly among creatives and founders. I identified a critical gap: the absence of systematized processes that transform ideas into measurable momentum.
            </p>
            <p>
              The tools and templates available through Oceo Luxe represent more than generic frameworks. They are the exact systems I have personally used to support founders, creative professionals, and executives building meaningful ventures. Now these proven methodologies are accessible to others pursuing ambitious goals.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
              What Guides My Work
            </h2>
            <p className="text-xl text-[#967F71] max-w-3xl mx-auto leading-relaxed font-light">
              Three principles that shape every project, workflow, and client relationship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="border-[#967F71]/20 bg-gradient-to-br from-white to-[#faf8f5] hover:shadow-lg transition-shadow">
                <CardContent className="pt-10 pb-8">
                  <div className="flex justify-center mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-4 text-center">
                    {value.title}
                  </h3>
                  <p className="text-[#967F71] leading-relaxed font-light text-center">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif font-light text-[#3B3937] leading-tight">
                Background & Expertise
              </h2>
              <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
                <p>
                  <span className="font-semibold text-[#3B3937]">Fashion Production & Supply Chain:</span> A decade of hands-on experience in production management, vendor relationships, and operational logistics in the fashion industry.
                </p>
                <p>
                  <span className="font-semibold text-[#3B3937]">Systems Implementation:</span> From Notion templates to custom dashboards, I build systematized workflows that organize operational chaos and create measurable momentum.
                </p>
                <p>
                  <span className="font-semibold text-[#3B3937]">Executive Support:</span> Experience providing high-level operational support to founders and creative leaders, enabling them to focus on strategic vision rather than administrative details.
                </p>
                <p>
                  <span className="font-semibold text-[#3B3937]">Operations Strategy:</span> Specializing in identifying the critical gap between creative vision and operational execution, then building the infrastructure to bridge it.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#faf8f5] to-[#CDA7B2]/10 rounded-2xl p-12 border border-[#CDA7B2]/20">
              <h3 className="text-3xl font-serif font-light text-[#3B3937] mb-8 text-center">
                Who I Work With
              </h3>
              <ul className="space-y-4 text-lg text-[#967F71] font-light leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#CDA7B2] text-2xl">•</span>
                  <span>Fashion and creative entrepreneurs navigating production and operations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CDA7B2] text-2xl">•</span>
                  <span>Visionary founders who need backend systems to match their big ideas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CDA7B2] text-2xl">•</span>
                  <span>Executives experiencing decision fatigue and overwhelm</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CDA7B2] text-2xl">•</span>
                  <span>Leaders ready to align their personal style with their professional presence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-8 leading-tight">
            Ready to work together?
          </h2>
          <p className="text-xl text-[#967F71] mb-12 leading-relaxed font-light">
            Let's bring clarity to your backend operations and create systems that support your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button
                size="lg"
                className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-16 px-12 text-xl font-light group w-full sm:w-auto"
              >
                View Services
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/book">
              <Button
                size="lg"
                variant="outline"
                className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-16 px-12 text-xl font-light w-full sm:w-auto"
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
