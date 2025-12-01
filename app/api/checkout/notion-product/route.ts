import { NextRequest, NextResponse } from 'next/server';
import { getNotionProductBySlug } from '@/lib/db/queries-notion-products';
import { getNotionProductPriceConfig } from '@/lib/config/notion-product-prices';
import { createPaymentIntent } from '@/lib/payments/stripe-products';

// POST /api/checkout/notion-product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, customerEmail, customerName } = body;

    if (!slug) {
      return NextResponse.json({ message: 'Product slug is required' }, { status: 400 });
    }

    if (!customerEmail) {
      return NextResponse.json({ message: 'Customer email is required' }, { status: 400 });
    }

    // Get the Notion product
    const product = await getNotionProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Get the Stripe price config
    const priceConfig = getNotionProductPriceConfig(slug);
    if (!priceConfig) {
      return NextResponse.json(
        { message: 'This product does not have checkout enabled. Please contact support.' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      priceConfig.priceInCents,
      'usd',
      customerEmail,
      {
        source: 'notion_product',
        productSlug: slug,
        productTitle: product.title,
        customerEmail,
        customerName: customerName || '',
        deliveryType: priceConfig.deliveryType,
      }
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalCents: priceConfig.priceInCents,
      product: {
        slug: product.slug,
        title: product.title,
        priceInCents: priceConfig.priceInCents,
      },
    });
  } catch (error: any) {
    console.error('Error creating Notion product payment intent:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
