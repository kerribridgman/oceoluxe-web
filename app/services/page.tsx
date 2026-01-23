import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('services');
}

export default async function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="bg-[#faf8f5] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24 relative">
          {/* Decorative circles */}
          <div
            className="absolute top-8 right-0 w-20 h-20 rounded-full bg-[#CDA7B2] opacity-20 animate-float hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 -left-16 w-14 h-14 rounded-full bg-[#967F71] opacity-15 animate-float-slow hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-4 -left-8 w-8 h-8 rounded-full bg-[#CDA7B2] opacity-25 animate-float-delayed hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-12 right-12 w-12 h-12 rounded-full bg-[#967F71] opacity-10 animate-float hidden lg:block"
            aria-hidden="true"
          />

          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Services
          </p>
          {/* Decorative line under tagline */}
          <div className="w-16 h-0.5 bg-[#CDA7B2] opacity-60 mb-6" aria-hidden="true" />
          <h1 className="text-4xl lg:text-5xl font-light text-[#3B3937] leading-[1.15] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Factory communication, production systems, and strategic guidance.
          </h1>
          <p className="text-xl text-[#967F71] font-light leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            For designers who want to produce consciously without the overwhelm.
          </p>
        </div>
      </section>

      {/* Studio Systems Membership */}
      <section id="studio-systems" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-4">
                Ongoing Support
              </p>
              <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-4 tracking-tight">
                Studio Systems Membership
              </h2>
              <p className="text-lg text-[#967F71] font-light mb-6 leading-relaxed">
                For fashion designers who want clarity in their production process. Learn The Oceo Method framework to communicate with factories, build sustainable systems, and scale without burning out.
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-light text-[#3B3937]">$33</span>
                <span className="text-lg text-[#967F71] font-light">/month</span>
                <span className="text-sm text-[#967F71] line-through">$77/month</span>
              </div>
              <p className="text-sm text-[#CDA7B2] font-light mb-8">Founding member pricing</p>
              <Link href="/studio-systems">
                <Button
                  size="lg"
                  className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#3B3937] mb-6">What's Included</h3>
              <ul className="space-y-4 text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Twice-monthly live Q&A calls for real-time support</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Complete Notion system for production, marketing & launches</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Private designer community with insider supplier info</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Leadership, mindset & somatic support for creative founders</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Production Systems Setup */}
      <section id="systems-implementation" className="py-24 bg-[#faf8f5] scroll-mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="lg:order-2">
              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-4">
                Custom Engagement
              </p>
              <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-4 tracking-tight">
                Production Systems Setup
              </h2>
              <p className="text-lg text-[#967F71] font-light mb-6 leading-relaxed">
                For designers who need a clean, organized foundation for factory communication and production tracking. I'll build the systems tailored to how you work and what your factories need from you.
              </p>
              <p className="text-lg font-light text-[#3B3937] mb-8">
                Stop piecing together spreadsheets. Get systems that work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:kerrib@oceoluxe.com">
                  <Button
                    size="lg"
                    className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Request Pricing
                  </Button>
                </a>
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
            <div className="lg:order-1">
              <h3 className="text-lg font-medium text-[#3B3937] mb-6">Services Include</h3>
              <ul className="space-y-4 text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Factory communication setup and templates</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Supplier tracking and contact management systems</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Production calendars and timeline planning</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Sampling workflow and costing sheet setup</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Custom Notion dashboards for your production process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Production Strategy & Consulting */}
      <section id="strategic-guidance" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-4">
                Strategic Support
              </p>
              <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-4 tracking-tight">
                Production Strategy & Consulting
              </h2>
              <p className="text-lg text-[#967F71] font-light mb-6 leading-relaxed">
                For designers navigating factory relationships, production timelines, and scaling decisions. Get expert guidance on what to expect, how to communicate, and when to make key decisions.
              </p>
              <p className="text-lg font-light text-[#3B3937] mb-8">
                Clarity in production protects your creative energy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:kerrib@oceoluxe.com">
                  <Button
                    size="lg"
                    className="bg-[#3B3937] hover:bg-[#4A4745] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Request Pricing
                  </Button>
                </a>
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
            <div>
              <h3 className="text-lg font-medium text-[#3B3937] mb-6">What You Get</h3>
              <ul className="space-y-4 text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Factory vetting and relationship guidance</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Production timeline planning and realistic expectations</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Pricing strategy and quantity decisions</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Sustainable sourcing direction</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Ongoing support as challenges arise</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Website Development */}
      <section id="website-development" className="py-24 bg-[#faf8f5] scroll-mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="lg:order-2">
              <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-4">
                Digital Presence
              </p>
              <h2 className="text-3xl lg:text-4xl font-light text-[#3B3937] mb-4 tracking-tight">
                Website Development for Fashion Professionals
              </h2>
              <p className="text-lg text-[#967F71] font-light mb-6 leading-relaxed">
                For designers, production managers, stylists, consultants, and anyone in the fashion industry who needs a website that actually represents their work. Built by someone who understands what you do.
              </p>
              <p className="text-lg font-light text-[#3B3937] mb-8">
                Your website should work as hard as you do.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:kerrib@oceoluxe.com">
                  <Button
                    size="lg"
                    className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-12 px-8 text-base font-normal tracking-wide"
                  >
                    Request Pricing
                  </Button>
                </a>
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
            <div className="lg:order-1">
              <h3 className="text-lg font-medium text-[#3B3937] mb-6">What's Included</h3>
              <ul className="space-y-4 text-[#967F71] font-light">
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Custom website built to showcase your work and experience</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Design that reflects the quality of your craft</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Portfolio, lookbook, or service pages tailored to your role</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Mobile-responsive and optimized for how clients find you</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#CDA7B2] mt-1">—</span>
                  <span>Guidance from someone who understands the industry</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#3B3937]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#CDA7B2] text-sm uppercase tracking-widest font-medium mb-6">
            Not sure which is right for you?
          </p>
          <h2 className="text-3xl lg:text-4xl font-light text-white mb-6 tracking-tight">
            Let's connect and build a custom plan together.
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light">
            Every designer's situation is different. Book a discovery call to talk through your goals, challenges, and what kind of support would actually help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-[#CDA7B2] hover:bg-[#BD97A2] text-white h-12 px-8 text-base font-normal tracking-wide"
              >
                Book a Discovery Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="mailto:kerrib@oceoluxe.com">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-base font-normal tracking-wide"
              >
                Send an Email
              </Button>
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
