/**
 * Stripe Product and Price management for Dashboard Products
 */

import Stripe from 'stripe';
import { stripe } from './stripe';
import { DashboardProduct } from '@/lib/db/schema';

/**
 * Create a Stripe Product from a dashboard product
 */
export async function createStripeProduct(product: DashboardProduct): Promise<Stripe.Product> {
  return await stripe.products.create({
    name: product.name,
    description: product.description || undefined,
    images: product.coverImageUrl ? [product.coverImageUrl] : undefined,
    metadata: {
      dashboardProductId: product.id.toString(),
      productType: product.productType,
      deliveryType: product.deliveryType,
    },
  });
}

/**
 * Update an existing Stripe Product
 */
export async function updateStripeProduct(
  stripeProductId: string,
  product: DashboardProduct
): Promise<Stripe.Product> {
  return await stripe.products.update(stripeProductId, {
    name: product.name,
    description: product.description || undefined,
    images: product.coverImageUrl ? [product.coverImageUrl] : undefined,
    metadata: {
      dashboardProductId: product.id.toString(),
      productType: product.productType,
      deliveryType: product.deliveryType,
    },
  });
}

/**
 * Create a Stripe Price for a product
 */
export async function createStripePrice(
  stripeProductId: string,
  amountInCents: number,
  currency: string = 'usd',
  recurring?: { interval: 'month' | 'year' }
): Promise<Stripe.Price> {
  const priceData: Stripe.PriceCreateParams = {
    product: stripeProductId,
    unit_amount: amountInCents,
    currency: currency.toLowerCase(),
  };

  if (recurring) {
    priceData.recurring = {
      interval: recurring.interval,
    };
  }

  return await stripe.prices.create(priceData);
}

/**
 * Archive an existing price and create a new one (prices cannot be updated in Stripe)
 */
export async function replaceStripePrice(
  existingPriceId: string,
  stripeProductId: string,
  amountInCents: number,
  currency: string = 'usd',
  recurring?: { interval: 'month' | 'year' }
): Promise<Stripe.Price> {
  // Archive the old price
  await stripe.prices.update(existingPriceId, { active: false });

  // Create a new price
  return await createStripePrice(stripeProductId, amountInCents, currency, recurring);
}

/**
 * Sync a dashboard product to Stripe
 * Creates or updates the Stripe Product and Price(s)
 */
export async function syncProductToStripe(product: DashboardProduct): Promise<{
  stripeProductId: string;
  stripePriceId: string;
  stripeYearlyPriceId?: string;
}> {
  let stripeProduct: Stripe.Product;

  // Create or update Stripe Product
  if (product.stripeProductId) {
    // Update existing product
    stripeProduct = await updateStripeProduct(product.stripeProductId, product);
  } else {
    // Create new product
    stripeProduct = await createStripeProduct(product);
  }

  let stripePriceId: string;
  let stripeYearlyPriceId: string | undefined;

  if (product.productType === 'subscription') {
    // Create monthly subscription price
    if (product.stripePriceId) {
      // Check if price needs updating
      const existingPrice = await stripe.prices.retrieve(product.stripePriceId);
      if (existingPrice.unit_amount !== product.priceInCents) {
        const newPrice = await replaceStripePrice(
          product.stripePriceId,
          stripeProduct.id,
          product.priceInCents,
          product.currency,
          { interval: 'month' }
        );
        stripePriceId = newPrice.id;
      } else {
        stripePriceId = product.stripePriceId;
      }
    } else {
      const monthlyPrice = await createStripePrice(
        stripeProduct.id,
        product.priceInCents,
        product.currency,
        { interval: 'month' }
      );
      stripePriceId = monthlyPrice.id;
    }

    // Create yearly subscription price if applicable
    if (product.yearlyPriceInCents) {
      if (product.stripeYearlyPriceId) {
        const existingYearlyPrice = await stripe.prices.retrieve(product.stripeYearlyPriceId);
        if (existingYearlyPrice.unit_amount !== product.yearlyPriceInCents) {
          const newYearlyPrice = await replaceStripePrice(
            product.stripeYearlyPriceId,
            stripeProduct.id,
            product.yearlyPriceInCents,
            product.currency,
            { interval: 'year' }
          );
          stripeYearlyPriceId = newYearlyPrice.id;
        } else {
          stripeYearlyPriceId = product.stripeYearlyPriceId;
        }
      } else {
        const yearlyPrice = await createStripePrice(
          stripeProduct.id,
          product.yearlyPriceInCents,
          product.currency,
          { interval: 'year' }
        );
        stripeYearlyPriceId = yearlyPrice.id;
      }
    }
  } else {
    // One-time purchase price
    if (product.stripePriceId) {
      const existingPrice = await stripe.prices.retrieve(product.stripePriceId);
      if (existingPrice.unit_amount !== product.priceInCents) {
        const newPrice = await replaceStripePrice(
          product.stripePriceId,
          stripeProduct.id,
          product.priceInCents,
          product.currency
        );
        stripePriceId = newPrice.id;
      } else {
        stripePriceId = product.stripePriceId;
      }
    } else {
      const price = await createStripePrice(
        stripeProduct.id,
        product.priceInCents,
        product.currency
      );
      stripePriceId = price.id;
    }
  }

  return {
    stripeProductId: stripeProduct.id,
    stripePriceId,
    stripeYearlyPriceId,
  };
}

/**
 * Create a PaymentIntent for a one-time purchase
 */
export async function createPaymentIntent(
  amountInCents: number,
  currency: string,
  customerEmail: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  // Find or create customer
  let customer: Stripe.Customer;
  const existingCustomers = await stripe.customers.list({
    email: customerEmail,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
  } else {
    customer = await stripe.customers.create({
      email: customerEmail,
    });
  }

  return await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    customer: customer.id,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Create a subscription for a recurring purchase
 */
export async function createSubscription(
  priceId: string,
  customerEmail: string,
  metadata: Record<string, string>
): Promise<{
  subscription: Stripe.Subscription;
  clientSecret: string;
}> {
  // Find or create customer
  let customer: Stripe.Customer;
  const existingCustomers = await stripe.customers.list({
    email: customerEmail,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
  } else {
    customer = await stripe.customers.create({
      email: customerEmail,
    });
  }

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata,
  });

  // Extract client secret from expanded invoice.payment_intent
  const latestInvoice = subscription.latest_invoice as { payment_intent?: { client_secret?: string } } | null;
  const clientSecret = latestInvoice?.payment_intent?.client_secret || '';

  return {
    subscription,
    clientSecret,
  };
}
