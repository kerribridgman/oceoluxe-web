import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { airtableConfigs } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

// POST /api/airtable/[id]/test - Test Airtable connection
export async function POST(
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

    // Get the configuration
    const config = await db.query.airtableConfigs.findFirst({
      where: and(
        eq(airtableConfigs.id, configId),
        eq(airtableConfigs.userId, user.id)
      ),
    });

    if (!config) {
      return NextResponse.json({ message: 'Configuration not found' }, { status: 404 });
    }

    // Test connection by fetching first record
    const url = new URL(`https://api.airtable.com/v0/${config.baseId}/${config.tableId}`);
    url.searchParams.set('maxRecords', '1');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({
        success: false,
        message: error.error?.message || 'Failed to connect to Airtable',
        details: error.error,
      }, { status: 400 });
    }

    const data = await response.json();
    const sampleRecord = data.records[0];

    // Get available fields from the sample record
    const availableFields = sampleRecord ? Object.keys(sampleRecord.fields) : [];

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      recordCount: data.records.length,
      availableFields,
      sampleRecord: sampleRecord ? {
        id: sampleRecord.id,
        fields: sampleRecord.fields,
      } : null,
    });
  } catch (error: any) {
    console.error('Error testing Airtable connection:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to test connection' },
      { status: 500 }
    );
  }
}
