import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLdScript } from '@/components/seo/json-ld-script';

export async function generateMetadata() {
  return await getPageMetadata('about');
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

const breadcrumbJsonLd = getBreadcrumbJsonLd([
  { name: 'Home', url: baseUrl },
  { name: 'About', url: `${baseUrl}/about` },
]);

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <JsonLdScript data={breadcrumbJsonLd as unknown as Record<string, unknown>} />
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6 relative">
              {/* Decorative circle - top right */}
              <div
                className="absolute -top-4 right-0 w-20 h-20 rounded-full bg-[#CDA7B2] opacity-20 animate-float hidden lg:block"
                aria-hidden="true"
              />
              {/* Decorative circle - left side */}
              <div
                className="absolute top-1/3 -left-12 w-14 h-14 rounded-full bg-[#967F71] opacity-15 animate-float-slow hidden lg:block"
                aria-hidden="true"
              />
              {/* Decorative circle - bottom left */}
              <div
                className="absolute bottom-8 -left-6 w-8 h-8 rounded-full bg-[#CDA7B2] opacity-25 animate-float-delayed hidden lg:block"
                aria-hidden="true"
              />

              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
                About Kerri Bridgman
              </p>
              {/* Decorative line under tagline */}
              <div className="w-16 h-0.5 bg-[#CDA7B2] opacity-60 -mt-2" aria-hidden="true" />
              <h1 className="text-4xl lg:text-5xl font-light text-[#3B3937] leading-[1.15] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                I spent a decade watching talented designers get lost in production chaos.
              </h1>
              <p className="text-xl text-[#967F71] font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                Now I help them build the systems that free their creativity instead of stifling it.
              </p>
              <p className="text-sm text-[#967F71] font-light animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                FIT-trained Production Manager • 10 Years Creating Clarity for Founders & Visionaries
              </p>
              <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <Link href="/book">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Let's Talk
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            {/* Image */}
            <div className="relative">
              {/* Large decorative circle - behind image */}
              <div
                className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#967F71] opacity-10 animate-float-slow hidden lg:block"
                aria-hidden="true"
              />
              {/* Small decorative circle - corner accent */}
              <div
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#CDA7B2] opacity-30 animate-float-delayed hidden lg:block"
                aria-hidden="true"
              />
              {/* Diagonal line accent */}
              <div
                className="absolute -bottom-6 right-8 w-24 h-0.5 bg-[#CDA7B2] opacity-40 rotate-45 hidden lg:block"
                aria-hidden="true"
              />

              <div className="aspect-[4/5] overflow-hidden relative z-10 rounded-lg">
                <Image
                  src="/images/kerri-profile.png"
                  alt="Kerri Bridgman"
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

      {/* I Understand Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-10 tracking-tight">
            I understand where you are.
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              You have the talent. You have the vision. But somewhere between the design and the delivery, things became overwhelming.
            </p>
            <p>
              Maybe you're drowning in supplier quotes, unsure which manufacturer is right for your brand. Maybe you're second-guessing your pricing because the numbers don't feel quite right. Or maybe you're producing collections the way everyone says you should, but it's draining your creative energy instead of fueling it.
            </p>
            <p>
              I've spent a decade in fashion production and supply chain management. I studied Production Management at FIT and have worked behind the scenes with designers who felt exactly the way you do right now.
            </p>
            <p className="text-[#3B3937]">
              What I learned is this: the problem is not your talent or your vision. It's the lack of systems designed for how you actually work.
            </p>
          </div>
        </div>
      </section>

      {/* What I've Learned Section */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-10 tracking-tight">
            What I wish someone had told me.
          </h2>
          <div className="space-y-8">
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2">Complete specs upfront save you money.</p>
              <p className="text-[#967F71] font-light">Providing detailed tech packs, patterns, and fabric decisions before production prevents expensive back-and-forth and disputes later.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2">Industry timelines are longer than you think.</p>
              <p className="text-[#967F71] font-light">Most production runs start a year in advance. Add in Chinese New Year closures and holiday rush, and timing becomes everything.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2">One factory is never enough.</p>
              <p className="text-[#967F71] font-light">Even great relationships can fall through. Having backup factories vetted and ready protects your business when things go sideways.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2">Factories prioritize trusted relationships.</p>
              <p className="text-[#967F71] font-light">They give the best attention to designers they know and trust. Building that relationship takes time, visits, and clear communication.</p>
            </div>
          </div>
          <p className="text-lg text-[#967F71] font-light mt-10">
            This is what I teach, so you don't have to learn it the hard way.
          </p>
        </div>
      </section>

      {/* How I Help Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-10 tracking-tight">
            How I help.
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed">
            <p>
              <span className="text-[#3B3937]">Factory communication support.</span> Learn what to say, how to say it, and when. Get scripts, templates, and guidance for clear communication that prevents costly misunderstandings.
            </p>
            <p>
              <span className="text-[#3B3937]">Production systems & workflows.</span> Build the operational backbone your brand needs: production calendars, sampling trackers, costing sheets, and supplier management.
            </p>
            <p>
              <span className="text-[#3B3937]">Sustainable sourcing guidance.</span> Navigate ethical production without the overwhelm. Get clear guidance on materials, suppliers, and relationships that align with your values.
            </p>
            <p>
              <span className="text-[#3B3937]">Strategic clarity.</span> Whether you're producing 50 pieces for a devoted client base or scaling to thousands, get guidance that fits your brand positioning and creative goals.
            </p>
          </div>
          <div className="mt-12">
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-[#3B3937] text-[#3B3937] hover:bg-[#3B3937] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
              >
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* This Is For You Section */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-10 tracking-tight">
                This is for you if...
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>You're an independent designer ready to get organized</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>You have a strong vision but unclear production process</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>You're tired of following advice that doesn't fit your brand</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>You want to build sustainably without burning out</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/book">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide w-full sm:w-auto"
                  >
                    Book an Intro Call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="mailto:kerrib@oceoluxe.com">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide w-full sm:w-auto"
                  >
                    Send an Email
                  </Button>
                </a>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#CDA7B2]/20" />
                <div className="absolute bottom-8 left-0 w-36 h-36 rounded-full bg-[#967F71]/15" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#CDA7B2]/30" />
                <div className="absolute bottom-0 right-12 w-20 h-20 rounded-full bg-[#3B3937]/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Systems Section */}
      <section className="py-24 bg-[#3B3937]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6">
            Ongoing Support
          </p>
          <h2 className="text-3xl lg:text-4xl font-light text-white mb-6 tracking-tight">
            Studio Systems Membership
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light max-w-2xl mx-auto">
            Not ready for 1:1 work? Studio Systems gives you access to the same frameworks, templates, and guidance I use with my private clients — at a pace that works for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-normal tracking-wide"
              >
                Find Your Designer Archetype
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-6 tracking-tight">
            Ready to work together?
          </h2>
          <p className="text-lg text-[#967F71] mb-10 font-light">
            Let's bring clarity to your production process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button
                size="lg"
                className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
              >
                View Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/book">
              <Button
                variant="outline"
                size="lg"
                className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
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
