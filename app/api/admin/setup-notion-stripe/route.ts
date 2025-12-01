import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { stripe } from '@/lib/payments/stripe';
import { notionProductPrices } from '@/lib/config/notion-product-prices';

/**
 * One-time setup endpoint to create Stripe products and prices for Notion products
 * Call this once to set up all Stripe products, then copy the price IDs to the config file
 *
 * GET /api/admin/setup-notion-stripe
 */
export async function GET(request: NextRequest) {
  // Require authenticated user
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Array<{
    slug: string;
    name: string;
    priceInCents: number;
    stripeProductId: string;
    stripePriceId: string;
  }> = [];

  const errors: Array<{ slug: string; error: string }> = [];

  // Product names for each slug
  const productNames: Record<string, string> = {
    'the-vision-reset-journal': 'The Vision Reset Journal',
    'inventory-asset-tracker-template': 'Inventory & Asset Tracker Template',
    'consultant-success-package': 'Consultant Success Package',
    'fashion-business-sos-workflow-starter-kit': 'Fashion Business SOS: Workflow Starter Kit',
  };

  for (const [slug, config] of Object.entries(notionProductPrices)) {
    try {
      // Skip if already has a price ID
      if (config.stripePriceId) {
        results.push({
          slug,
          name: productNames[slug] || slug,
          priceInCents: config.priceInCents,
          stripeProductId: 'existing',
          stripePriceId: config.stripePriceId,
        });
        continue;
      }

      const productName = productNames[slug] || slug;

      // Create Stripe product
      const product = await stripe.products.create({
        name: productName,
        metadata: {
          source: 'notion_product',
          slug: slug,
        },
      });

      // Create Stripe price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: config.priceInCents,
        currency: 'usd',
      });

      results.push({
        slug,
        name: productName,
        priceInCents: config.priceInCents,
        stripeProductId: product.id,
        stripePriceId: price.id,
      });
    } catch (error: any) {
      errors.push({
        slug,
        error: error.message || 'Unknown error',
      });
    }
  }

  // Return the results with instructions
  return NextResponse.json({
    message: 'Stripe products created! Copy these price IDs to lib/config/notion-product-prices.ts',
    results,
    errors,
    // Generate the config snippet to copy
    configSnippet: results.map(r =>
      `'${r.slug}': {\n  stripePriceId: '${r.stripePriceId}',\n  // ... rest of config\n}`
    ).join('\n\n'),
  });
}
