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
      description: "Systematized processes don't constrain creative work, they enable it. The right structure frees mental space for innovation and strategic thinking."
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="aspect-square w-40 lg:w-48 rounded-2xl overflow-hidden shadow-xl relative mx-auto">
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
            <h1 className="text-5xl md:text-6xl font-serif font-light text-[#3B3937] mb-6">
              About
            </h1>
            <p className="text-xl text-[#967F71] max-w-3xl mx-auto font-light leading-relaxed">
              I'm Kerri Bridgman, founder of Oceo Luxe. I help designers and visionaries build their business in a way that is sustainable, intentional, and true to their creative vision.
            </p>
          </div>
        </div>
      </section>

      {/* I Understand Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-12 text-center leading-tight">
            I Understand Where You Are
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              You have the talent. You have the vision. But somewhere between the design and the delivery, things get overwhelming.
            </p>
            <p>
              Maybe you are drowning in supplier quotes, unsure which manufacturer is right for your brand. Maybe you are second-guessing your pricing because nothing feels quite right. Or maybe you are producing collections the way everyone says you should, but it is draining your creative energy instead of fueling it.
            </p>
            <p>
              I have spent a decade in fashion production and supply chain management. I studied Production Management at FIT and have worked behind the scenes with designers who felt exactly the way you do right now.
            </p>
            <p>
              What I learned is this: <span className="italic text-[#3B3937] font-medium">the problem is not your talent or your vision. It is the lack of systems designed for how you actually work.</span>
            </p>
            <p>
              The industry hands you one-size-fits-all advice. Produce 300 units. Use this pricing formula. Follow this timeline. But your brand is not one-size-fits-all, and your production strategy should not be either.
            </p>
          </div>
          <div className="text-center mt-12">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-14 px-10 text-lg font-light group"
              >
                Let's Talk About Your Vision
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
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

      {/* How I Help Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif font-light text-[#3B3937] leading-tight">
                How I Help
              </h2>
              <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
                <p>
                  <span className="font-semibold text-[#3B3937]">Understand Your Archetype:</span> Through the Designer Archetype quiz, discover how you naturally create so you can build a production strategy that works with your vision, not against it.
                </p>
                <p>
                  <span className="font-semibold text-[#3B3937]">Build Your Systems:</span> Notion templates, production calendars, costing sheets, and workflows designed specifically for fashion designers who need structure without the overwhelm.
                </p>
                <p>
                  <span className="font-semibold text-[#3B3937]">Find Your Strategy:</span> Whether you are producing 50 pieces for a devoted client base or scaling to thousands, get guidance that fits your brand positioning and creative goals.
                </p>
                <p>
                  <span className="font-semibold text-[#3B3937]">Protect Your Energy:</span> Sustainable systems that free up mental space so you can focus on what you do best: designing.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#faf8f5] to-[#CDA7B2]/10 rounded-2xl p-12 border border-[#CDA7B2]/20">
              <h3 className="text-3xl font-serif font-light text-[#3B3937] mb-8 text-center">
                This Is For You If...
              </h3>
              <ul className="space-y-4 text-lg text-[#967F71] font-light leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#CDA7B2] text-2xl">•</span>
                  <span>You are an independent designer ready to get organized</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CDA7B2] text-2xl">•</span>
                  <span>You have a strong vision but unclear production process</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CDA7B2] text-2xl">•</span>
                  <span>You are tired of following advice that does not fit your brand</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CDA7B2] text-2xl">•</span>
                  <span>You want to build sustainably without burning out</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Systems Section */}
      <section className="py-24 bg-[#3B3937]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-light mb-4">Ongoing Support</p>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-8 leading-tight">
            Studio Systems Membership
          </h2>
          <p className="text-xl text-white/80 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Not ready for 1:1 work? Studio Systems gives you access to the same frameworks, templates, and guidance I use with my private clients - at a pace that works for you.
          </p>
          <p className="text-lg text-white/70 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Monthly Studio Sessions, The Oceo Method™ course library, production templates, and a community of designers who get it. Structure as support - on your terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
