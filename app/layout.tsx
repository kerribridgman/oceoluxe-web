import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Serif_Display, Cormorant_Garamond } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { Providers } from '@/components/providers';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { getOrganizationJsonLd, getWebSiteJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  metadataBase: new URL('https://oceoluxe.com'),
  title: {
    default: 'Oceo Luxe | Studio Operational Partner for Founders',
    template: '%s | Oceo Luxe',
  },
  description: 'Operational partnership for founders building businesses they intend to keep. Systems, decision frameworks, and structured execution from a studio operational partner.',
  keywords: ['founder operations', 'operational partnership', 'studio operational partner', 'founder operator', 'operational systems', 'business operations'],
  authors: [{ name: 'Kerri Bridgman' }],
  creator: 'Oceo Luxe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://oceoluxe.com',
    siteName: 'Oceo Luxe',
    title: 'Oceo Luxe | Studio Operational Partner for Founders',
    description: 'Operational partnership for founders building businesses they intend to keep. Systems, decision frameworks, and structured execution.',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Oceo Luxe - Studio Operational Partner for Founders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oceo Luxe | Studio Operational Partner for Founders',
    description: 'Operational partnership for founders building businesses they intend to keep. Systems, decision frameworks, and structured execution.',
    images: ['/images/og-default.png'],
  },
  alternates: {
    canonical: 'https://oceoluxe.com',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A1A1A',
};

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

const notoSerifDisplay = Noto_Serif_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif-display',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-script',
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${inter.className} ${notoSerifDisplay.variable} ${cormorantGaramond.variable}`}
    >
      <head>
        <meta name="p:domain_verify" content="507e48b67fae8bdd6f471a8ec1caa689" />
      </head>
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
      {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
