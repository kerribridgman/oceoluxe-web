import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Sparkles, Zap, Users } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getLinkSettings } from '@/lib/db/link-queries';

export async function generateMetadata() {
  return await getPageMetadata('home');
}

export default async function HomePage() {
  const links = await getLinkSettings();
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2332] via-[#1e2838] to-[#1a2332]">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-6xl text-[#4a9fd8]/10 font-mono">&lt;/&gt;</div>
        <div className="absolute top-40 right-20 text-6xl text-[#4a9fd8]/10 font-mono">&#123;&#125;</div>
        <div className="absolute bottom-20 left-1/4 text-6xl text-[#4a9fd8]/10 font-mono">( )</div>

        {/* Colored blur effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4a9fd8]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4a9fd8]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Unlock Your Voice.<br />
              Build Your App.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9fd8] to-[#6bb8f0]">
                Grow Your Digital Business.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches Ready to Scale while Maintaining Their Freedom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#services">
                <Button size="lg" className="bg-[#4a9fd8] hover:bg-[#3a8fc8] text-white text-lg px-8 py-6">
                  Explore Services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg" className="border-[#4a9fd8] text-[#4a9fd8] hover:bg-[#4a9fd8]/10 text-lg px-8 py-6">
                  Read the Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Where Strategy Meets Soul
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Where execution meets alignment. Helping ambitious professionals move from ideation to implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4a9fd8]/10 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-[#4a9fd8]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clarity + Positioning</h3>
              <p className="text-gray-600">Define your offering and align with your ideal audience</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4a9fd8]/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-[#4a9fd8]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content + Visibility</h3>
              <p className="text-gray-600">Build consistent credibility-generating content systems</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4a9fd8]/10 rounded-full mb-4">
                <Zap className="w-8 h-8 text-[#4a9fd8]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Infrastructure</h3>
              <p className="text-gray-600">Develop lead capture and automation systems</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4a9fd8]/10 rounded-full mb-4">
                <Code className="w-8 h-8 text-[#4a9fd8]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">App Design & Development</h3>
              <p className="text-gray-600">Build sustainable, profitable web and mobile solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Patrick</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Senior software engineer with two degrees in Electrical Engineering from Virginia Tech.
                  Transitioned from corporate software engineering in NYC to founding tech ventures and coaching
                  entrepreneurs around the world.
                </p>
                <p>
                  I've hosted international retreats, built an 800+ entrepreneur community, and developed the
                  Gravity Web Framework and Gravity OS. Yoga Alliance-certified instructor and Mindvalley-certified
                  life coach.
                </p>
                <p className="font-semibold text-gray-900">
                  I help founders and entrepreneurs convert their expertise into revenue-generating offerings,
                  leverage AI and automation for intelligent scaling, and build sustainable digital businesses.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/patrick_budapest1.jpg"
                alt="Patrick Farrell"
                className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How I Can Help</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right support for your stage of growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI & Automation Consulting */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI & Automation Consulting
              </h3>
              <p className="text-gray-600 mb-6">
                Leverage AI and digital systems to streamline operations, reduce manual work, and multiply impact.
                Build once, scale forever.
              </p>
              <Link href="/services#ai-consulting">
                <Button className="w-full bg-[#4a9fd8] hover:bg-[#3a8fc8]">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* 1:1 Tech Coaching */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-[#4a9fd8]">
              <div className="text-4xl mb-4">🔥</div>
              <div className="inline-block px-3 py-1 bg-[#4a9fd8]/10 text-[#4a9fd8] text-xs font-semibold rounded-full mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                1:1 Tech Coaching
              </h3>
              <p className="text-gray-600 mb-6">
                High-touch experience for founders ready to create aligned and profitable online businesses.
                Clarity. Confidence. Clients.
              </p>
              <Link href="/apply/coaching">
                <Button className="w-full bg-[#4a9fd8] hover:bg-[#3a8fc8]">
                  Apply Now
                </Button>
              </Link>
            </div>

            {/* Entrepreneur Circle */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Entrepreneur Circle
              </h3>
              <p className="text-gray-600 mb-6">
                Year-long mastermind for purpose-driven entrepreneurs. Grow together. Lead with clarity.
                Scale on your terms.
              </p>
              <Link href="/apply/entrepreneur-circle">
                <Button className="w-full bg-[#4a9fd8] hover:bg-[#3a8fc8]">
                  Join the Circle
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg" className="border-gray-300">
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1a2332] to-[#1e2838]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Digital Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book a free alignment call and let's build a game plan together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={links.discovery_call?.url || '/services'}>
              <Button size="lg" className="bg-[#4a9fd8] hover:bg-[#3a8fc8] text-white text-lg px-8 py-6">
                {links.discovery_call?.label || 'Book a Discovery Call'}
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg" className="border-[#4a9fd8] text-[#4a9fd8] hover:bg-[#4a9fd8]/10 text-lg px-8 py-6">
                Read the Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
