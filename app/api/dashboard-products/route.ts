import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getAllDashboardProducts,
  createDashboardProduct,
} from '@/lib/db/queries-dashboard-products';

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET /api/dashboard-products - Get all dashboard products (admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const products = await getAllDashboardProducts();

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching dashboard products:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/dashboard-products - Create a new dashboard product
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    if (body.priceInCents === undefined || body.priceInCents < 0) {
      return NextResponse.json({ message: 'Price is required' }, { status: 400 });
    }

    // Generate slug from name if not provided
    const slug = body.slug || generateSlug(body.name);

    // Prepare product data
    const productData = {
      name: body.name,
      slug,
      description: body.description || null,
      shortDescription: body.shortDescription || null,
      coverImageUrl: body.coverImageUrl || null,
      productType: body.productType || 'one_time',
      priceInCents: body.priceInCents,
      currency: body.currency || 'usd',
      yearlyPriceInCents: body.yearlyPriceInCents || null,
      deliveryType: body.deliveryType || 'download',
      downloadUrl: body.downloadUrl || null,
      accessInstructions: body.accessInstructions || null,
      isPublished: body.isPublished || false,
      isFeatured: body.isFeatured || false,
      displayOrder: body.displayOrder || 0,
      createdBy: user.id,
    };

    const product = await createDashboardProduct(productData);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating dashboard product:', error);

    // Handle unique constraint violation
    if (error.code === '23505' && error.message?.includes('slug')) {
      return NextResponse.json(
        { message: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
