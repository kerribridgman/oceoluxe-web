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
      alternates: {
        canonical: settings.canonicalUrl || `${baseUrl}/${page === 'home' ? '' : page}`,
      },
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
      title: { absolute: 'Oceo Luxe | Operational Partnership for Fashion Founders' },
      description: 'Strategic operational partnership for fashion founders ready to scale with structure, clarity, and calm. Production leadership rooted in real-world experience.',
      keywords: ['fashion operational partnership', 'fashion production consulting', 'fashion brand operations', 'production leadership'],
      alternates: { canonical: baseUrl },
      openGraph: {
        title: 'Oceo Luxe | Operational Partnership for Fashion Founders',
        description: 'Strategic operational partnership for fashion founders ready to scale with structure, clarity, and calm. Production leadership rooted in real-world experience.',
        type: 'website',
        url: baseUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Oceo Luxe | Operational Partnership for Fashion Founders',
        description: 'Strategic operational partnership for fashion founders ready to scale with structure, clarity, and calm. Production leadership rooted in real-world experience.',
      },
    },
    'work-with-oceo-luxe': {
      title: 'Work With Oceo Luxe | Operational Partnership for Fashion Founders',
      description: 'Explore how Oceo Luxe partners with fashion founders through private operational partnership, strategic production alignment, and Studio Systems.',
      keywords: ['fashion operational partnership', 'fashion production consulting', 'fashion brand operations', 'production systems'],
      alternates: { canonical: `${baseUrl}/work-with-oceo-luxe` },
      openGraph: {
        title: 'Work With Oceo Luxe | Operational Partnership for Fashion Founders',
        description: 'Explore how Oceo Luxe partners with fashion founders through private operational partnership, strategic production alignment, and Studio Systems.',
        type: 'website',
        url: `${baseUrl}/work-with-oceo-luxe`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Work With Oceo Luxe | Operational Partnership for Fashion Founders',
        description: 'Explore how Oceo Luxe partners with fashion founders through private operational partnership, strategic production alignment, and Studio Systems.',
      },
    },
    'operational-partnership': {
      title: 'Operational Partnership | Oceo Luxe',
      description: 'Embedded operational partnership for growing fashion brands. Production leadership, systems architecture, strategic advisory, and team alignment.',
      keywords: ['fashion operational partnership', 'embedded operations', 'production leadership', 'fashion brand scaling'],
      alternates: { canonical: `${baseUrl}/operational-partnership` },
      openGraph: {
        title: 'Operational Partnership | Oceo Luxe',
        description: 'Embedded operational partnership for growing fashion brands. Production leadership, systems architecture, strategic advisory, and team alignment.',
        type: 'website',
        url: `${baseUrl}/operational-partnership`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Operational Partnership | Oceo Luxe',
        description: 'Embedded operational partnership for growing fashion brands. Production leadership, systems architecture, strategic advisory, and team alignment.',
      },
    },
    'strategic-production-alignment': {
      title: 'Strategic Production Alignment | Oceo Luxe',
      description: 'Focused, short-term engagements for fashion brands that need clarity on a specific production challenge: sourcing strategy, factory evaluation, timeline restructuring, or launch readiness.',
      keywords: ['strategic production alignment', 'fashion production consulting', 'sourcing strategy', 'factory evaluation', 'production timeline'],
      alternates: { canonical: `${baseUrl}/strategic-production-alignment` },
      openGraph: {
        title: 'Strategic Production Alignment | Oceo Luxe',
        description: 'Focused, short-term engagements for fashion brands that need clarity on a specific production challenge: sourcing strategy, factory evaluation, timeline restructuring, or launch readiness.',
        type: 'website',
        url: `${baseUrl}/strategic-production-alignment`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Strategic Production Alignment | Oceo Luxe',
        description: 'Focused, short-term engagements for fashion brands that need clarity on a specific production challenge: sourcing strategy, factory evaluation, timeline restructuring, or launch readiness.',
      },
    },
    apply: {
      title: 'Apply for Partnership | Oceo Luxe',
      description: 'Apply to work with Oceo Luxe. Share where your brand is and what you need. Every engagement begins with understanding alignment.',
      keywords: ['apply fashion consulting', 'fashion operational partnership application', 'work with oceo luxe'],
      alternates: { canonical: `${baseUrl}/apply` },
      openGraph: {
        title: 'Apply for Partnership | Oceo Luxe',
        description: 'Apply to work with Oceo Luxe. Share where your brand is and what you need. Every engagement begins with understanding alignment.',
        type: 'website',
        url: `${baseUrl}/apply`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Apply for Partnership | Oceo Luxe',
        description: 'Apply to work with Oceo Luxe. Share where your brand is and what you need. Every engagement begins with understanding alignment.',
      },
    },
    blog: {
      title: 'Blog | Insights on Fashion Operations & Production Clarity',
      description: 'Insights on fashion operations, production clarity, and building brands designed for longevity. From Oceo Luxe.',
      keywords: ['fashion operations blog', 'production clarity', 'fashion brand strategy', 'fashion business insights'],
      alternates: { canonical: `${baseUrl}/blog` },
      openGraph: {
        title: 'Blog | Oceo Luxe',
        description: 'Insights on fashion operations, production clarity, and building brands designed for longevity. From Oceo Luxe.',
        type: 'website',
        url: `${baseUrl}/blog`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog | Oceo Luxe',
        description: 'Insights on fashion operations, production clarity, and building brands designed for longevity. From Oceo Luxe.',
      },
    },
    about: {
      title: 'About Kerri Bridgman | Oceo Luxe',
      description: 'FIT-trained production manager with over a decade of experience in fashion production and supply chain leadership. The operational expertise behind Oceo Luxe.',
      keywords: ['kerri bridgman', 'fashion production expert', 'FIT production manager', 'fashion operations leader'],
      alternates: { canonical: `${baseUrl}/about` },
      openGraph: {
        title: 'About Kerri Bridgman | Oceo Luxe',
        description: 'FIT-trained production manager with over a decade of experience in fashion production and supply chain leadership. The operational expertise behind Oceo Luxe.',
        type: 'profile',
        url: `${baseUrl}/about`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'About Kerri Bridgman | Oceo Luxe',
        description: 'FIT-trained production manager with over a decade of experience in fashion production and supply chain leadership. The operational expertise behind Oceo Luxe.',
      },
    },
    faq: {
      title: 'Frequently Asked Questions | Fashion Production',
      description: 'Answers to common questions about fashion production: how to find a factory, first production run quantities, realistic timelines, and sourcing.',
      keywords: ['find a factory', 'first production run', 'fashion production FAQ', 'factory communication tips'],
      alternates: { canonical: `${baseUrl}/faq` },
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
      title: 'Book a Fashion Production Consultant',
      description: 'Book a discovery call with Kerri Bridgman. Get clarity on your fashion production process, factory relationships, and scaling strategy.',
      keywords: ['book fashion consultant', 'discovery call', 'fashion production consultation'],
      alternates: { canonical: `${baseUrl}/book` },
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
    quiz: {
      title: 'Designer Quiz | Discover Your Designer Archetype',
      description: 'Discover what kind of fashion designer you are. Take our quiz to learn how you connect with your clients and craft your collections.',
      keywords: ['designer archetype quiz', 'fashion designer quiz', 'fashion production style'],
      alternates: { canonical: `${baseUrl}/quiz` },
      openGraph: {
        title: 'Designer Quiz | Oceo Luxe',
        description: 'Discover what kind of fashion designer you are. Take our quiz to learn how you connect with your clients and craft your collections.',
        type: 'website',
        url: `${baseUrl}/quiz`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Designer Quiz | Oceo Luxe',
        description: 'Discover what kind of fashion designer you are. Take our quiz to learn how you connect with your clients and craft your collections.',
      },
    },
    'quiz/signature-style': {
      title: 'Can You Identify the Signature Style?',
      description: 'Test your knowledge of fashion history. Can you identify the iconic signature styles of legendary fashion houses and designers?',
      keywords: ['fashion signature style quiz', 'fashion history quiz', 'designer style identification'],
      alternates: { canonical: `${baseUrl}/quiz/signature-style` },
      openGraph: {
        title: 'Signature Style Quiz | Oceo Luxe',
        description: 'Test your knowledge of fashion history. Can you identify the iconic signature styles of legendary fashion houses and designers?',
        type: 'website',
        url: `${baseUrl}/quiz/signature-style`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Signature Style Quiz | Oceo Luxe',
        description: 'Test your knowledge of fashion history. Can you identify the iconic signature styles of legendary fashion houses and designers?',
      },
    },
    'quiz/about': {
      title: 'Discover Your Designer Archetype Quiz',
      description: 'Discover your Designer Archetype in 2 minutes. Find out what kind of fashion designer you are and align your production strategy with your creative vision.',
      keywords: ['designer archetype quiz', 'fashion designer quiz', 'production strategy alignment'],
      alternates: { canonical: `${baseUrl}/quiz/about` },
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
      alternates: { canonical: `${baseUrl}/products` },
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
      title: 'Studio Systems | Operational Systems for Fashion Brands',
      description: 'Operational systems designed for independent fashion brands. Production frameworks, supplier management, live Q&A, and community. Built from real-world production leadership.',
      keywords: ['fashion production systems', 'operational membership', 'oceo method', 'fashion brand operations'],
      alternates: { canonical: `${baseUrl}/studio-systems` },
      openGraph: {
        title: 'Studio Systems | Oceo Luxe',
        description: 'Operational systems designed for independent fashion brands. Production frameworks, supplier management, live Q&A, and community. Built from real-world production leadership.',
        type: 'website',
        url: `${baseUrl}/studio-systems`,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Studio Systems | Oceo Luxe',
        description: 'Operational systems designed for independent fashion brands. Production frameworks, supplier management, live Q&A, and community. Built from real-world production leadership.',
      },
    },
    join: {
      title: 'Join Studio Systems | Production Membership',
      description: 'Join the Studio Systems membership for fashion designers. Get production frameworks, templates, community support, and live Q&A calls.',
      keywords: ['join studio systems', 'fashion designer membership', 'production frameworks'],
      alternates: { canonical: `${baseUrl}/join` },
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
      alternates: { canonical: `${baseUrl}/privacy` },
    },
    terms: {
      title: 'Terms of Service',
      description: 'Oceo Luxe terms of service and conditions for using our website, products, and services.',
      alternates: { canonical: `${baseUrl}/terms` },
    },
  };

  return defaults[page] || defaults.home;
}
