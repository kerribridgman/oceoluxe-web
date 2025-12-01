import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getDashboardProductById,
  updateProductStripeInfo,
} from '@/lib/db/queries-dashboard-products';
import { syncProductToStripe } from '@/lib/payments/stripe-products';

// POST /api/dashboard-products/[id]/stripe-sync - Sync product to Stripe
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Get the product
    const product = await getDashboardProductById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Sync to Stripe
    const stripeData = await syncProductToStripe(product);

    // Update product with Stripe info
    const updatedProduct = await updateProductStripeInfo(id, {
      stripeProductId: stripeData.stripeProductId,
      stripePriceId: stripeData.stripePriceId,
      stripeYearlyPriceId: stripeData.stripeYearlyPriceId || null,
    });

    return NextResponse.json({
      product: updatedProduct,
      message: 'Product synced to Stripe successfully',
    });
  } catch (error: any) {
    console.error('Error syncing product to Stripe:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to sync product to Stripe' },
      { status: 500 }
    );
  }
}
