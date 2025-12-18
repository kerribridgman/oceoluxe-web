import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { airtableConfigs } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

// GET /api/airtable/[id] - Get a specific Airtable configuration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const configId = parseInt(id, 10);

    if (isNaN(configId)) {
      return NextResponse.json({ message: 'Invalid config ID' }, { status: 400 });
    }

    const config = await db.query.airtableConfigs.findFirst({
      where: and(
        eq(airtableConfigs.id, configId),
        eq(airtableConfigs.userId, user.id)
      ),
    });

    if (!config) {
      return NextResponse.json({ message: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json({
      config: {
        ...config,
        apiKey: `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-4)}`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching Airtable config:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

// PATCH /api/airtable/[id] - Update an Airtable configuration
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const configId = parseInt(id, 10);

    if (isNaN(configId)) {
      return NextResponse.json({ message: 'Invalid config ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, apiKey, baseId, tableId, fieldMappings, syncDirection, autoSync, syncFrequency, isActive } = body;

    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (apiKey !== undefined) updateData.apiKey = apiKey;
    if (baseId !== undefined) updateData.baseId = baseId;
    if (tableId !== undefined) updateData.tableId = tableId;
    if (fieldMappings !== undefined) updateData.fieldMappings = fieldMappings;
    if (syncDirection !== undefined) updateData.syncDirection = syncDirection;
    if (autoSync !== undefined) updateData.autoSync = autoSync;
    if (syncFrequency !== undefined) updateData.syncFrequency = syncFrequency;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await db
      .update(airtableConfigs)
      .set(updateData)
      .where(and(
        eq(airtableConfigs.id, configId),
        eq(airtableConfigs.userId, user.id)
      ))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ message: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      config: {
        ...result[0],
        apiKey: `${result[0].apiKey.slice(0, 8)}...${result[0].apiKey.slice(-4)}`,
      },
    });
  } catch (error: any) {
    console.error('Error updating Airtable config:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

// DELETE /api/airtable/[id] - Delete an Airtable configuration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const configId = parseInt(id, 10);

    if (isNaN(configId)) {
      return NextResponse.json({ message: 'Invalid config ID' }, { status: 400 });
    }

    const result = await db
      .delete(airtableConfigs)
      .where(and(
        eq(airtableConfigs.id, configId),
        eq(airtableConfigs.userId, user.id)
      ))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ message: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Configuration deleted' });
  } catch (error: any) {
    console.error('Error deleting Airtable config:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete configuration' },
      { status: 500 }
    );
  }
}
