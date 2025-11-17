import { Metadata } from 'next';
import { db } from '@/lib/db/drizzle';
import { seoSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getPageMetadata(page: string): Promise<Metadata> {
  try {
    const [settings] = await db
      .select()
      .from(seoSettings)
      .where(eq(seoSettings.page, page))
      .limit(1);

    if (!settings) {
      // Return default metadata
      return getDefaultMetadata(page);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://iampatrickfarrell.com';
    const baseUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash

    const metadata: Metadata = {
      title: settings.title,
      description: settings.description,
      keywords: settings.keywords ? settings.keywords.split(',').map(k => k.trim()) : undefined,
      robots: settings.metaRobots,
      openGraph: {
        title: settings.ogTitle || settings.title,
        description: settings.ogDescription || settings.description,
        type: settings.ogType as 'website' | 'article' | 'profile' | undefined,
        url: settings.canonicalUrl || `${baseUrl}/${page === 'home' ? '' : page}`,
        images: settings.ogImageUrl ? [
          {
            url: settings.ogImageUrl,
            width: 1200,
            height: 630,
            alt: settings.ogTitle || settings.title,
          }
        ] : undefined,
      },
      twitter: {
        card: settings.twitterCard as 'summary' | 'summary_large_image' | undefined,
        title: settings.twitterTitle || settings.ogTitle || settings.title,
        description: settings.twitterDescription || settings.ogDescription || settings.description,
        images: settings.twitterImageUrl || settings.ogImageUrl ? [
          settings.twitterImageUrl || settings.ogImageUrl || ''
        ] : undefined,
      },
      alternates: settings.canonicalUrl ? {
        canonical: settings.canonicalUrl,
      } : undefined,
    };

    return metadata;
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return getDefaultMetadata(page);
  }
}

function getDefaultMetadata(page: string): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://iampatrickfarrell.com';
  const baseUrl = siteUrl.replace(/\/$/, '');

  const defaults: Record<string, Metadata> = {
    home: {
      title: 'Patrick Farrell | Tech Strategy & Business Growth',
      description: 'Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches.',
      openGraph: {
        title: 'Patrick Farrell | Tech Strategy & Business Growth',
        description: 'Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches.',
        type: 'website',
        url: baseUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Patrick Farrell | Tech Strategy & Business Growth',
        description: 'Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches.',
      },
    },
    services: {
      title: 'Services | Patrick Farrell',
      description: 'Professional tech strategy and business growth services for startups and entrepreneurs.',
      openGraph: {
        title: 'Services | Patrick Farrell',
        description: 'Professional tech strategy and business growth services for startups and entrepreneurs.',
        type: 'website',
        url: `${baseUrl}/services`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Services | Patrick Farrell',
        description: 'Professional tech strategy and business growth services for startups and entrepreneurs.',
      },
    },
    blog: {
      title: 'Blog | Patrick Farrell',
      description: 'Insights and articles on tech strategy, business growth, and entrepreneurship.',
      openGraph: {
        title: 'Blog | Patrick Farrell',
        description: 'Insights and articles on tech strategy, business growth, and entrepreneurship.',
        type: 'website',
        url: `${baseUrl}/blog`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog | Patrick Farrell',
        description: 'Insights and articles on tech strategy, business growth, and entrepreneurship.',
      },
    },
  };

  return defaults[page] || defaults.home;
}
