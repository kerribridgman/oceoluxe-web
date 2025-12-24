import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { sendCampaign } from '@/lib/email/marketing-email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const campaignId = parseInt(id, 10);

    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }

    const result = await sendCampaign(campaignId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send campaign' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}
