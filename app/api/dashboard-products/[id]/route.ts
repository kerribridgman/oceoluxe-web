import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getDashboardProductById,
  updateDashboardProduct,
  deleteDashboardProduct,
} from '@/lib/db/queries-dashboard-products';

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET /api/dashboard-products/[id] - Get a product by ID
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

    const product = await getDashboardProductById(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/dashboard-products/[id] - Update a product
export async function PUT(
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

    // Check if product exists
    const existingProduct = await getDashboardProductById(id);
    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Handle slug update
    let slug = body.slug || existingProduct.slug;
    if (body.name && body.name !== existingProduct.name && !body.slug) {
      slug = generateSlug(body.name);
    }

    // Prepare update data
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined || (body.name && body.name !== existingProduct.name)) {
      updateData.slug = slug;
    }
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    if (body.coverImageUrl !== undefined) updateData.coverImageUrl = body.coverImageUrl;
    if (body.productType !== undefined) updateData.productType = body.productType;
    if (body.priceInCents !== undefined) updateData.priceInCents = body.priceInCents;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.yearlyPriceInCents !== undefined) updateData.yearlyPriceInCents = body.yearlyPriceInCents;
    if (body.deliveryType !== undefined) updateData.deliveryType = body.deliveryType;
    if (body.downloadUrl !== undefined) updateData.downloadUrl = body.downloadUrl;
    if (body.accessInstructions !== undefined) updateData.accessInstructions = body.accessInstructions;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder;
    // SEO fields
    if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) updateData.seoDescription = body.seoDescription;
    if (body.ogTitle !== undefined) updateData.ogTitle = body.ogTitle;
    if (body.ogDescription !== undefined) updateData.ogDescription = body.ogDescription;
    if (body.ogImageUrl !== undefined) updateData.ogImageUrl = body.ogImageUrl;

    const product = await updateDashboardProduct(id, updateData);

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error updating product:', error);

    // Handle unique constraint violation
    if (error.code === '23505' && error.message?.includes('slug')) {
      return NextResponse.json(
        { message: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard-products/[id] - Delete a product
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

    // Check if product exists
    const existingProduct = await getDashboardProductById(id);
    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    await deleteDashboardProduct(id);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
