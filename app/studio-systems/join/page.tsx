import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Layers, Zap, Heart, ArrowRight } from 'lucide-react';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export const metadata: Metadata = {
  title: 'Join Studio Systems | Oceo Luxe',
  description: 'The membership that gives designers & visionaries structure as support. Stop spinning in overwhelm and finally bring your ideas to life with systems that feel like luxury.',
};

const oceoMethodSteps = [
  {
    icon: Layers,
    title: "Organize",
    description: "Set up your supplier systems, calendars, and costing templates so you always know what's coming."
  },
  {
    icon: Zap,
    title: "Optimize",
    description: "Streamline communication with human-first scripts that reduce ghosting and get faster replies."
  },
  {
    icon: Heart,
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

export default function StudioSystemsJoinPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Minimal Navigation Header */}
      <header className="border-b border-[#967F71]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/studio-systems" className="flex items-center space-x-3">
            <h1 className="text-2xl font-serif font-light text-[#3B3937] tracking-wide">Studio Systems</h1>
            <span className="text-sm text-[#967F71] italic font-light">by Oceo Luxe</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-[#3B3937] hover:text-[#967F71] font-light"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/studio-systems/join#pricing">
              <Button
                className="bg-[#3B3937] hover:bg-[#3B3937]/90 text-white font-light px-6"
              >
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

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
              <Link href="/studio-systems/join#pricing">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#3B3937]/90 text-white h-14 px-10 text-lg font-light group"
                >
                  Join Now for $33/month
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-[#967F71] font-light italic">(No strings attached, cancel anytime)</p>
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

      {/* Tagline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-2xl md:text-3xl font-serif font-light text-[#3B3937] leading-relaxed">
            ✨ Where clarity meets calm in modern fashion production
          </p>
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
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-[#faf8f5] to-white">
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
            {oceoMethodSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="border border-[#EDEBE8] bg-[#F5F3F0] shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="pt-12 pb-10 text-center">
                    <div className="flex justify-center mb-8 bg-[#CDA7B2]/10 w-20 h-20 rounded-full items-center mx-auto">
                      <Icon className="h-12 w-12 text-[#CDA7B2]" />
                    </div>
                    <h3 className="text-3xl font-serif font-light text-[#3B3937] mb-6 tracking-wide">
                      {step.title}
                    </h3>
                    <p className="text-[#6B655C] leading-relaxed font-light text-lg">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xl text-[#3B3937]/90 leading-relaxed italic font-light">
              If you're someone who is looking to bring more clarity to your processes, connection to your creative and operational flow, and capacity to scale your vision without burning out, this membership was built for you.
            </p>
          </div>
        </div>
      </section>

      {/* Luxury Pricing Section */}
      <section id="pricing" className="py-24 bg-white scroll-mt-20">
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
          <Link href="/sign-up?plan=studio-systems">
            <Button
              size="lg"
              className="bg-[#3B3937] hover:bg-[#3B3937]/90 text-white h-16 px-12 text-xl font-light mt-8"
            >
              Yes, I'm In — Join Now
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
          <Link href="/sign-up?plan=studio-systems">
            <Button
              size="lg"
              className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90 text-white h-16 px-12 text-xl font-light group"
            >
              Join as Founding Member
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
