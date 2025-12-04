import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { syncNotionResources } from '@/lib/notion-resources-sync';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin/owner
    if (user.role !== 'owner' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if NOTION_RESOURCES_DB_ID is configured
    if (!process.env.NOTION_RESOURCES_DB_ID) {
      return NextResponse.json(
        { error: 'NOTION_RESOURCES_DB_ID not configured. Add this to your environment variables.' },
        { status: 400 }
      );
    }

    const result = await syncNotionResources(user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error syncing resources from Notion:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync resources' },
      { status: 500 }
    );
  }
}
