import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getAllPurchases } from '@/lib/db/queries-purchases';

// GET /api/purchases - Get all purchases (admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const purchases = await getAllPurchases();

    return NextResponse.json({ purchases });
  } catch (error: any) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}
