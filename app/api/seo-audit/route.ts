import { NextResponse } from 'next/server';

interface AuditResult {
  page: string;
  url: string;
  hasTitle: boolean;
  titleLength: number | null;
  titleIssue: string | null;
  hasDescription: boolean;
  descriptionLength: number | null;
  descriptionIssue: string | null;
  hasOgImage: boolean;
  hasKeywords: boolean;
  hasCanonical: boolean;
  hasRobots: boolean;
  inSitemap: boolean;
}

interface AuditSummary {
  totalPages: number;
  pagesWithTitle: number;
  pagesWithDescription: number;
  pagesWithOgImage: number;
  pagesWithKeywords: number;
  pagesWithCanonical: number;
  pagesInSitemap: number;
  issues: string[];
  score: number;
  results: AuditResult[];
}

// Pages that should have full SEO metadata
const PUBLIC_PAGES = [
  { page: 'home', path: '/' },
  { page: 'services', path: '/services' },
  { page: 'blog', path: '/blog' },
  { page: 'about', path: '/about' },
  { page: 'faq', path: '/faq' },
  { page: 'products', path: '/products' },
  { page: 'studio-systems', path: '/studio-systems' },
  { page: 'quiz/about', path: '/quiz/about' },
  { page: 'book', path: '/book' },
  { page: 'apply/work-with-me', path: '/apply/work-with-me' },
  { page: 'join', path: '/join' },
];

// Pages that should have noindex
const NOINDEX_PAGES = [
  { page: 'cart', path: '/cart' },
  { page: 'checkout/thank-you', path: '/checkout/thank-you' },
  { page: 'unsubscribe', path: '/unsubscribe' },
  { page: 'sign-in', path: '/sign-in' },
  { page: 'sign-up', path: '/sign-up' },
  { page: 'studio-login', path: '/studio-login' },
  { page: 'studio-join', path: '/studio-join' },
];

// Sitemap pages that should be included
const SITEMAP_PAGES = [
  '/', '/services', '/blog', '/about', '/faq', '/products',
  '/studio-systems', '/studio-systems/join', '/quiz/about',
  '/book', '/apply/work-with-me', '/join', '/quiz',
  '/quiz/signature-style', '/studio-systems/waitlist',
  '/privacy', '/terms',
];

// Metadata defaults to check against (must match actual titles/descriptions from lib/seo/metadata.ts)
const METADATA_DEFAULTS: Record<string, { title?: string; description?: string; keywords?: string[]; ogImage?: boolean; hasCanonical?: boolean }> = {
  home: {
    title: 'Oceo Luxe | Fashion Production & Operations',
    description: 'Fashion production consulting and operations support for independent designers. Build sustainable production systems that feel like luxury.',
    keywords: ['fashion production consulting', 'production operations', 'sustainable fashion production', 'fashion designer support'],
    ogImage: true,
    hasCanonical: true,
  },
  services: {
    title: 'Fashion Production Consulting & Services',
    description: 'Fashion production consultant services: 1:1 consulting, Studio Systems membership, production setup, and strategic guidance for fashion designers.',
    keywords: ['fashion production consultant', '1:1 consulting', 'production systems setup', 'fashion business consulting'],
    ogImage: true,
    hasCanonical: true,
  },
  blog: {
    title: 'Fashion Production Blog & Resources',
    description: 'Insights on fashion production, sustainable sourcing, factory communication, and building a fashion business with clarity. Expert consultant advice.',
    keywords: ['fashion production blog', 'sustainable fashion', 'factory communication', 'fashion business advice'],
    ogImage: true,
    hasCanonical: true,
  },
  about: {
    title: 'About Kerri Bridgman | Fashion Production Expert',
    description: 'Fashion production expert and FIT-trained production manager with 10 years of experience helping independent designers build sustainable production systems.',
    keywords: ['fashion production expert', 'kerri bridgman', 'FIT production manager', 'fashion consultant'],
    ogImage: true,
    hasCanonical: true,
  },
  faq: {
    title: 'Frequently Asked Questions | Fashion Production',
    description: 'Answers to common questions about fashion production: how to find a factory, first production run quantities, realistic timelines, and sourcing.',
    keywords: ['find a factory', 'first production run', 'fashion production FAQ', 'factory communication tips'],
    ogImage: true,
    hasCanonical: true,
  },
  products: {
    title: 'Fashion Production Resources & Templates',
    description: 'Tech pack templates, production resources, and digital tools for independent fashion designers. Build your brand with proven systems.',
    keywords: ['tech pack templates', 'fashion production resources', 'fashion designer templates'],
    ogImage: true,
    hasCanonical: true,
  },
  'studio-systems': {
    title: 'Studio Systems | Fashion Production Education',
    description: 'Fashion designer education and production membership. Learn The Oceo Method with live Q&A, Notion systems, private community, and somatic support.',
    keywords: ['fashion designer education', 'production membership', 'oceo method', 'fashion business membership'],
    ogImage: true,
    hasCanonical: true,
  },
  'quiz/about': {
    title: 'Discover Your Designer Archetype Quiz',
    description: 'Discover your Designer Archetype in 2 minutes. Find out what kind of fashion designer you are and align your production strategy with your creative vision.',
    keywords: ['designer archetype quiz', 'fashion designer quiz', 'production strategy alignment'],
    ogImage: true,
    hasCanonical: true,
  },
  book: {
    title: 'Book a Fashion Production Consultant',
    description: 'Book a discovery call with Kerri Bridgman. Get clarity on your fashion production process, factory relationships, and scaling strategy.',
    keywords: ['book fashion consultant', 'discovery call', 'fashion production consultation'],
    ogImage: true,
    hasCanonical: true,
  },
  'apply/work-with-me': {
    title: 'Work With Me | Fashion Production Consulting',
    description: 'Apply to work 1:1 with Kerri Bridgman on your fashion production systems, factory communication, and scaling strategy.',
    keywords: ['fashion production consulting', 'work with kerri bridgman', '1:1 fashion consulting'],
    ogImage: true,
    hasCanonical: true,
  },
  join: {
    title: 'Join Studio Systems | Production Membership',
    description: 'Join the Studio Systems membership for fashion designers. Get production frameworks, templates, community support, and live Q&A calls.',
    keywords: ['join studio systems', 'fashion designer membership', 'production frameworks'],
    ogImage: true,
    hasCanonical: true,
  },
};

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';
  const issues: string[] = [];
  const results: AuditResult[] = [];

  // Check public pages
  for (const { page, path } of PUBLIC_PAGES) {
    const defaults = METADATA_DEFAULTS[page];
    const url = `${baseUrl}${path}`;

    const hasTitle = !!defaults?.title;
    const titleLength = defaults?.title?.length || null;
    let titleIssue: string | null = null;

    if (!hasTitle) {
      titleIssue = 'Missing title';
      issues.push(`${page}: Missing title`);
    } else if (titleLength && titleLength > 60) {
      titleIssue = `Title too long (${titleLength} chars, max 60)`;
      issues.push(`${page}: ${titleIssue}`);
    } else if (titleLength && titleLength < 30) {
      titleIssue = `Title too short (${titleLength} chars, min 30)`;
      issues.push(`${page}: ${titleIssue}`);
    }

    const hasDescription = !!defaults?.description;
    const descriptionLength = defaults?.description?.length || null;
    let descriptionIssue: string | null = null;

    if (!hasDescription) {
      descriptionIssue = 'Missing description';
      issues.push(`${page}: Missing description`);
    } else if (descriptionLength && descriptionLength > 160) {
      descriptionIssue = `Description too long (${descriptionLength} chars, max 160)`;
      issues.push(`${page}: ${descriptionIssue}`);
    } else if (descriptionLength && descriptionLength < 50) {
      descriptionIssue = `Description too short (${descriptionLength} chars, min 50)`;
      issues.push(`${page}: ${descriptionIssue}`);
    }

    const hasOgImage = !!defaults?.ogImage;
    const hasKeywords = !!defaults?.keywords && defaults.keywords.length > 0;
    const hasCanonical = !!defaults?.hasCanonical;
    const inSitemap = SITEMAP_PAGES.includes(path);

    if (!hasOgImage) {
      issues.push(`${page}: Missing OG image`);
    }

    if (!hasKeywords) {
      issues.push(`${page}: Missing keywords`);
    }

    if (!hasCanonical) {
      issues.push(`${page}: Missing canonical URL`);
    }

    if (!inSitemap) {
      issues.push(`${page}: Not in sitemap`);
    }

    results.push({
      page,
      url,
      hasTitle,
      titleLength,
      titleIssue,
      hasDescription,
      descriptionLength,
      descriptionIssue,
      hasOgImage,
      hasKeywords,
      hasCanonical,
      hasRobots: true,
      inSitemap,
    });
  }

  // Check noindex pages
  for (const { page, path } of NOINDEX_PAGES) {
    results.push({
      page,
      url: `${baseUrl}${path}`,
      hasTitle: true,
      titleLength: null,
      titleIssue: null,
      hasDescription: true,
      descriptionLength: null,
      descriptionIssue: null,
      hasOgImage: false,
      hasKeywords: false,
      hasCanonical: false,
      hasRobots: true,
      inSitemap: false,
    });
  }

  const publicResults = results.filter((r) =>
    PUBLIC_PAGES.some((p) => p.page === r.page)
  );

  const pagesWithTitle = publicResults.filter((r) => r.hasTitle && !r.titleIssue).length;
  const pagesWithDescription = publicResults.filter((r) => r.hasDescription && !r.descriptionIssue).length;
  const pagesWithOgImage = publicResults.filter((r) => r.hasOgImage).length;
  const pagesWithKeywords = publicResults.filter((r) => r.hasKeywords).length;
  const pagesWithCanonical = publicResults.filter((r) => r.hasCanonical).length;
  const pagesInSitemap = publicResults.filter((r) => r.inSitemap).length;

  // Score: weight titles and descriptions heavily, sitemap/canonical/keywords/OG moderately
  const totalPublic = PUBLIC_PAGES.length;
  const score = Math.round(
    ((pagesWithTitle / totalPublic) * 20 +
      (pagesWithDescription / totalPublic) * 20 +
      (pagesInSitemap / totalPublic) * 15 +
      (pagesWithCanonical / totalPublic) * 15 +
      (pagesWithKeywords / totalPublic) * 15 +
      (pagesWithOgImage / totalPublic) * 15)
  );

  const summary: AuditSummary = {
    totalPages: results.length,
    pagesWithTitle,
    pagesWithDescription,
    pagesWithOgImage,
    pagesWithKeywords,
    pagesWithCanonical,
    pagesInSitemap,
    issues,
    score,
    results,
  };

  return NextResponse.json(summary);
}
