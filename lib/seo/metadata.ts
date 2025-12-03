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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';
    const baseUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash

    const metadata: Metadata = {
      title: settings.title,
      description: settings.description,
      keywords: settings.keywords ? settings.keywords.split(',').map(k => k.trim()) : undefined,
      robots: settings.metaRobots,
      openGraph: {
        title: settings.ogTitle || settings.title,
        description: settings.ogDescription || settings.description,
        type: (settings.ogType as 'website' | 'article' | 'profile') || 'website',
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
        card: (settings.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';
  const baseUrl = siteUrl.replace(/\/$/, '');

  const defaults: Record<string, Metadata> = {
    home: {
      title: 'Oceo Luxe | Fashion Production & Operations',
      description: 'Structure as Support for fashion designers and visionaries. Build sustainable production systems that feel like luxury.',
      openGraph: {
        title: 'Oceo Luxe | Fashion Production & Operations',
        description: 'Structure as Support for fashion designers and visionaries. Build sustainable production systems that feel like luxury.',
        type: 'website',
        url: baseUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Oceo Luxe | Fashion Production & Operations',
        description: 'Structure as Support for fashion designers and visionaries. Build sustainable production systems that feel like luxury.',
      },
    },
    services: {
      title: 'Services | Oceo Luxe',
      description: 'Fashion production consulting, Studio Systems membership, and resources for fashion designers and creative entrepreneurs.',
      openGraph: {
        title: 'Services | Oceo Luxe',
        description: 'Fashion production consulting, Studio Systems membership, and resources for fashion designers and creative entrepreneurs.',
        type: 'website',
        url: `${baseUrl}/services`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Services | Oceo Luxe',
        description: 'Fashion production consulting, Studio Systems membership, and resources for fashion designers and creative entrepreneurs.',
      },
    },
    blog: {
      title: 'Blog | Oceo Luxe',
      description: 'Insights and resources on fashion production, sustainable sourcing, and building a fashion business with clarity and calm.',
      openGraph: {
        title: 'Blog | Oceo Luxe',
        description: 'Insights and resources on fashion production, sustainable sourcing, and building a fashion business with clarity and calm.',
        type: 'website',
        url: `${baseUrl}/blog`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog | Oceo Luxe',
        description: 'Insights and resources on fashion production, sustainable sourcing, and building a fashion business with clarity and calm.',
      },
    },
  };

  return defaults[page] || defaults.home;
}
