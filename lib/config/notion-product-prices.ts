/**
 * Stripe Price Mapping for Notion Products
 *
 * This file maps Notion product slugs to their Stripe price IDs.
 * When you add a new product in Notion that needs checkout, add the mapping here.
 *
 * To get the Stripe Price ID:
 * 1. Go to Stripe Dashboard > Products
 * 2. Create or find the product
 * 3. Copy the Price ID (starts with "price_")
 *
 * IMPORTANT: Use TEST price IDs for development, LIVE price IDs for production.
 */

export interface NotionProductPriceConfig {
  stripePriceId: string;
  priceInCents: number;
  deliveryType: 'download' | 'access' | 'email';
  downloadUrl?: string;
  accessInstructions?: string;
  emailContent?: string;
}

// Free product config (no Stripe price ID needed)
export interface FreeProductConfig {
  priceInCents: 0;
  deliveryType: 'download' | 'access' | 'email';
  downloadUrl?: string;
  accessInstructions?: string;
  emailContent?: string;
}

// Map Notion product slugs to their Stripe configuration
// PAID PRODUCTS - These require Stripe checkout
// TODO: Add Stripe price IDs after creating products in Stripe Dashboard
export const notionProductPrices: Record<string, NotionProductPriceConfig> = {
  // The Vision Reset Journal - $7
  'the-vision-reset-journal': {
    stripePriceId: 'price_1SZg5Z2MEDjQyNJErW7wQqlD',
    priceInCents: 700,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Welcome-to-the-Vision-Reset-Journal-1ecb2e95832080a9a6d4eb96d9850439?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },

  // Inventory & Asset Tracker Template - $27
  'inventory-asset-tracker-template': {
    stripePriceId: 'price_1SZg5Z2MEDjQyNJEr3vHmslC',
    priceInCents: 2700,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Welcome-to-the-Inventory-Asset-Tracker-269b2e95832080a58dc3e0f6ecce8fa3?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },

  // Consultant Success Package - $47
  'consultant-success-package': {
    stripePriceId: 'price_1SZg5a2MEDjQyNJEphrPMqSJ',
    priceInCents: 4700,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Welcome-to-the-Consultant-Checklist-1ecb2e95832080e2b88ce767ad294df3?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },

  // Fashion Business SOS: Workflow Starter Kit - $47
  'fashion-business-sos-workflow-starter-kit': {
    stripePriceId: 'price_1SZg5a2MEDjQyNJE8yuotCGe',
    priceInCents: 4700,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Welcome-to-Fashion-Business-SOS-Workflow-Starter-Kit-1ecb2e95832080d2840df04df967a8a2?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },
};

// FREE PRODUCTS - These don't need Stripe, just email delivery
export const freeNotionProducts: Record<string, FreeProductConfig> = {
  'free-notion-template-digital-fabric-swatch-library': {
    priceInCents: 0,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Digital-Fabric-Swatch-Library-1ecb2e95832080078725fb94f0dd2b7e?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },

  'free-notion-production-calendar-checklist': {
    priceInCents: 0,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Production-Calendar-1feb2e95832080c5b5b9d8f5299b6f7f?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },

  'free-weekly-fashion-workflow-planner-beginner-friendly-notion-template': {
    priceInCents: 0,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Weekly-Fashion-Workflow-Planner-246b2e95832080b2984aea3809670e90?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },

  'free-fashion-pricing-calculator': {
    priceInCents: 0,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Fashion-Pricing-Calculator-246b2e9583208031b282ec0ea2003ddc?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },

  'free-the-fashion-biz-flow-map-one-page-notion-roadmap': {
    priceInCents: 0,
    deliveryType: 'email',
    downloadUrl: 'https://www.notion.so/kerribridgman/Fashion-Biz-Flow-Map-24ab2e95832080f9b265dfc3ae842da3?v=1ecb2e958320800c988f000cf532cc00&source=copy_link',
  },
};

/**
 * Get Stripe price config for a paid Notion product
 */
export function getNotionProductPriceConfig(slug: string): NotionProductPriceConfig | null {
  return notionProductPrices[slug] || null;
}

/**
 * Get config for a free Notion product
 */
export function getFreeNotionProductConfig(slug: string): FreeProductConfig | null {
  return freeNotionProducts[slug] || null;
}

/**
 * Check if a Notion product has Stripe checkout enabled (paid product)
 */
export function hasStripeCheckout(slug: string): boolean {
  const config = notionProductPrices[slug];
  return !!config && config.stripePriceId !== '';
}

/**
 * Check if this is a free product
 */
export function isFreeNotionProduct(slug: string): boolean {
  return slug in freeNotionProducts;
}

/**
 * Get delivery URL for any Notion product (paid or free)
 */
export function getNotionProductDeliveryUrl(slug: string): string | null {
  const paidConfig = notionProductPrices[slug];
  if (paidConfig?.downloadUrl) return paidConfig.downloadUrl;

  const freeConfig = freeNotionProducts[slug];
  if (freeConfig?.downloadUrl) return freeConfig.downloadUrl;

  return null;
}
