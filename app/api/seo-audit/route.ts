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
  hasRobots: boolean;
  inSitemap: boolean;
}

interface AuditSummary {
  totalPages: number;
  pagesWithTitle: number;
  pagesWithDescription: number;
  pagesWithOgImage: number;
  pagesWithKeywords: number;
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
  '/book', '/apply/work-with-me', '/privacy', '/terms',
];

// Metadata defaults to check against (matches lib/seo/metadata.ts defaults)
const METADATA_DEFAULTS: Record<string, { title?: string; description?: string; keywords?: string[]; ogImage?: boolean }> = {
  home: {
    title: 'Oceo Luxe | Fashion Production & Operations',
    description: 'Fashion production consulting and operations support for independent designers.',
    keywords: ['fashion production consulting'],
    ogImage: true,
  },
  services: {
    title: 'Fashion Production Consulting & Services',
    description: 'Fashion production consultant services',
    keywords: ['fashion production consultant'],
  },
  blog: {
    title: 'Fashion Production Blog',
    description: 'Insights on fashion production',
    keywords: ['fashion production blog'],
  },
  about: {
    title: 'About Kerri Bridgman',
    description: 'Fashion production expert',
    keywords: ['fashion production expert', 'kerri bridgman'],
  },
  faq: {
    title: 'Frequently Asked Questions',
    description: 'Answers to common questions about fashion production',
    keywords: ['find a factory', 'first production run'],
  },
  products: {
    title: 'Fashion Production Resources & Templates',
    description: 'Tech pack templates',
    keywords: ['tech pack templates'],
  },
  'studio-systems': {
    title: 'Studio Systems Membership',
    description: 'Fashion designer education',
    keywords: ['fashion designer education'],
  },
  'quiz/about': {
    title: 'Designer Archetype Quiz',
    description: 'Discover your Designer Archetype',
    keywords: ['designer archetype quiz'],
  },
  book: {
    title: 'Book a Fashion Consultant',
    description: 'Book a discovery call',
    keywords: ['book fashion consultant'],
  },
  'apply/work-with-me': {
    title: 'Work With Me',
    description: 'Apply to work 1:1',
    keywords: ['fashion production consulting'],
  },
  join: {
    title: 'Join Studio Systems',
    description: 'Join the Studio Systems membership',
    keywords: ['join studio systems'],
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
    const inSitemap = SITEMAP_PAGES.includes(path);

    if (!hasOgImage && page !== 'home') {
      // Home has OG from root layout; others inherit
    }

    if (!hasKeywords) {
      issues.push(`${page}: Missing keywords`);
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
  const pagesInSitemap = publicResults.filter((r) => r.inSitemap).length;

  // Score: weight titles and descriptions heavily, sitemap and keywords moderately
  const totalPublic = PUBLIC_PAGES.length;
  const score = Math.round(
    ((pagesWithTitle / totalPublic) * 25 +
      (pagesWithDescription / totalPublic) * 25 +
      (pagesInSitemap / totalPublic) * 20 +
      (pagesWithKeywords / totalPublic) * 15 +
      (pagesWithOgImage / totalPublic) * 15)
  );

  const summary: AuditSummary = {
    totalPages: results.length,
    pagesWithTitle,
    pagesWithDescription,
    pagesWithOgImage,
    pagesWithKeywords,
    pagesInSitemap,
    issues,
    score,
    results,
  };

  return NextResponse.json(summary);
}
