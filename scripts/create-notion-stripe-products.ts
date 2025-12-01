/**
 * Script to create Stripe products and prices for Notion products
 *
 * Run with: npx tsx scripts/create-notion-stripe-products.ts
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY not found in environment');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

// Products to create
const notionProducts = [
  {
    slug: 'the-vision-reset-journal',
    name: 'The Vision Reset Journal',
    priceInCents: 700,
  },
  {
    slug: 'inventory-asset-tracker-template',
    name: 'Inventory & Asset Tracker Template',
    priceInCents: 2700,
  },
  {
    slug: 'consultant-success-package',
    name: 'Consultant Success Package',
    priceInCents: 4700,
  },
  {
    slug: 'fashion-business-sos-workflow-starter-kit',
    name: 'Fashion Business SOS: Workflow Starter Kit',
    priceInCents: 4700,
  },
];

async function createProducts() {
  console.log('Creating Stripe products for Notion products...\n');
  console.log('Using Stripe key:', stripeSecretKey?.slice(0, 12) + '...\n');

  const results: Array<{ slug: string; productId: string; priceId: string }> = [];

  for (const product of notionProducts) {
    try {
      console.log(`Creating: ${product.name} ($${(product.priceInCents / 100).toFixed(2)})...`);

      // Create Stripe product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        metadata: {
          source: 'notion_product',
          slug: product.slug,
        },
      });

      // Create Stripe price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.priceInCents,
        currency: 'usd',
      });

      results.push({
        slug: product.slug,
        productId: stripeProduct.id,
        priceId: stripePrice.id,
      });

      console.log(`  Product ID: ${stripeProduct.id}`);
      console.log(`  Price ID: ${stripePrice.id}\n`);
    } catch (error: any) {
      console.error(`  Error: ${error.message}\n`);
    }
  }

  console.log('\n=== COPY THESE PRICE IDs TO lib/config/notion-product-prices.ts ===\n');

  for (const result of results) {
    console.log(`'${result.slug}': {`);
    console.log(`  stripePriceId: '${result.priceId}',`);
    console.log(`  // ... keep other config`);
    console.log(`},\n`);
  }
}

createProducts().catch(console.error);
