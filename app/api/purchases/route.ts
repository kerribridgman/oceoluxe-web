import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getAllPurchases } from '@/lib/db/queries-purchases';

// GET /api/purchases - Get all purchases (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admin or owner roles to access purchase data
    if (user.role !== 'owner' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const purchases = await getAllPurchases();

    return NextResponse.json({ purchases });
  } catch (error: any) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { message: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}
