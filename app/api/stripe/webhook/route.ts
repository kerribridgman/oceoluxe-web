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
import { sendPurchaseConfirmationEmail, sendSubscriptionWelcomeEmail, sendStudioWelcomeEmail, sendAdminNewMemberNotification } from '@/lib/email/purchase-emails';
import { db } from '@/lib/db/drizzle';
import { educationSubscriptions, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object);
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      // Check if this is a Studio Systems subscription
      if (subscription.metadata?.subscriptionType === 'studio_systems') {
        await handleStudioSubscriptionChange(subscription);
      } else {
        await handleSubscriptionChange(subscription);
      }
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

/**
 * Handle checkout.session.completed for Studio Systems subscriptions
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);
  console.log('Session metadata:', session.metadata);

  // Check if this is a Studio Systems subscription
  if (session.metadata?.subscriptionType !== 'studio_systems') {
    console.log('Not a Studio Systems subscription, skipping');
    return;
  }

  const userId = session.metadata?.userId || session.client_reference_id;
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  if (!userId || !subscriptionId) {
    console.error('Missing userId or subscriptionId in checkout session');
    return;
  }

  // Retrieve the full subscription to get period dates
  const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);

  // Determine tier based on interval
  const interval = subscriptionData.items.data[0]?.price?.recurring?.interval;
  const tier = interval === 'year' ? 'yearly' : 'monthly';

  // Check if user already has a subscription
  const existingSub = await db.query.educationSubscriptions.findFirst({
    where: eq(educationSubscriptions.userId, parseInt(userId)),
  });

  // Extract subscription data - period dates are in items.data[0], not at top level
  const subscriptionItem = subscriptionData.items.data[0];
  const status = subscriptionData.status || 'active';
  // Access period dates from subscription item (where they actually are in the API response)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionItemAny = subscriptionItem as any;
  const currentPeriodStart = subscriptionItemAny.current_period_start as number | undefined;
  const currentPeriodEnd = subscriptionItemAny.current_period_end as number | undefined;
  const cancelAtPeriodEnd = subscriptionData.cancel_at_period_end || false;

  // Use fallback dates if period dates are undefined (shouldn't happen now)
  const now = new Date();
  const periodStart = currentPeriodStart ? new Date(currentPeriodStart * 1000) : now;
  const periodEnd = currentPeriodEnd
    ? new Date(currentPeriodEnd * 1000)
    : new Date(now.getTime() + (tier === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000);

  if (existingSub) {
    // Update existing subscription
    await db
      .update(educationSubscriptions)
      .set({
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
        tier,
        status,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(educationSubscriptions.userId, parseInt(userId)));
    console.log('Updated education subscription for user:', userId);
  } else {
    // Create new subscription
    await db.insert(educationSubscriptions).values({
      userId: parseInt(userId),
      tier,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: customerId,
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd,
    });
    console.log('Created education subscription for user:', userId);
  }

  // Get user details for email
  const user = await db.query.users.findFirst({
    where: eq(users.id, parseInt(userId)),
  });

  if (user) {
    const amountCents = subscriptionData.items.data[0]?.price?.unit_amount || 0;

    // Send welcome email to new member
    const welcomeResult = await sendStudioWelcomeEmail({
      email: user.email,
      name: user.name,
      tier,
      amountCents,
    });

    if (welcomeResult.success) {
      console.log('Studio welcome email sent to:', user.email);
    } else {
      console.error('Failed to send studio welcome email:', welcomeResult.error);
    }

    // Send admin notification
    const adminResult = await sendAdminNewMemberNotification({
      email: user.email,
      name: user.name,
      tier,
      amountCents,
    });

    if (adminResult.success) {
      console.log('Admin notification sent for new member:', user.email);
    } else {
      console.error('Failed to send admin notification:', adminResult.error);
    }
  }
}

/**
 * Handle subscription updates/cancellations for Studio Systems
 */
async function handleStudioSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Processing Studio Systems subscription change:', subscription.id);
  console.log('Status:', subscription.status);

  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId in Studio Systems subscription metadata');
    return;
  }

  // Access subscription data directly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionAny = subscription as any;
  const status = subscription.status;
  const currentPeriodStart = subscriptionAny.current_period_start;
  const currentPeriodEnd = subscriptionAny.current_period_end;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  if (status === 'active' || status === 'trialing') {
    // Update subscription details
    await db
      .update(educationSubscriptions)
      .set({
        status,
        currentPeriodStart: new Date(currentPeriodStart * 1000),
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
        cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(educationSubscriptions.userId, parseInt(userId)));
    console.log('Updated Studio subscription for user:', userId);
  } else if (status === 'canceled' || status === 'unpaid' || status === 'past_due') {
    // Update status to reflect cancellation/issue
    await db
      .update(educationSubscriptions)
      .set({
        status,
        cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(educationSubscriptions.userId, parseInt(userId)));
    console.log('Studio subscription status changed to', status, 'for user:', userId);
  }
}
