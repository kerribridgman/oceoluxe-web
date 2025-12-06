import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Layers, Zap, Heart, ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('home');
}

export default async function StudioSystemsPage() {
  const oceoMethodSteps = [
    {
      icon: <Layers className="h-12 w-12 text-[#CDA7B2]" />,
      title: "Organize",
      description: "Set up your supplier systems, calendars, and costing templates so you always know what's coming."
    },
    {
      icon: <Zap className="h-12 w-12 text-[#CDA7B2]" />,
      title: "Optimize",
      description: "Streamline communication with human-first scripts that reduce ghosting and get faster replies."
    },
    {
      icon: <Heart className="h-12 w-12 text-[#CDA7B2]" />,
      title: "Own It",
      description: "Implement nervous system practices + decision-making tools so you scale without sacrificing yourself."
    }
  ];

  const struggles = [
    "Scrambling to source fabrics last-minute with zero clarity on timelines",
    "Writing (& rewriting) follow-up emails to factories that never respond",
    "Missing deadlines, late deliveries, and constant rescheduling",
    "Focusing on everything except the reason they started",
    "Guessing at pricing, unsure if you're actually making a profit",
    "Spending more time managing chaos than designing your collection"
  ];

  const solutions = [
    "Working from a finalized sourcing list with vetted sustainable suppliers and materials",
    "Using plug-and-play email scripts to get factory replies fast (no more ghosting)",
    "Following a mapped-out production calendar that runs from sampling to delivery",
    "Making confident pricing decisions with costing sheets that show your margins, line by line",
    "Reclaiming 10+ hours a week to design, create, and actually breathe — without burning out",
    "Designing from a place of flow while your systems work for you"
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section - Split Layout */}
      <section className="bg-[#f5f0ea]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-serif font-light text-[#3B3937] leading-tight">
                  The Membership That Gives Designers <span className="italic">& Visionaries</span>{' '}
                  <span className="text-[#CDA7B2]">Structure as Support</span>
                </h1>
                <p className="text-xl text-[#967F71] font-light leading-relaxed">
                  Stop spinning in overwhelm and finally bring your ideas to life with systems that feel like luxury.
                </p>
              </div>
              <Link href="/studio-systems/waitlist">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-14 px-10 text-lg font-light group"
                >
                  Join Waitlist Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            {/* Right: Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-workspace.jpg"
                  alt="Fashion design workspace with mood boards"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-[#CDA7B2]/10 px-6 py-2 rounded-full mb-6">
            <span className="text-[#CDA7B2] font-medium text-sm tracking-wide">Free Quiz</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
            What Kind of Designer Are You?
          </h2>
          <p className="text-xl text-[#967F71] font-light leading-relaxed mb-4 max-w-2xl mx-auto">
            You do not have to produce 300 pieces in every color just because that is what the industry tells you.
            You do not have to position yourself as mass fashion if that is not your vision.
          </p>
          <p className="text-xl text-[#967F71] font-light leading-relaxed mb-4 max-w-2xl mx-auto">
            Whether you are building a luxury atelier with 50 devoted clients or scaling a collection that reaches thousands—your
            production strategy should match <span className="italic">your</span> design philosophy, not someone else's playbook.
          </p>
          <p className="text-lg text-[#3B3937] font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            This 2-minute quiz reveals your Designer Archetype—so you can finally build production and marketing
            systems that align with who you actually are.
          </p>
          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-16 px-12 text-xl font-light group"
            >
              Discover Your Archetype
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/sewing-machine.png"
                  alt="Hands working on sewing machine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Content */}
            <div className="order-1 lg:order-2 space-y-10">
              <div>
                <p className="text-xl text-[#967F71] mb-6 font-light italic">In my 12 years of working in the fashion industry...</p>
                <h2 className="text-4xl font-serif font-light text-[#3B3937] mb-8 leading-tight">
                  I've seen fashion designers fall into the trap of...
                </h2>
              </div>
              <div className="space-y-4">
                {struggles.slice(0, 4).map((struggle, index) => (
                  <div key={index} className="flex items-start gap-4 bg-[#F5F3F0] p-5 rounded-lg border border-[#EDEBE8] shadow-sm">
                    <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-1" />
                    <span className="text-[#3B3937] font-light leading-relaxed">{struggle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-4 leading-tight">
              When really you should be...
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {solutions.map((solution, index) => (
              <div key={index} className="flex items-start gap-4 bg-[#F5F3F0] p-8 rounded-xl border border-[#EDEBE8] shadow-sm hover:shadow-md transition-shadow">
                <Check className="h-6 w-6 text-[#CDA7B2] flex-shrink-0 mt-1" />
                <span className="text-[#3B3937] font-light leading-relaxed text-lg">{solution}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Oceo Method - Full Width Image Background */}
      <section className="relative py-32 overflow-hidden">
        {/* Background with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/95 to-white/95"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block bg-[#CDA7B2]/10 px-8 py-3 rounded-full mb-8">
              <span className="text-[#CDA7B2] font-medium text-lg">The Signature Framework</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-light text-[#3B3937] mb-8 leading-tight">
              The Oceo Method™
            </h2>
            <p className="text-2xl text-[#967F71] max-w-3xl mx-auto leading-relaxed font-light">
              A calm, connected approach to production — for fashion founders and visionaries who value both structure and sanity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {oceoMethodSteps.map((step, index) => (
              <Card key={index} className="border border-[#EDEBE8] bg-[#F5F3F0] shadow-xl hover:shadow-2xl transition-shadow">
                <CardContent className="pt-12 pb-10 text-center">
                  <div className="flex justify-center mb-8 bg-[#CDA7B2]/10 w-20 h-20 rounded-full items-center mx-auto">
                    {step.icon}
                  </div>
                  <h3 className="text-3xl font-serif font-light text-[#3B3937] mb-6 tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-[#6B655C] leading-relaxed font-light text-lg">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xl text-[#3B3937]/90 leading-relaxed italic font-light">
              If you're someone who is looking to bring more clarity to your processes, connection to your creative and operational flow, and capacity to scale your vision without burning out, this membership was built for you.
            </p>
          </div>
        </div>
      </section>

      {/* Luxury Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
            A Luxury-Level Membership<br />for the Price of Coffee & Croissant
          </h2>
          <div className="my-8">
            <p className="text-[#967F71] line-through text-lg mb-2 font-light">Final Price: $80/month</p>
            <div className="text-6xl font-serif font-light text-[#3B3937] mb-2">
              $33<span className="text-3xl text-[#967F71]">/month</span>
            </div>
            <p className="text-[#967F71] font-light italic">(No strings attached, cancel anytime)</p>
            <p className="text-sm text-[#CDA7B2] mt-4 font-medium">Limited Time: $33/month for the first 20 members only</p>
          </div>
          <Link href="/studio-systems/waitlist">
            <Button
              size="lg"
              className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-16 px-12 text-xl font-light mt-8"
            >
              Join Waitlist Now
            </Button>
          </Link>
          <p className="text-sm text-[#967F71] mt-6 font-light">
            No thanks, I'll figure it out on my own
          </p>
        </div>
      </section>

      {/* Inspiration Quote with Image */}
      <section className="relative py-32 overflow-hidden bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <blockquote className="text-3xl md:text-4xl font-serif font-light text-[#3B3937] leading-relaxed italic">
                "You didn't become a designer to chase deadlines or question your worth. You became one to create — to bring beauty and meaning into the world."
              </blockquote>
              <p className="text-lg text-[#967F71] mt-8 font-light">
                — Studio Systems by Oceo Luxe
              </p>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/runway.png"
                alt="Fashion runway show"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#3B3937] mb-6 leading-tight">
            Ready to Reclaim Your Time<br />and Creative Flow?
          </h2>
          <p className="text-xl text-[#967F71] mb-12 leading-relaxed font-light">
            Join Studio Systems as a Founding Member and get access to The Oceo Method™,<br />
            monthly Studio Sessions, and a community of fashion founders building with clarity and calm.
          </p>
          <Link href="/studio-systems/waitlist">
            <Button
              size="lg"
              className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-16 px-12 text-xl font-light group"
            >
              Join Waitlist Now
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-lg text-[#967F71] mt-8 font-light">
            $33/month for the first 20 members • After that, price increases to $59/month
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
