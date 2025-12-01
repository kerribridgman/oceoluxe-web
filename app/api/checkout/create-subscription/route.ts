import { NextRequest, NextResponse } from 'next/server';
import { getDashboardProductById } from '@/lib/db/queries-dashboard-products';
import { createSubscription } from '@/lib/payments/stripe-products';

// POST /api/checkout/create-subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { productId, customerEmail, customerName, billingInterval = 'month' } = body;

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    if (!customerEmail) {
      return NextResponse.json({ message: 'Customer email is required' }, { status: 400 });
    }

    // Get the product
    const product = await getDashboardProductById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    if (product.productType !== 'subscription') {
      return NextResponse.json(
        { message: 'Use create-payment-intent endpoint for one-time products' },
        { status: 400 }
      );
    }

    // Determine which price to use
    let priceId: string;
    let priceInCents: number;

    if (billingInterval === 'year' && product.stripeYearlyPriceId && product.yearlyPriceInCents) {
      priceId = product.stripeYearlyPriceId;
      priceInCents = product.yearlyPriceInCents;
    } else {
      if (!product.stripePriceId) {
        return NextResponse.json(
          { message: 'Product is not synced to Stripe. Please contact support.' },
          { status: 400 }
        );
      }
      priceId = product.stripePriceId;
      priceInCents = product.priceInCents;
    }

    // Create subscription
    const { subscription, clientSecret } = await createSubscription(
      priceId,
      customerEmail,
      {
        productId: product.id.toString(),
        productName: product.name,
        customerEmail,
        customerName: customerName || '',
        billingInterval,
      }
    );

    return NextResponse.json({
      clientSecret,
      subscriptionId: subscription.id,
      priceInCents,
      billingInterval,
      product: {
        id: product.id,
        name: product.name,
        monthlyPriceInCents: product.priceInCents,
        yearlyPriceInCents: product.yearlyPriceInCents,
      },
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
