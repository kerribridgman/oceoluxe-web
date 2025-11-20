import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Raleway } from 'next/font/google';
import { getUser, getTeamForUser, getAnalyticsSettings } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Patrick Farrell | Tech Strategy & Business Growth',
  description: 'Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches.'
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
  // Get the first owner/admin user's analytics settings
  // In a multi-tenant app, you'd want team-based settings instead
  let googleAnalyticsId = '';
  let googleTagManagerId = '';

  try {
    const user = await getUser();
    if (user && (user.role === 'owner' || user.role === 'admin')) {
      const settings = await getAnalyticsSettings(user.id);
      googleAnalyticsId = settings?.googleAnalyticsId || '';
      googleTagManagerId = settings?.googleTagManagerId || '';
    }
  } catch (error) {
    console.error('Error loading analytics settings:', error);
  }

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${raleway.className}`}
    >
      <head>
        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        {googleTagManagerId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${googleTagManagerId}');
            `}
          </Script>
        )}
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
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
