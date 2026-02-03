import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('studio-systems');
}

export default async function StudioSystemsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                Studio Systems Membership
              </p>
              {/* Decorative line under tagline */}
              <div className="w-16 h-0.5 bg-[#CDA7B2] opacity-60 -mt-2" aria-hidden="true" />
              <h1 className="text-4xl lg:text-5xl font-light text-[#3B3937] leading-[1.15] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                Structure as support for designers and visionaries.
              </h1>
              <p className="text-xl text-[#967F71] font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                Stop spinning in overwhelm and finally bring your ideas to life with systems that feel like luxury.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <Link href="/studio-systems/waitlist">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#967F71] text-[#967F71] hover:bg-[#967F71] hover:text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Find Your Designer Archetype
                  </Button>
                </Link>
              </div>
            </div>
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
                  src="/images/hero-workspace.jpg"
                  alt="Fashion design workspace"
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

      {/* Quiz Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6">
            Free Quiz
          </p>
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-8 tracking-tight">
            What kind of designer are you?
          </h2>
          <div className="space-y-6 text-lg text-[#967F71] font-light leading-relaxed mb-10">
            <p>
              You do not have to produce 300 pieces in every color just because that is what the industry tells you. You do not have to position yourself as mass fashion if that is not your vision.
            </p>
            <p>
              Whether you are building a luxury atelier with 50 devoted clients or scaling a collection that reaches thousands, your production strategy should match <em>your</em> design philosophy, not someone else's playbook.
            </p>
            <p className="text-[#3B3937]">
              This 2-minute quiz reveals your Designer Archetype so you can finally build production and marketing systems that align with who you actually are.
            </p>
          </div>
          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
            >
              Discover Your Archetype
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              <div className="aspect-square overflow-hidden relative rounded-lg">
                <Image
                  src="/images/designer-fabrics-cityview.png"
                  alt="Fashion designer reviewing fabric swatches with city skyline in background"
                  fill
                  className="object-cover rounded-lg"
                  quality={95}
                />
              </div>
            </div>
            <div className="lg:order-1">
              <p className="text-lg text-[#967F71] mb-6 font-light italic">In my 12 years of working in the fashion industry...</p>
              <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-10 tracking-tight">
                I've seen fashion designers fall into the trap of...
              </h2>
              <ul className="space-y-4 text-lg text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Scrambling to source fabrics last-minute with zero clarity on timelines</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Writing and rewriting follow-up emails to factories that never respond</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Missing deadlines, late deliveries, and constant rescheduling</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Focusing on everything except the reason they started</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-10 tracking-tight">
            When really you should be...
          </h2>
          <ul className="space-y-4 text-lg text-[#967F71] font-light">
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Working from a finalized sourcing list with vetted sustainable suppliers</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Using plug-and-play email scripts to get factory replies fast</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Following a mapped-out production calendar from sampling to delivery</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Making confident pricing decisions with costing sheets that show your margins</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Reclaiming 10+ hours a week to design, create, and actually breathe</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-[#CDA7B2] mt-1">—</span>
              <span>Designing from a place of flow while your systems work for you</span>
            </li>
          </ul>
        </div>
      </section>

      {/* The Oceo Method */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6">
            The Signature Framework
          </p>
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-6 tracking-tight">
            The Oceo Method
          </h2>
          <p className="text-xl text-[#967F71] font-light leading-relaxed mb-12">
            A calm, connected approach to production for fashion founders and visionaries who value both structure and sanity.
          </p>

          <div className="space-y-8">
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2 text-lg">Organize</p>
              <p className="text-[#967F71] font-light">Set up your supplier systems, calendars, and costing templates so you always know what's coming.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2 text-lg">Optimize</p>
              <p className="text-[#967F71] font-light">Streamline communication with human-first scripts that reduce ghosting and get faster replies.</p>
            </div>
            <div className="border-l-2 border-[#CDA7B2] pl-6">
              <p className="text-[#3B3937] font-medium mb-2 text-lg">Own It</p>
              <p className="text-[#967F71] font-light">Implement nervous system practices and decision-making tools so you scale without sacrificing yourself.</p>
            </div>
          </div>

          <p className="text-lg text-[#3B3937] mt-12 font-light leading-relaxed italic">
            If you're someone who is looking to bring more clarity to your processes, connection to your creative and operational flow, and capacity to scale your vision without burning out, this membership was built for you.
          </p>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6">
            What's Inside
          </p>
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-12 tracking-tight">
            Inside Studio Systems, You'll Get
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="hidden lg:block relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#CDA7B2]/20" aria-hidden="true" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-[#967F71]/10" aria-hidden="true" />
              <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
                <Image
                  src="/images/designer-workspace.png"
                  alt="Designer working at desk with fabric swatches, sketchbooks, and computer"
                  fill
                  className="object-cover"
                  quality={95}
                />
              </div>
            </div>

            <div>
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-medium text-[#3B3937] mb-3">Twice-Monthly Live Q&A Calls</h3>
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    Direct access to real-time support so you can pressure-test decisions, get unstuck fast, and move your production forward with accuracy instead of second-guessing.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-[#3B3937] mb-3">A Complete Notion System</h3>
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    Instant access to done-for-you Notion templates covering production, distribution, marketing, sales, and launches — so you're not building systems from scratch or keeping everything in your head.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-[#3B3937] mb-3">A Private Designer Community</h3>
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    Ask questions, share wins, and get perspective from designers navigating the same stage of business. Supplier insider information, real-time feedback, and people who get it.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-[#3B3937] mb-3">Leadership & Somatic Support</h3>
                  <p className="text-lg text-[#967F71] font-light leading-relaxed">
                    Regulated leaders build sustainable brands. Practical tools to help you stay grounded and decisive, including yoga flows, body scans, and nervous-system regulation practices designed for creative founders.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <Link href="/studio-systems/waitlist">
                  <Button
                    size="lg"
                    className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6">
            Founding Member Pricing
          </p>
          <h2 className="text-3xl lg:text-4xl font-light text-white mb-8 tracking-tight">
            A luxury-level membership for the price of coffee and croissant.
          </h2>
          <div className="mb-8">
            <p className="text-white/50 line-through text-lg mb-2 font-light">Regular Price: $88/month</p>
            <div className="text-5xl font-light text-white mb-2">
              $55<span className="text-2xl text-white/70">/month</span>
            </div>
            <p className="text-white/70 font-light">No strings attached. Cancel anytime.</p>
            <p className="text-sm text-[#CDA7B2] mt-4 font-medium">Founding member pricing for the first 20 members</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio-systems/waitlist">
              <Button
                size="lg"
                className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-12 px-8 text-base font-normal tracking-wide"
              >
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/book">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-normal tracking-wide"
              >
                Have Questions? Let's Talk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <blockquote className="text-2xl lg:text-3xl font-light text-[#3B3937] leading-relaxed italic">
                "You didn't become a designer to chase deadlines or question your worth. You became one to create, to bring beauty and meaning into the world."
              </blockquote>
              <p className="text-lg text-[#967F71] mt-8 font-light">
                — Studio Systems by Oceo Luxe
              </p>
            </div>
            <div className="aspect-square overflow-hidden relative rounded-lg">
              <Image
                src="/images/runway.png"
                alt="Fashion runway show"
                fill
                className="object-cover rounded-lg"
                quality={95}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-6 tracking-tight">
            Ready to reclaim your time and creative flow?
          </h2>
          <p className="text-lg text-[#967F71] mb-10 font-light leading-relaxed">
            Join Studio Systems as a Founding Member and get access to The Oceo Method, monthly Studio Sessions, and a community of fashion founders building with clarity and calm.
          </p>
          <Link href="/studio-systems/waitlist">
            <Button
              size="lg"
              className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
            >
              Join Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-[#967F71] mt-6 font-light">
            $55/month for founding members • $88/month after the first 20
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
