import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';

// In a real implementation, you would store this in a database table
// For now, we'll use environment variables or a simple JSON file approach
// This is a placeholder implementation

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin/owner
  if (user.role !== 'owner' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // In production, fetch from database
  // For now, return example/placeholder data
  const settings = {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID || '',
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || '',
    plausibleApiKey: '', // Never return API keys to frontend
  };

  return NextResponse.json(settings);
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

    // TODO: In production, save to database
    // For now, this is a placeholder that would require adding these to .env file manually
    // or creating a database table to store analytics settings

    // Example database schema you'd want to create:
    // CREATE TABLE analytics_settings (
    //   id SERIAL PRIMARY KEY,
    //   team_id INTEGER REFERENCES teams(id),
    //   google_analytics_id VARCHAR(255),
    //   google_tag_manager_id VARCHAR(255),
    //   plausible_domain VARCHAR(255),
    //   plausible_api_key VARCHAR(255),
    //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    // );

    return NextResponse.json({
      message: 'Analytics settings saved successfully',
      note: 'To complete the integration, these values need to be added to your environment variables or stored in a database table.'
    });
  } catch (error) {
    console.error('Error saving analytics settings:', error);
    return NextResponse.json(
      { message: 'Failed to save analytics settings' },
      { status: 500 }
    );
  }
}
