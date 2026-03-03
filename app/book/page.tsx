import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata() {
  return await getPageMetadata('book');
}

// Define your Cal.com meeting types here
const calMeetingTypes = [
  {
    slug: '15min',
    title: 'Quick Chat',
    subtitle: '15 minutes',
    description: 'Perfect for a quick question or to see if we\'re a good fit to work together.',
    icon: MessageCircle,
    color: '#CDA7B2',
    hoverColor: '#b8929d',
  },
  {
    slug: '30min',
    title: 'Discovery Call',
    subtitle: '30 minutes',
    description: 'Let\'s dive deeper into your goals and explore how I can support your journey.',
    icon: Sparkles,
    color: '#CDA7B2',
    hoverColor: '#b8929d',
  },
];

export default function BookPage() {
  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME;
  const hasCalCom = !!calUsername;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col">
      <MarketingHeader />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          {/* Decorative circles */}
          <div
            className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#CDA7B2] opacity-15 animate-float hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/4 -left-16 w-14 h-14 rounded-full bg-[#CDA7B2] opacity-10 animate-float-slow hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-48 -left-8 w-8 h-8 rounded-full bg-[#CDA7B2] opacity-20 animate-float-delayed hidden lg:block"
            aria-hidden="true"
          />
          <div
            className="absolute top-32 right-8 w-10 h-10 rounded-full bg-[#967F71] opacity-10 animate-float hidden lg:block"
            aria-hidden="true"
          />

          {/* Header - Visitor focused */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              Let's Connect
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              Ready to bring clarity to your creative business? Choose the conversation
              that feels right for where you are right now.
            </p>
          </div>

          {/* Cal.com Meeting Type Cards */}
          {hasCalCom && (
            <div className="grid gap-8 md:grid-cols-2 mb-12">
              {calMeetingTypes.map((meeting) => {
                const Icon = meeting.icon;
                return (
                  <a
                    key={meeting.slug}
                    href={`https://cal.com/${calUsername}/${meeting.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      {/* Colored header bar */}
                      <div className="h-2" style={{ backgroundColor: meeting.color }} />

                      <div className="p-8">
                        {/* Icon */}
                        <div
                          className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6"
                          style={{ backgroundColor: `${meeting.color}15` }}
                        >
                          <Icon className="w-7 h-7" style={{ color: meeting.color }} />
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-semibold text-gray-900">
                              {meeting.title}
                            </h2>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 mb-4">
                            <Clock className="w-4 h-4" />
                            <span>{meeting.subtitle}</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {meeting.description}
                          </p>
                        </div>

                        {/* CTA */}
                        <div
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-colors group-hover:opacity-90"
                          style={{ backgroundColor: meeting.color }}
                        >
                          <Calendar className="w-4 h-4" />
                          Book This Call
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* No booking options available */}
          {!hasCalCom && (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Booking Options Available</h2>
                <p className="text-gray-600">
                  Please check back later or contact us directly.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reassurance text */}
          {hasCalCom && (
            <div className="text-center mt-12">
              <p className="text-sm text-gray-500">
                Not sure which to choose? Start with a Quick Chat. No pressure, just conversation.
              </p>
            </div>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
