import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { airtableConfigs } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

// GET /api/airtable - Get all Airtable configurations
export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const configs = await db
      .select()
      .from(airtableConfigs)
      .where(eq(airtableConfigs.userId, user.id))
      .orderBy(desc(airtableConfigs.createdAt));

    // Mask API keys in response
    const maskedConfigs = configs.map(config => ({
      ...config,
      apiKey: config.apiKey ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-4)}` : '',
    }));

    return NextResponse.json({ configs: maskedConfigs });
  } catch (error: any) {
    console.error('Error fetching Airtable configs:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch configurations' },
      { status: 500 }
    );
  }
}

// POST /api/airtable - Create a new Airtable configuration
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, apiKey, baseId, tableId, fieldMappings, syncDirection } = body;

    if (!apiKey || !baseId || !tableId) {
      return NextResponse.json(
        { message: 'API Key, Base ID, and Table ID are required' },
        { status: 400 }
      );
    }

    const [newConfig] = await db.insert(airtableConfigs).values({
      userId: user.id,
      name: name || 'Lead Sync',
      apiKey,
      baseId,
      tableId,
      fieldMappings: fieldMappings || {
        Email: 'email',
        Name: 'name',
        Instagram: 'instagram',
        Status: 'status',
        Source: 'source',
      },
      syncDirection: syncDirection || 'import',
    }).returning();

    return NextResponse.json({
      success: true,
      config: {
        ...newConfig,
        apiKey: `${newConfig.apiKey.slice(0, 8)}...${newConfig.apiKey.slice(-4)}`,
      },
    });
  } catch (error: any) {
    console.error('Error creating Airtable config:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create configuration' },
      { status: 500 }
    );
  }
}
