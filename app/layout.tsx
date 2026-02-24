import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Serif_Display, Cormorant_Garamond } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { Providers } from '@/components/providers';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { getOrganizationJsonLd, getWebSiteJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  metadataBase: new URL('https://oceoluxe.com'),
  title: {
    default: 'Oceo Luxe | Operational Partnership for Fashion Founders',
    template: '%s | Oceo Luxe',
  },
  description: 'Strategic operational partnership for fashion founders ready to scale with structure, clarity, and calm. Production leadership rooted in real-world experience.',
  keywords: ['fashion operational partnership', 'fashion production consulting', 'fashion brand operations', 'production leadership', 'fashion founder support'],
  authors: [{ name: 'Kerri Bridgman' }],
  creator: 'Oceo Luxe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://oceoluxe.com',
    siteName: 'Oceo Luxe',
    title: 'Oceo Luxe | Operational Partnership for Fashion Founders',
    description: 'Strategic operational partnership for fashion founders ready to scale with structure, clarity, and calm. Production leadership rooted in real-world experience.',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Oceo Luxe - Operational Partnership for Fashion Founders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oceo Luxe | Operational Partnership for Fashion Founders',
    description: 'Strategic operational partnership for fashion founders ready to scale with structure, clarity, and calm. Production leadership rooted in real-world experience.',
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
  themeColor: '#3B3937',
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
      </body>
    </html>
  );
}
