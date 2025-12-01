import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Sparkles, Layout, Users, Globe } from 'lucide-react';
import { Metadata } from 'next';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export const metadata: Metadata = {
  title: 'Services | Oceo Luxe',
  description: 'Production systems, strategic support, and workflow setup for independent fashion designers and founders.',
};

export default async function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f5f0ea] to-[#faf8f5]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-light text-[#3B3937] mb-6">
              Services & Programs
            </h1>
            <p className="text-xl text-[#967F71] max-w-3xl mx-auto font-light leading-relaxed">
              Choose the right support for your stage of growth. From production systems to strategic guidance for your fashion business.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

          {/* Service 1: Studio Systems Membership */}
          <div id="studio-systems" className="scroll-mt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-[#CDA7B2]/10 px-6 py-2 rounded-full mb-6">
                  <span className="text-[#CDA7B2] font-medium flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enrollment Opening Soon
                  </span>
                </div>
                <h2 className="text-4xl font-serif font-light text-[#3B3937] mb-4">
                  Studio Systems Membership
                </h2>
                <p className="text-xl text-[#CDA7B2] font-light mb-4">
                  Custom systems, strategic support, and personal optimization
                </p>
                <p className="text-lg text-[#967F71] font-light mb-6 leading-relaxed">
                  For fashion founders and production managers ready to organize scattered processes into a foundation that feels grounded, intentional, and built to last.
                </p>
                <p className="text-lg font-light text-[#3B3937] mb-4">
                  A membership that combines structure with support.
                </p>
              </div>

              <div className="bg-[#F5F3F0] rounded-2xl p-8 shadow-xl border border-[#EDEBE8]">
                <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-6">What's Included</h3>
                <ul className="space-y-4">
                  {[
                    'Monthly templates, workflows, and setup guides for fashion businesses',
                    'Operations support for production, sourcing, and team coordination',
                    'Community of creative founders',
                    'Exclusive early-member resources and workshops'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-6 h-6 text-[#CDA7B2] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B655C] font-light">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/studio-systems" className="block">
                    <Button size="lg" className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white">
                      Join the Waitlist
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Service 2: Systems Implementation */}
          <div id="systems-implementation" className="scroll-mt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-[#F5F3F0] rounded-2xl p-8 border border-[#EDEBE8]">
                <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-6">Services Include</h3>
                <ul className="space-y-4">
                  {[
                    'Notion templates and custom dashboards',
                    'Product development and inventory organization',
                    'Sampling, production, or fulfillment workflow streamlining',
                    'Client or team onboarding systems'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-6 h-6 text-[#CDA7B2] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B655C] font-light">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 space-y-3">
                  <a href="mailto:kerrib@oceoluxe.com">
                    <Button size="lg" className="w-full bg-[#CDA7B2] hover:bg-[#BD97A2] text-white">
                      Request Custom Pricing
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <Layout className="w-16 h-16 text-[#CDA7B2] mb-6" />
                <h2 className="text-4xl font-serif font-light text-[#3B3937] mb-4">
                  Systems Implementation & Workflow Setup
                </h2>
                <p className="text-xl text-[#CDA7B2] font-light mb-4">
                  Custom pricing upon request
                </p>
                <p className="text-lg text-[#967F71] font-light mb-6 leading-relaxed">
                  For founders needing a clean, centralized foundation instead of piecemeal solutions. Get professional systems tailored to your fashion business operations.
                </p>
                <p className="text-xl font-light text-[#3B3937]">
                  Build the foundation your business deserves.
                </p>
              </div>
            </div>
          </div>

          {/* Service 3: Strategic Guidance */}
          <div id="strategic-guidance" className="scroll-mt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Users className="w-16 h-16 text-[#CDA7B2] mb-6" />
                <h2 className="text-4xl font-serif font-light text-[#3B3937] mb-4">
                  Strategic Guidance & Business Evolution
                </h2>
                <p className="text-xl text-[#CDA7B2] font-light mb-4">
                  Custom pricing upon request
                </p>
                <p className="text-lg text-[#967F71] font-light mb-6 leading-relaxed">
                  For fashion founders ready to scale with clarity. We will assess your current processes, identify bottlenecks, and create a roadmap for sustainable growth that protects your creative energy.
                </p>
                <blockquote className="text-lg text-[#3B3937] font-light italic border-l-4 border-[#CDA7B2] pl-6 mb-6">
                  "The right strategy transforms how you build and grow."
                </blockquote>
              </div>

              <div className="bg-[#F5F3F0] rounded-2xl p-8 shadow-xl border border-[#EDEBE8]">
                <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-6">What You Get</h3>
                <ul className="space-y-4">
                  {[
                    'Assessment of current processes and pain points',
                    'Production strategy aligned with your brand positioning',
                    'Pricing and quantity guidance based on your archetype',
                    'Roadmap for sustainable business growth'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-6 h-6 text-[#CDA7B2] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B655C] font-light">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a href="mailto:kerrib@oceoluxe.com">
                    <Button size="lg" className="w-full bg-[#3B3937] hover:bg-[#4A4745] text-white">
                      Request Custom Pricing
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Service 4: Website Development */}
          <div id="website-development" className="scroll-mt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-[#F5F3F0] rounded-2xl p-8 border border-[#EDEBE8]">
                <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-6">What's Included</h3>
                <ul className="space-y-4">
                  {[
                    'Custom website built to showcase your work and experience',
                    'Design that reflects the quality of your craft',
                    'Portfolio, lookbook, or service pages tailored to your role',
                    'Mobile-responsive and optimized for how clients find you',
                    'Guidance from someone who understands the industry'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-6 h-6 text-[#CDA7B2] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B655C] font-light">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 space-y-3">
                  <a href="mailto:kerrib@oceoluxe.com">
                    <Button size="lg" className="w-full bg-[#CDA7B2] hover:bg-[#BD97A2] text-white">
                      Request Custom Pricing
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <Globe className="w-16 h-16 text-[#CDA7B2] mb-6" />
                <h2 className="text-4xl font-serif font-light text-[#3B3937] mb-4">
                  Website Development for Fashion Professionals
                </h2>
                <p className="text-xl text-[#CDA7B2] font-light mb-4">
                  Custom pricing upon request
                </p>
                <p className="text-lg text-[#967F71] font-light mb-6 leading-relaxed">
                  For designers, production managers, stylists, consultants, and anyone in the fashion industry who needs a website that actually represents their work. Built by someone who has worked across the entire industry and understands what you do.
                </p>
                <blockquote className="text-lg text-[#3B3937] font-light italic border-l-4 border-[#CDA7B2] pl-6 mb-6">
                  "Your website should work as hard as you do."
                </blockquote>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#f5f0ea] to-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-light text-[#3B3937] mb-6">
            Not Sure Which is Right for You?
          </h2>
          <p className="text-xl text-[#967F71] font-light mb-8 leading-relaxed">
            Let's connect and build a custom plan together
          </p>
          <a href="mailto:kerrib@oceoluxe.com">
            <Button size="lg" className="bg-[#3B3937] hover:bg-[#4A4745] text-white text-lg px-8 h-14">
              Get in Touch
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
