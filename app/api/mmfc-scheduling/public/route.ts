import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getEnabledSchedulingLinksForUser } from '@/lib/db/queries-mmfc-scheduling';

/**
 * GET /api/mmfc-scheduling/public
 * Get enabled scheduling links for public booking page
 * This endpoint requires authentication but returns only enabled links
 */
export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const links = await getEnabledSchedulingLinksForUser(user.id);

    return NextResponse.json({
      links,
    });
  } catch (error: any) {
    console.error('Error fetching enabled scheduling links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduling links' },
      { status: 500 }
    );
  }
}
