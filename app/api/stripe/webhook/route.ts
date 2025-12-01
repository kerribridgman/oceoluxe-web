import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import {
  getPurchaseByPaymentIntentId,
  getPurchaseBySubscriptionId,
  updatePurchaseStatus,
  markDeliveryEmailSent,
} from '@/lib/db/queries-purchases';
import { getDashboardProductById } from '@/lib/db/queries-dashboard-products';
import { getNotionProductBySlug } from '@/lib/db/queries-notion-products';
import { getNotionProductPriceConfig, getNotionProductDeliveryUrl } from '@/lib/config/notion-product-prices';
import { sendPurchaseConfirmationEmail, sendSubscriptionWelcomeEmail } from '@/lib/email/purchase-emails';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object);
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment_intent.succeeded:', paymentIntent.id);
  console.log('Payment intent metadata:', paymentIntent.metadata);

  // Check if this is a Notion product purchase (has source: 'notion_product' in metadata)
  if (paymentIntent.metadata?.source === 'notion_product') {
    await handleNotionProductPayment(paymentIntent);
    return;
  }

  // Otherwise, handle as a dashboard product purchase
  // Find the purchase by payment intent ID
  const purchase = await getPurchaseByPaymentIntentId(paymentIntent.id);

  if (!purchase) {
    console.log('No purchase found for payment intent:', paymentIntent.id);
    return;
  }

  // Update purchase status to completed
  await updatePurchaseStatus(purchase.id, 'completed');

  // Get the product details
  const product = await getDashboardProductById(purchase.productId);

  if (!product) {
    console.error('Product not found for purchase:', purchase.id);
    return;
  }

  // Send confirmation email
  const emailResult = await sendPurchaseConfirmationEmail(
    {
      name: product.name,
      description: product.shortDescription,
      deliveryType: product.deliveryType,
      downloadUrl: product.downloadUrl,
      accessInstructions: product.accessInstructions,
    },
    {
      customerEmail: purchase.customerEmail,
      customerName: purchase.customerName,
      amountPaidCents: purchase.amountPaidCents,
      currency: purchase.currency,
      isSubscription: false,
    },
    product.slug
  );

  if (emailResult.success) {
    await markDeliveryEmailSent(purchase.id);
    console.log('Purchase confirmation email sent for purchase:', purchase.id);
  } else {
    console.error('Failed to send purchase email:', emailResult.error);
  }
}

/**
 * Handle Notion product payment - send delivery email with template link
 */
async function handleNotionProductPayment(paymentIntent: Stripe.PaymentIntent) {
  const { productSlug, customerEmail, customerName, productTitle } = paymentIntent.metadata;

  console.log('Processing Notion product payment:', {
    productSlug,
    customerEmail,
    productTitle,
  });

  if (!productSlug || !customerEmail) {
    console.error('Missing required metadata for Notion product payment');
    return;
  }

  // Get the Notion product for description
  const notionProduct = await getNotionProductBySlug(productSlug);

  // Get the delivery URL from config
  const deliveryUrl = getNotionProductDeliveryUrl(productSlug);
  const priceConfig = getNotionProductPriceConfig(productSlug);

  if (!deliveryUrl) {
    console.error('No delivery URL configured for Notion product:', productSlug);
    return;
  }

  // Send confirmation email with delivery link
  const emailResult = await sendPurchaseConfirmationEmail(
    {
      name: productTitle || notionProduct?.title || productSlug,
      description: notionProduct?.description || notionProduct?.excerpt || null,
      deliveryType: priceConfig?.deliveryType || 'email',
      downloadUrl: deliveryUrl,
      accessInstructions: null,
    },
    {
      customerEmail,
      customerName: customerName || null,
      amountPaidCents: paymentIntent.amount,
      currency: paymentIntent.currency,
      isSubscription: false,
    },
    productSlug
  );

  if (emailResult.success) {
    console.log('Notion product delivery email sent to:', customerEmail);
  } else {
    console.error('Failed to send Notion product email:', emailResult.error);
  }
}

async function handleInvoicePaymentSucceeded(invoiceData: Stripe.Event.Data.Object) {
  const invoice = invoiceData as {
    id: string;
    subscription?: string | null;
    billing_reason?: string | null;
  };

  console.log('Processing invoice.payment_succeeded:', invoice.id);

  // Only process subscription invoices
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    console.log('Not a subscription invoice, skipping');
    return;
  }

  // Find the purchase by subscription ID
  const purchase = await getPurchaseBySubscriptionId(subscriptionId);

  if (!purchase) {
    console.log('No purchase found for subscription:', subscriptionId);
    return;
  }

  // Check if this is the first invoice (subscription creation)
  const isFirstInvoice = invoice.billing_reason === 'subscription_create';

  if (!isFirstInvoice) {
    // Just update status for renewal payments
    await updatePurchaseStatus(purchase.id, 'completed');
    console.log('Renewal payment processed for purchase:', purchase.id);
    return;
  }

  // Update purchase status to completed
  await updatePurchaseStatus(purchase.id, 'completed');

  // Get the product details
  const product = await getDashboardProductById(purchase.productId);

  if (!product) {
    console.error('Product not found for purchase:', purchase.id);
    return;
  }

  // Send subscription welcome email
  const emailResult = await sendSubscriptionWelcomeEmail(
    {
      name: product.name,
      description: product.shortDescription,
      deliveryType: product.deliveryType,
      downloadUrl: product.downloadUrl,
      accessInstructions: product.accessInstructions,
    },
    {
      customerEmail: purchase.customerEmail,
      customerName: purchase.customerName,
      amountPaidCents: purchase.amountPaidCents,
      currency: purchase.currency,
      isSubscription: true,
      billingInterval: purchase.billingInterval as 'month' | 'year' | null,
    },
    product.slug
  );

  if (emailResult.success) {
    await markDeliveryEmailSent(purchase.id);
    console.log('Subscription welcome email sent for purchase:', purchase.id);
  } else {
    console.error('Failed to send subscription email:', emailResult.error);
  }
}
