import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getDashboardProductById,
  getProductUpsells,
  addProductUpsell,
  removeProductUpsell,
  getAvailableUpsellProducts,
} from '@/lib/db/queries-dashboard-products';

// GET /api/dashboard-products/[id]/upsells - Get upsells for a product
export async function GET(
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

    // Check if product exists
    const product = await getDashboardProductById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const upsells = await getProductUpsells(id);
    const availableProducts = await getAvailableUpsellProducts(id);

    return NextResponse.json({ upsells, availableProducts });
  } catch (error: any) {
    console.error('Error fetching upsells:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch upsells' },
      { status: 500 }
    );
  }
}

// POST /api/dashboard-products/[id]/upsells - Add an upsell to a product
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

    const body = await request.json();

    if (!body.upsellProductId) {
      return NextResponse.json({ message: 'Upsell product ID is required' }, { status: 400 });
    }

    // Check if product exists
    const product = await getDashboardProductById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Check if upsell product exists
    const upsellProduct = await getDashboardProductById(body.upsellProductId);
    if (!upsellProduct) {
      return NextResponse.json({ message: 'Upsell product not found' }, { status: 404 });
    }

    // Prevent self-upsell
    if (id === body.upsellProductId) {
      return NextResponse.json({ message: 'Cannot add product as its own upsell' }, { status: 400 });
    }

    const upsell = await addProductUpsell(
      id,
      body.upsellProductId,
      body.displayOrder,
      body.discountPercent
    );

    return NextResponse.json({ upsell }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding upsell:', error);

    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { message: 'This upsell already exists for this product' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Failed to add upsell' },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard-products/[id]/upsells - Remove an upsell from a product
export async function DELETE(
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

    const { searchParams } = new URL(request.url);
    const upsellProductIdParam = searchParams.get('upsellProductId');

    if (!upsellProductIdParam) {
      return NextResponse.json({ message: 'Upsell product ID is required' }, { status: 400 });
    }

    const upsellProductId = parseInt(upsellProductIdParam);
    if (isNaN(upsellProductId)) {
      return NextResponse.json({ message: 'Invalid upsell product ID' }, { status: 400 });
    }

    await removeProductUpsell(id, upsellProductId);

    return NextResponse.json({ message: 'Upsell removed successfully' });
  } catch (error: any) {
    console.error('Error removing upsell:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to remove upsell' },
      { status: 500 }
    );
  }
}
