import { NextResponse } from 'next/server';
import { getPublicMmfcProducts } from '@/lib/db/queries-mmfc';

/**
 * GET /api/mmfc-products/public
 * Get all visible products (public endpoint - no auth required)
 * Used by the header to check if Products link should be shown
 */
export async function GET() {
  try {
    const products = await getPublicMmfcProducts();

    return NextResponse.json({
      products,
      count: products.length
    });
  } catch (error: any) {
    console.error('Error fetching public products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [], count: 0 },
      { status: 500 }
    );
  }
}
