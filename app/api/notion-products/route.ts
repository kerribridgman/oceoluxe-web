import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { notionProducts } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const products = await db
      .select()
      .from(notionProducts)
      .orderBy(desc(notionProducts.updatedAt));

    return NextResponse.json({ products });

  } catch (error) {
    console.error('Error fetching Notion products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, isPublished, isFeatured } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    const updateData: any = { updatedAt: new Date() };
    if (typeof isPublished === 'boolean') {
      updateData.isPublished = isPublished;
    }
    if (typeof isFeatured === 'boolean') {
      updateData.isFeatured = isFeatured;
    }

    await db
      .update(notionProducts)
      .set(updateData)
      .where(eq(notionProducts.id, productId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating Notion product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
