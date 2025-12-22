import { getAllEnabledSchedulingLinks } from '@/lib/db/queries-mmfc-scheduling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ExternalLink, MessageCircle, Sparkles } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { CalEmbed } from '@/components/cal-booking';

export const dynamic = 'force-dynamic';

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

export default async function BookPage() {
  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME;

  // Try to get MMFC scheduling links, but don't fail if DB is unavailable
  let enabledLinks: Awaited<ReturnType<typeof getAllEnabledSchedulingLinks>> = [];
  try {
    enabledLinks = await getAllEnabledSchedulingLinks();
  } catch (error) {
    console.error('Failed to fetch MMFC scheduling links:', error);
  }

  const hasCalCom = !!calUsername;
  const hasMmfcLinks = enabledLinks.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col">
      <MarketingHeader />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header - Visitor focused */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Let's Connect
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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

          {/* MMFC Scheduling Links - Secondary option if available */}
          {hasMmfcLinks && (
            <>
              <div className="text-center my-8">
                <p className="text-gray-500">Additional booking options:</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {enabledLinks.map((link) => (
                  <Card
                    key={link.id}
                    className="dashboard-card border-0 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{link.title}</CardTitle>
                      {link.description && (
                        <CardDescription className="text-base mt-2">
                          {link.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">{link.durationMinutes} minutes</span>
                        </div>
                      </div>
                      <a
                        href={link.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-4"
                      >
                        <button className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-3 px-4 rounded-lg text-lg font-medium flex items-center justify-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Book This Meeting
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* No booking options available */}
          {!hasCalCom && !hasMmfcLinks && (
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

          {/* Embedded Calendar for 30-min Discovery Call */}
          {hasCalCom && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Book a Discovery Call
                </h2>
                <p className="text-gray-600">
                  Choose a time that works for you
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <CalEmbed
                  calUsername={calUsername}
                  eventSlug="30min"
                />
              </div>
            </div>
          )}

          {/* Reassurance text */}
          {hasCalCom && (
            <div className="text-center mt-12">
              <p className="text-sm text-gray-500">
                Not sure which to choose? Start with a Quick Chat — no pressure, just conversation.
              </p>
            </div>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
