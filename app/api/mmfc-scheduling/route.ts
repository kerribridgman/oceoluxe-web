import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getAllSchedulingLinksForUser,
  toggleSchedulingLinkStatus,
} from '@/lib/db/queries-mmfc-scheduling';

/**
 * GET /api/mmfc-scheduling
 * Get all scheduling links for the authenticated user
 */
export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const links = await getAllSchedulingLinksForUser(user.id);

    return NextResponse.json({
      links,
    });
  } catch (error: any) {
    console.error('Error fetching scheduling links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduling links' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/mmfc-scheduling
 * Toggle scheduling link enabled/disabled status
 */
export async function PATCH(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { linkId, isEnabled } = body;

    if (typeof linkId !== 'number' || typeof isEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const updated = await toggleSchedulingLinkStatus(linkId, user.id, isEnabled);

    return NextResponse.json({
      success: true,
      link: updated,
    });
  } catch (error: any) {
    console.error('Error updating scheduling link:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update scheduling link' },
      { status: 500 }
    );
  }
}
