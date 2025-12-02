import { NextRequest, NextResponse } from 'next/server';
import { getDashboardProductById } from '@/lib/db/queries-dashboard-products';
import { getNotionProductById } from '@/lib/db/queries-notion-products';
import { getNotionProductPriceConfig, getFreeNotionProductConfig } from '@/lib/config/notion-product-prices';
import { createPaymentIntent } from '@/lib/payments/stripe-products';

interface CartItemInput {
  productId: number;
  productSource: 'dashboard' | 'notion';
  quantity: number;
}

interface ValidatedItem {
  id: number;
  name: string;
  priceInCents: number;
  quantity: number;
  slug: string;
  source: 'dashboard' | 'notion';
}

// POST /api/checkout/cart - Create payment intent for cart checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail, customerName } = body as {
      items: CartItemInput[];
      customerEmail: string;
      customerName?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart items are required' }, { status: 400 });
    }

    if (!customerEmail) {
      return NextResponse.json({ message: 'Customer email is required' }, { status: 400 });
    }

    // Validate and calculate total for all items
    let totalCents = 0;
    const validatedItems: ValidatedItem[] = [];

    for (const item of items) {
      if (item.productSource === 'dashboard') {
        // Handle dashboard products
        const product = await getDashboardProductById(item.productId);

        if (!product) {
          return NextResponse.json(
            { message: `Dashboard product not found: ${item.productId}` },
            { status: 404 }
          );
        }

        if (!product.stripePriceId) {
          return NextResponse.json(
            { message: `Product "${product.name}" is not synced to Stripe. Please contact support.` },
            { status: 400 }
          );
        }

        if (product.productType === 'subscription') {
          return NextResponse.json(
            { message: `Subscription product "${product.name}" must be purchased separately.` },
            { status: 400 }
          );
        }

        const itemTotal = product.priceInCents * item.quantity;
        totalCents += itemTotal;

        validatedItems.push({
          id: product.id,
          name: product.name,
          priceInCents: product.priceInCents,
          quantity: item.quantity,
          slug: product.slug,
          source: 'dashboard',
        });
      } else if (item.productSource === 'notion') {
        // Handle Notion products
        const product = await getNotionProductById(item.productId);

        if (!product) {
          return NextResponse.json(
            { message: `Notion product not found: ${item.productId}` },
            { status: 404 }
          );
        }

        // Check for paid product config first, then free product config
        const paidConfig = getNotionProductPriceConfig(product.slug);
        const freeConfig = getFreeNotionProductConfig(product.slug);

        if (!paidConfig && !freeConfig) {
          return NextResponse.json(
            { message: `Product "${product.title}" does not have checkout configured.` },
            { status: 400 }
          );
        }

        // Use paid config if available, otherwise use free config (price = 0)
        const priceInCents = paidConfig?.priceInCents ?? 0;
        const itemTotal = priceInCents * item.quantity;
        totalCents += itemTotal;

        validatedItems.push({
          id: product.id,
          name: product.title,
          priceInCents: priceInCents,
          quantity: item.quantity,
          slug: product.slug,
          source: 'notion',
        });
      }
    }

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { message: 'No valid products in cart.' },
        { status: 400 }
      );
    }

    // Create line items description for metadata
    const lineItemsDescription = validatedItems
      .map((item) => `${item.name} x${item.quantity}`)
      .join(', ');

    // Handle free orders (no payment needed)
    if (totalCents === 0) {
      return NextResponse.json({
        isFreeOrder: true,
        clientSecret: null,
        paymentIntentId: null,
        totalCents: 0,
        items: validatedItems,
      });
    }

    // Create payment intent for the total (paid orders only)
    const paymentIntent = await createPaymentIntent(
      totalCents,
      'usd',
      customerEmail,
      {
        type: 'cart_checkout',
        customerEmail,
        customerName: customerName || '',
        itemCount: validatedItems.length.toString(),
        productIds: validatedItems.map((i) => `${i.source}:${i.id}`).join(','),
        quantities: validatedItems.map((i) => i.quantity).join(','),
        lineItems: lineItemsDescription.substring(0, 500), // Stripe metadata limit
      }
    );

    return NextResponse.json({
      isFreeOrder: false,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalCents,
      items: validatedItems,
    });
  } catch (error: any) {
    console.error('Error creating cart checkout:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
