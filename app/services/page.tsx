import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getLinkSettings } from '@/lib/db/link-queries';
import { getUser } from '@/lib/db/queries';
import { getVisibleServicesForUser } from '@/lib/db/queries-mmfc-services';

export const metadata: Metadata = {
  title: 'Services | Patrick Farrell',
  description: 'AI & Automation Consulting, 1:1 Tech Coaching, and Entrepreneur Circle Mastermind for purpose-driven founders.',
};

export default async function ServicesPage() {
  const links = await getLinkSettings();
  const user = await getUser();
  const mmfcServices = user ? await getVisibleServicesForUser(user.id) : [];

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2332] via-[#1e2838] to-[#1a2332]">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-6xl text-[#4a9fd8]/10 font-mono">&lt;/&gt;</div>
        <div className="absolute bottom-20 right-20 text-6xl text-[#4a9fd8]/10 font-mono">&#123;&#125;</div>

        {/* Colored blur effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4a9fd8]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4a9fd8]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Services & Programs
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the right support for your stage of growth. From automation consulting to deep strategic coaching.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

          {/* Service 1: AI & Automation Consulting */}
          <div id="ai-consulting" className="scroll-mt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  AI, App Development & Automation Consulting
                </h2>
                <p className="text-xl text-[#4a9fd8] font-semibold mb-4">
                  Work smarter, not harder.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Leverage AI and digital systems to streamline operations, reduce manual work, and multiply
                  your impact. Perfect for founders, operators, and consultants seeking time-saving solutions.
                </p>
                <p className="text-lg font-semibold text-gray-900 mb-8">
                  Build once, scale forever.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
                <ul className="space-y-4">
                  {[
                    'Systems audit and business workflow mapping',
                    'AI-powered tool setup (ChatGPT, n8n, Airtable, Notion, ManyChat, etc.)',
                    'Automation blueprints customized to your operations',
                    'App design and consulting for web and mobile applications',
                    'Ongoing tech support and optimization'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-6 h-6 text-[#4a9fd8] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href={links.discovery_call?.url || '#'} className="block">
                    <Button size="lg" className="w-full bg-[#4a9fd8] hover:bg-[#3a8fc8]">
                      {links.discovery_call?.label || 'Book a Free Discovery Call'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Service 2: 1:1 Tech Coaching */}
          <div id="tech-coaching" className="scroll-mt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-gradient-to-br from-[#4a9fd8]/10 to-[#4a9fd8]/20 rounded-xl p-8 border-2 border-[#4a9fd8]/30">
                <div className="inline-block px-4 py-2 bg-[#4a9fd8] text-white text-sm font-bold rounded-full mb-6">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Deliverables</h3>
                <ul className="space-y-4">
                  {[
                    'Clear offer and positioning that reflects your unique gifts',
                    'Simple, repeatable client acquisition system',
                    'Content and brand strategy that amplifies your voice',
                    'Business model supporting your desired lifestyle',
                    'Fully developed technology systems for organizing business and selling digital products/services'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-6 h-6 text-[#4a9fd8] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 space-y-3">
                  <Link href="/apply/coaching" className="block">
                    <Button size="lg" className="w-full bg-[#4a9fd8] hover:bg-[#3a8fc8]">
                      Apply For 1:1 Tech Coaching
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href={links.strategy_session?.url || '#'} className="block">
                    <Button variant="outline" size="lg" className="w-full border-[#4a9fd8] text-[#4a9fd8] hover:bg-[#4a9fd8]/10">
                      {links.strategy_session?.label || 'Book a FREE 30-Min Strategy Session'}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="text-6xl mb-6">🔥</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Ignite Your Online Business
                </h2>
                <p className="text-xl text-[#4a9fd8] font-semibold mb-4">
                  1:1 Tech Coaching
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  A private, high-touch experience for founders ready to create aligned and profitable online
                  businesses. This combines personal strategy, mindset recalibration, and implementation support.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Perfect for founders just starting or rebuilding for scale—deep strategic work followed by execution.
                </p>
                <p className="text-xl font-bold text-gray-900">
                  Clarity. Confidence. Clients.
                </p>
              </div>
            </div>
          </div>

          {/* Service 3: Entrepreneur Circle */}
          <div id="mastermind" className="scroll-mt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-6xl mb-6">🌍</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Entrepreneur Circle
                </h2>
                <p className="text-xl text-purple-600 font-semibold mb-4">
                  Mastermind
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Where purpose-driven entrepreneurs grow brands, build community, and scale with soul.
                  A year-long mastermind providing support, mentorship, training, and networking.
                </p>
                <blockquote className="text-lg text-gray-800 italic border-l-4 border-purple-500 pl-6 mb-6">
                  "You don't need more information—you need the right people in your corner.
                  This is the circle that gets you there faster."
                </blockquote>
                <p className="text-lg font-semibold text-gray-900">
                  Grow together. Lead with clarity. Scale on your terms.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What You Get</h3>
                <ul className="space-y-4">
                  {[
                    'Weekly group coaching calls',
                    'Live implementation sessions (AI, funnels, content systems)',
                    'Private online community for collaboration',
                    'Access to in-person retreats and international gatherings',
                    'Tools, templates, and guidance for business growth'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                    Apply For Entrepreneur Circle
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MMFC Services Section */}
      {mmfcServices.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Additional Services & Resources
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore our full catalog of courses, templates, and digital products
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {mmfcServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  {/* Service Image */}
                  {(service.coverImage || service.featuredImageUrl) && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={service.coverImage || service.featuredImageUrl || ''}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Service Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {service.title}
                    </h3>

                    {service.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {service.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      {service.salePrice ? (
                        <>
                          <span className="text-3xl font-bold text-[#4a9fd8]">
                            ${service.salePrice}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${service.price}
                          </span>
                          {service.pricingType === 'hourly' && (
                            <span className="text-base text-gray-600">/hr</span>
                          )}
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                            SALE
                          </span>
                        </>
                      ) : service.price ? (
                        <>
                          <span className="text-3xl font-bold text-gray-900">
                            ${service.price}
                          </span>
                          {service.pricingType === 'hourly' && (
                            <span className="text-base text-gray-600">/hr</span>
                          )}
                        </>
                      ) : null}
                    </div>

                    {/* Learn More Link */}
                    <a
                      href={service.url || `https://makemoneyfromcoding.com/services/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#4a9fd8] hover:bg-[#3a8fc8] text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      Learn More
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1a2332] to-[#1e2838]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Not Sure Which is Right for You?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book a free alignment call and let's build a game plan together
          </p>
          <Link href={links.discovery_call?.url || '#'}>
            <Button size="lg" className="bg-[#4a9fd8] hover:bg-[#3a8fc8] text-lg px-8 py-6">
              {links.discovery_call?.label || 'Book a Free Discovery Call'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
