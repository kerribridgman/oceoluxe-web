import { NextRequest, NextResponse } from 'next/server';
import { getUser, getAnalyticsSettings } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin/owner
  if (user.role !== 'owner' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const settings = await getAnalyticsSettings(user.id);

    return NextResponse.json({
      googleAnalyticsId: settings?.googleAnalyticsId || '',
      googleTagManagerId: settings?.googleTagManagerId || '',
      plausibleDomain: settings?.plausibleDomain || '',
      plausibleApiKey: '', // Never return API keys to frontend
    });
  } catch (error) {
    console.error('Error fetching analytics settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin/owner
  if (user.role !== 'owner' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { googleAnalyticsId, googleTagManagerId, plausibleDomain, plausibleApiKey } = body;

    const { upsertAnalyticsSettings } = await import('@/lib/db/queries');

    await upsertAnalyticsSettings(user.id, {
      googleAnalyticsId: googleAnalyticsId || null,
      googleTagManagerId: googleTagManagerId || null,
      plausibleDomain: plausibleDomain || null,
      plausibleApiKey: plausibleApiKey || null,
    });

    return NextResponse.json({
      message: 'Analytics settings saved successfully',
    });
  } catch (error) {
    console.error('Error saving analytics settings:', error);
    return NextResponse.json(
      { message: 'Failed to save analytics settings' },
      { status: 500 }
    );
  }
}
