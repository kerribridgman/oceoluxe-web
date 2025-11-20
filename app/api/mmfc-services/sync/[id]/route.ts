import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { syncMmfcServices } from '@/lib/services/mmfc-sync';

/**
 * POST /api/mmfc-services/sync/[id]
 * Manually trigger a services sync for a specific API key
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const apiKeyId = parseInt(id);

    if (isNaN(apiKeyId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const result = await syncMmfcServices(apiKeyId, user.id);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      servicesCount: result.servicesCount,
    });
  } catch (error: any) {
    console.error('Error syncing services:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync services' },
      { status: 500 }
    );
  }
}
