import { NextRequest, NextResponse } from 'next/server';
import { getDashboardProductBySlug, getProductUpsells } from '@/lib/db/queries-dashboard-products';

// GET /api/products/public/[slug] - Get a published product by slug with upsells
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the product
    const product = await getDashboardProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Get upsells for the product
    const upsellData = await getProductUpsells(product.id);

    // Format upsells for the response
    const upsells = upsellData
      .filter((u) => u.upsellProduct.isPublished)
      .map((u) => ({
        id: u.upsellProduct.id,
        name: u.upsellProduct.name,
        shortDescription: u.upsellProduct.shortDescription,
        priceInCents: u.upsellProduct.priceInCents,
        discountPercent: u.discountPercent,
      }));

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        coverImageUrl: product.coverImageUrl,
        productType: product.productType,
        priceInCents: product.priceInCents,
        yearlyPriceInCents: product.yearlyPriceInCents,
        currency: product.currency,
        deliveryType: product.deliveryType,
        // SEO fields
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        ogTitle: product.ogTitle,
        ogDescription: product.ogDescription,
        ogImageUrl: product.ogImageUrl,
      },
      upsells,
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
