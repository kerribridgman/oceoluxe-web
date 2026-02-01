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
      description: 'Fashion production consulting and operations support for independent designers. Structure as Support — build sustainable production systems that feel like luxury.',
      keywords: ['fashion production consulting', 'production operations', 'sustainable fashion production', 'fashion designer support'],
      openGraph: {
        title: 'Oceo Luxe | Fashion Production & Operations',
        description: 'Fashion production consulting and operations support for independent designers. Structure as Support — build sustainable production systems that feel like luxury.',
        type: 'website',
        url: baseUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Oceo Luxe | Fashion Production & Operations',
        description: 'Fashion production consulting and operations support for independent designers. Structure as Support — build sustainable production systems that feel like luxury.',
      },
    },
    services: {
      title: 'Fashion Production Consulting & Services',
      description: 'Fashion production consultant services: 1:1 consulting, Studio Systems membership, production systems setup, and strategic guidance for independent fashion designers.',
      keywords: ['fashion production consultant', '1:1 consulting', 'production systems setup', 'fashion business consulting'],
      openGraph: {
        title: 'Fashion Production Consulting & Services | Oceo Luxe',
        description: 'Fashion production consultant services: 1:1 consulting, Studio Systems membership, production systems setup, and strategic guidance for independent fashion designers.',
        type: 'website',
        url: `${baseUrl}/services`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Fashion Production Consulting & Services | Oceo Luxe',
        description: 'Fashion production consultant services: 1:1 consulting, Studio Systems membership, production systems setup, and strategic guidance for independent fashion designers.',
      },
    },
    blog: {
      title: 'Fashion Production Blog',
      description: 'Insights on fashion production, sustainable sourcing, factory communication, and building a fashion business with clarity. Expert advice from a production consultant.',
      keywords: ['fashion production blog', 'sustainable fashion', 'factory communication', 'fashion business advice'],
      openGraph: {
        title: 'Fashion Production Blog | Oceo Luxe',
        description: 'Insights on fashion production, sustainable sourcing, factory communication, and building a fashion business with clarity. Expert advice from a production consultant.',
        type: 'website',
        url: `${baseUrl}/blog`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Fashion Production Blog | Oceo Luxe',
        description: 'Insights on fashion production, sustainable sourcing, factory communication, and building a fashion business with clarity. Expert advice from a production consultant.',
      },
    },
    about: {
      title: 'About Kerri Bridgman',
      description: 'Fashion production expert and FIT-trained production manager with 10 years of experience helping independent designers build sustainable production systems.',
      keywords: ['fashion production expert', 'kerri bridgman', 'FIT production manager', 'fashion consultant'],
      openGraph: {
        title: 'About Kerri Bridgman | Oceo Luxe',
        description: 'Fashion production expert and FIT-trained production manager with 10 years of experience helping independent designers build sustainable production systems.',
        type: 'profile',
        url: `${baseUrl}/about`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'About Kerri Bridgman | Oceo Luxe',
        description: 'Fashion production expert and FIT-trained production manager with 10 years of experience helping independent designers build sustainable production systems.',
      },
    },
    faq: {
      title: 'Frequently Asked Questions',
      description: 'Answers to common questions about fashion production: how to find a factory, first production run quantities, realistic timelines, factory communication, and sustainable sourcing.',
      keywords: ['find a factory', 'first production run', 'fashion production FAQ', 'factory communication tips'],
      openGraph: {
        title: 'FAQ | Oceo Luxe',
        description: 'Answers to common questions about fashion production: how to find a factory, first production run quantities, realistic timelines, and sustainable sourcing.',
        type: 'website',
        url: `${baseUrl}/faq`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'FAQ | Oceo Luxe',
        description: 'Answers to common questions about fashion production: how to find a factory, first production run quantities, realistic timelines, and sustainable sourcing.',
      },
    },
    book: {
      title: 'Book a Fashion Consultant',
      description: 'Book a discovery call with Kerri Bridgman. Get clarity on your fashion production process, factory relationships, and scaling strategy.',
      keywords: ['book fashion consultant', 'discovery call', 'fashion production consultation'],
      openGraph: {
        title: 'Book a Call | Oceo Luxe',
        description: 'Book a discovery call with Kerri Bridgman. Get clarity on your fashion production process, factory relationships, and scaling strategy.',
        type: 'website',
        url: `${baseUrl}/book`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Book a Call | Oceo Luxe',
        description: 'Book a discovery call with Kerri Bridgman. Get clarity on your fashion production process, factory relationships, and scaling strategy.',
      },
    },
    'quiz/about': {
      title: 'Designer Archetype Quiz',
      description: 'Discover your Designer Archetype in 2 minutes. Find out what kind of fashion designer you are and align your production strategy with your creative vision.',
      keywords: ['designer archetype quiz', 'fashion designer quiz', 'production strategy alignment'],
      openGraph: {
        title: 'What Kind of Designer Are You? | Oceo Luxe',
        description: 'Discover your Designer Archetype in 2 minutes. Find out what kind of fashion designer you are and align your production strategy with your creative vision.',
        type: 'website',
        url: `${baseUrl}/quiz/about`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'What Kind of Designer Are You? | Oceo Luxe',
        description: 'Discover your Designer Archetype in 2 minutes. Find out what kind of fashion designer you are and align your production strategy with your creative vision.',
      },
    },
    products: {
      title: 'Fashion Production Resources & Templates',
      description: 'Tech pack templates, production resources, and digital tools for independent fashion designers. Build your brand with proven systems.',
      keywords: ['tech pack templates', 'fashion production resources', 'fashion designer templates'],
      openGraph: {
        title: 'Products & Resources | Oceo Luxe',
        description: 'Tech pack templates, production resources, and digital tools for independent fashion designers. Build your brand with proven systems.',
        type: 'website',
        url: `${baseUrl}/products`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Products & Resources | Oceo Luxe',
        description: 'Tech pack templates, production resources, and digital tools for independent fashion designers. Build your brand with proven systems.',
      },
    },
    'studio-systems': {
      title: 'Studio Systems Membership',
      description: 'Fashion designer education and production membership. Learn The Oceo Method framework with live Q&A, Notion systems, private community, and somatic support for creative founders.',
      keywords: ['fashion designer education', 'production membership', 'oceo method', 'fashion business membership'],
      openGraph: {
        title: 'Studio Systems Membership | Oceo Luxe',
        description: 'Fashion designer education and production membership. Learn The Oceo Method framework with live Q&A, Notion systems, private community, and somatic support.',
        type: 'website',
        url: `${baseUrl}/studio-systems`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Studio Systems Membership | Oceo Luxe',
        description: 'Fashion designer education and production membership. Learn The Oceo Method framework with live Q&A, Notion systems, private community, and somatic support.',
      },
    },
    'apply/work-with-me': {
      title: 'Work With Me',
      description: 'Apply to work 1:1 with Kerri Bridgman on your fashion production systems, factory communication, and scaling strategy.',
      keywords: ['fashion production consulting', 'work with kerri bridgman', '1:1 fashion consulting'],
      openGraph: {
        title: 'Work With Me | Oceo Luxe',
        description: 'Apply to work 1:1 with Kerri Bridgman on your fashion production systems, factory communication, and scaling strategy.',
        type: 'website',
        url: `${baseUrl}/apply/work-with-me`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Work With Me | Oceo Luxe',
        description: 'Apply to work 1:1 with Kerri Bridgman on your fashion production systems, factory communication, and scaling strategy.',
      },
    },
    join: {
      title: 'Join Studio Systems',
      description: 'Join the Studio Systems membership for fashion designers. Get production frameworks, templates, community support, and live Q&A calls.',
      keywords: ['join studio systems', 'fashion designer membership', 'production frameworks'],
      openGraph: {
        title: 'Join Studio Systems | Oceo Luxe',
        description: 'Join the Studio Systems membership for fashion designers. Get production frameworks, templates, community support, and live Q&A calls.',
        type: 'website',
        url: `${baseUrl}/join`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Join Studio Systems | Oceo Luxe',
        description: 'Join the Studio Systems membership for fashion designers. Get production frameworks, templates, community support, and live Q&A calls.',
      },
    },
    cart: {
      title: 'Your Cart',
      description: 'Review your selected products and resources from Oceo Luxe.',
      robots: 'noindex, nofollow',
    },
    'checkout/thank-you': {
      title: 'Thank You for Your Purchase',
      description: 'Your order has been confirmed. Thank you for shopping with Oceo Luxe.',
      robots: 'noindex, nofollow',
    },
    unsubscribe: {
      title: 'Unsubscribe',
      description: 'Manage your email preferences with Oceo Luxe.',
      robots: 'noindex, nofollow',
    },
    'sign-in': {
      title: 'Sign In',
      description: 'Sign in to your Oceo Luxe account.',
      robots: 'noindex, nofollow',
    },
    'sign-up': {
      title: 'Sign Up',
      description: 'Create your Oceo Luxe account.',
      robots: 'noindex, nofollow',
    },
    'studio-login': {
      title: 'Studio Login',
      description: 'Sign in to Studio Systems.',
      robots: 'noindex, nofollow',
    },
    'studio-join': {
      title: 'Join Studio Systems',
      description: 'Create your Studio Systems account.',
      robots: 'noindex, nofollow',
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'Oceo Luxe privacy policy. Learn how we collect, use, and protect your personal information.',
    },
    terms: {
      title: 'Terms of Service',
      description: 'Oceo Luxe terms of service and conditions for using our website, products, and services.',
    },
  };

  return defaults[page] || defaults.home;
}
