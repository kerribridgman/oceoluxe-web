import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import { getEnabledSchedulingLinksForUser } from '@/lib/db/queries-mmfc-scheduling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  // Get the site owner's enabled scheduling links
  const user = await getUser();

  if (!user) {
    // If no user is logged in, show a message
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <MarketingHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Scheduling Not Available</h2>
              <p className="text-gray-600">
                The booking page is currently unavailable. Please check back later.
              </p>
            </CardContent>
          </Card>
        </main>
        <MarketingFooter />
      </div>
    );
  }

  const enabledLinks = await getEnabledSchedulingLinksForUser(user.id);

  // If only one link is enabled, redirect directly to it
  if (enabledLinks.length === 1) {
    redirect(enabledLinks[0].bookingUrl);
  }

  // If no links are enabled, show a message
  if (enabledLinks.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <MarketingHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Booking Options Available</h2>
              <p className="text-gray-600 mb-4">
                There are currently no scheduling links available for booking.
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <MarketingFooter />
      </div>
    );
  }

  // If multiple links are enabled, show selection page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col">
      <MarketingHeader />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
              <Calendar className="w-8 h-8 text-brand-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Schedule a Meeting
            </h1>
            <p className="text-lg text-gray-600">
              Choose the type of meeting that works best for you
            </p>
          </div>

          {/* Scheduling Links Grid */}
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
                    {/* Duration */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{link.durationMinutes} minutes</span>
                    </div>

                    {/* Additional Info */}
                    {link.minNoticeMinutes && (
                      <div className="text-sm text-gray-500">
                        Minimum notice: {Math.floor(link.minNoticeMinutes / 60)} hours
                      </div>
                    )}
                  </div>

                  {/* Book Button - Sticky to bottom */}
                  <a
                    href={link.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-brand-primary hover:bg-brand-primary-hover text-lg"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Book This Meeting
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              All bookings are powered by Make Money from Coding
            </p>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
