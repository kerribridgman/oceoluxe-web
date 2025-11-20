import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getAllUserMmfcProducts,
  toggleMmfcProductVisibility,
} from '@/lib/db/queries-mmfc';

/**
 * GET /api/mmfc-products
 * List all MMFC products for the authenticated user (including hidden ones for dashboard management)
 */
export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await getAllUserMmfcProducts(user.id);

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching MMFC products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/mmfc-products
 * Toggle product visibility
 */
export async function PATCH(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, isVisible } = body;

    if (typeof productId !== 'number' || typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const updated = await toggleMmfcProductVisibility(productId, user.id, isVisible);

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    console.error('Error updating product visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
