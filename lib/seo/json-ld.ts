export interface OrganizationJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  founder?: { '@type': 'Person'; name: string };
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    email: string;
    contactType: string;
  };
}

export interface WebSiteJsonLd {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: { '@id': string };
}

export interface FAQJsonLd {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }[];
}

export interface ProductJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description?: string;
  image?: string;
  url?: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
    url?: string;
  };
  brand?: {
    '@type': 'Brand';
    name: string;
  };
}

export interface BreadcrumbJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
}

export interface ServiceJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description?: string;
  provider?: { '@type': 'Organization'; name: string };
  serviceType?: string;
  url?: string;
  offers?: {
    '@type': 'Offer';
    price?: string;
    priceCurrency?: string;
    description?: string;
  };
}

export interface CourseJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Course';
  name: string;
  description?: string;
  provider?: { '@type': 'Organization'; name: string };
  url?: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

export function getOrganizationJsonLd(): OrganizationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Oceo Luxe',
    url: BASE_URL,
    logo: `${BASE_URL}/images/Logo.png`,
    description:
      'Strategic operational partnership for fashion founders. Production leadership, systems architecture, and operational clarity rooted in real-world experience.',
    founder: {
      '@type': 'Person',
      name: 'Kerri Bridgman',
    },
    sameAs: [
      'https://www.instagram.com/oceoluxe',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'kerrib@oceoluxe.com',
      contactType: 'customer service',
    },
  };
}

export function getWebSiteJsonLd(): WebSiteJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Oceo Luxe',
    url: BASE_URL,
    description:
      'Operational partnership, Studio Systems membership, and production resources for fashion founders ready to scale with structure and clarity.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

export function getFAQJsonLd(
  faqs: { question: string; answer: string }[]
): FAQJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };
}

export function getProductJsonLd(product: {
  name: string;
  description?: string;
  image?: string;
  priceInCents: number;
  url?: string;
  currency?: string;
}): ProductJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    brand: {
      '@type': 'Brand',
      name: 'Oceo Luxe',
    },
    offers: {
      '@type': 'Offer',
      price: (product.priceInCents / 100).toFixed(2),
      priceCurrency: product.currency || 'USD',
      availability: 'https://schema.org/InStock',
      url: product.url,
    },
  };
}

export function getBreadcrumbJsonLd(
  items: { name: string; url?: string }[]
): BreadcrumbJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getServiceJsonLd(services: {
  name: string;
  description?: string;
  url?: string;
  price?: string;
}[]): ServiceJsonLd[] {
  return services.map((service) => ({
    '@context': 'https://schema.org' as const,
    '@type': 'Service' as const,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization' as const,
      name: 'Oceo Luxe',
    },
    url: service.url,
    offers: service.price
      ? {
          '@type': 'Offer' as const,
          price: service.price,
          priceCurrency: 'USD',
        }
      : undefined,
  }));
}

export function getCourseJsonLd(course: {
  name: string;
  description?: string;
  url?: string;
  price?: string;
}): CourseJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'Oceo Luxe',
    },
    url: course.url,
    offers: course.price
      ? {
          '@type': 'Offer',
          price: course.price,
          priceCurrency: 'USD',
        }
      : undefined,
  };
}
