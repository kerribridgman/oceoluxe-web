import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { syncMmfcScheduling } from '@/lib/services/mmfc-sync';

/**
 * POST /api/mmfc-scheduling/sync/[id]
 * Manually trigger a scheduling sync for a specific API key
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

    const result = await syncMmfcScheduling(apiKeyId, user.id);

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
      linksCount: result.linksCount,
    });
  } catch (error: any) {
    console.error('Error syncing scheduling:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync scheduling' },
      { status: 500 }
    );
  }
}
