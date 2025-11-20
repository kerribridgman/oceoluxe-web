import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getVisibleServicesForUser } from '@/lib/db/queries-mmfc-services';

/**
 * GET /api/mmfc-services/public
 * Get visible MMFC services for public display
 * This endpoint requires authentication but returns only visible services
 */
export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const services = await getVisibleServicesForUser(user.id);

    return NextResponse.json({
      services,
    });
  } catch (error: any) {
    console.error('Error fetching visible services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
