import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Raleway } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { AnalyticsLoader } from '@/components/analytics-loader';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Oceo Luxe | Notion Templates for Fashion Entrepreneurs',
  description: 'Helping fashion founders build efficient, elegant businesses. Premium Notion templates, digital products, and consulting for creative entrepreneurs.',
};

export const viewport: Viewport = {
  maximumScale: 1
};

const raleway = Raleway({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${raleway.className}`}
    >
      <head>
        <AnalyticsLoader />
      </head>
      <body className="min-h-[100dvh] bg-gray-50">
        <SWRConfig
          value={{
            fallback: {
              // We do NOT await here
              // Only components that read this data will suspend
              '/api/user': getUser(),
              '/api/team': getTeamForUser()
            }
          }}
        >
          <Providers>{children}</Providers>
        </SWRConfig>
      </body>
    </html>
  );
}
