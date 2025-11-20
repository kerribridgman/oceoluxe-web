import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getAllServicesForUser,
  toggleServiceVisibility,
} from '@/lib/db/queries-mmfc-services';

/**
 * GET /api/mmfc-services
 * Get all MMFC services for the authenticated user
 */
export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const services = await getAllServicesForUser(user.id);

    return NextResponse.json({
      services,
    });
  } catch (error: any) {
    console.error('Error fetching MMFC services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/mmfc-services
 * Toggle service visibility status
 */
export async function PATCH(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, isVisible } = body;

    if (typeof serviceId !== 'number' || typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const updated = await toggleServiceVisibility(serviceId, user.id, isVisible);

    return NextResponse.json({
      success: true,
      service: updated,
    });
  } catch (error: any) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update service' },
      { status: 500 }
    );
  }
}
