import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { Providers } from '@/components/providers';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { getOrganizationJsonLd, getWebSiteJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  metadataBase: new URL('https://oceoluxe.com'),
  title: {
    default: 'Oceo Luxe | Fashion Production & Operations',
    template: '%s | Oceo Luxe',
  },
  description: 'Structure as Support for fashion designers and visionaries. Build sustainable production systems that feel like luxury.',
  keywords: ['fashion production consulting', 'production operations', 'fashion designer resources', 'sustainable fashion production', 'factory communication'],
  authors: [{ name: 'Kerri Bridgman' }],
  creator: 'Oceo Luxe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://oceoluxe.com',
    siteName: 'Oceo Luxe',
    title: 'Oceo Luxe | Fashion Production & Operations',
    description: 'Structure as Support for fashion designers and visionaries. Build sustainable production systems that feel like luxury.',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Oceo Luxe - Fashion Production & Operations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oceo Luxe | Fashion Production & Operations',
    description: 'Structure as Support for fashion designers and visionaries. Build sustainable production systems that feel like luxury.',
    images: ['/images/og-default.png'],
  },
};

export const viewport: Viewport = {
  maximumScale: 1
};

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${inter.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <JsonLdScript data={[getOrganizationJsonLd(), getWebSiteJsonLd()] as unknown as Record<string, unknown>[]} />
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
