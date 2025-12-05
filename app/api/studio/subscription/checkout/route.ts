import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// Map price IDs - these need to be updated with actual Stripe price IDs
const PRICE_MAP: Record<string, string> = {
  price_monthly: process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
  price_yearly: process.env.STRIPE_STUDIO_YEARLY_PRICE_ID || 'price_yearly_placeholder',
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await request.json();

    if (!priceId || !PRICE_MAP[priceId]) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }

    const actualPriceId = PRICE_MAP[priceId];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id.toString(),
      mode: 'subscription',
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/studio?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/studio/subscribe?canceled=true`,
      metadata: {
        userId: user.id.toString(),
        subscriptionType: 'studio_systems',
      },
      subscription_data: {
        metadata: {
          userId: user.id.toString(),
          subscriptionType: 'studio_systems',
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
