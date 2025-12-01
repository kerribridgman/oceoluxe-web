import { NextRequest, NextResponse } from 'next/server';
import { getDashboardProductById, getProductUpsells } from '@/lib/db/queries-dashboard-products';
import { createPaymentIntent } from '@/lib/payments/stripe-products';

// POST /api/checkout/create-payment-intent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { productId, customerEmail, customerName, upsellIds = [] } = body;

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    if (!customerEmail) {
      return NextResponse.json({ message: 'Customer email is required' }, { status: 400 });
    }

    // Get the main product
    const product = await getDashboardProductById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    if (!product.stripePriceId) {
      return NextResponse.json(
        { message: 'Product is not synced to Stripe. Please contact support.' },
        { status: 400 }
      );
    }

    if (product.productType === 'subscription') {
      return NextResponse.json(
        { message: 'Use create-subscription endpoint for subscription products' },
        { status: 400 }
      );
    }

    // Calculate total including upsells
    let totalCents = product.priceInCents;
    const upsellProducts: Array<{ id: number; name: string; priceInCents: number }> = [];

    if (upsellIds.length > 0) {
      for (const upsellId of upsellIds) {
        const upsellProduct = await getDashboardProductById(upsellId);
        if (upsellProduct && upsellProduct.stripePriceId) {
          totalCents += upsellProduct.priceInCents;
          upsellProducts.push({
            id: upsellProduct.id,
            name: upsellProduct.name,
            priceInCents: upsellProduct.priceInCents,
          });
        }
      }
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      totalCents,
      product.currency,
      customerEmail,
      {
        productId: product.id.toString(),
        productName: product.name,
        customerEmail,
        customerName: customerName || '',
        upsellIds: upsellIds.join(','),
      }
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalCents,
      product: {
        id: product.id,
        name: product.name,
        priceInCents: product.priceInCents,
      },
      upsells: upsellProducts,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
