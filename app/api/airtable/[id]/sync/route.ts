import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { airtableConfigs, leads, leadStatusEnum } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// POST /api/airtable/[id]/sync - Sync leads from Airtable
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

    if (!config.isActive) {
      return NextResponse.json({ message: 'Configuration is disabled' }, { status: 400 });
    }

    // Fetch records from Airtable
    const fieldMappings = config.fieldMappings as Record<string, string>;
    let allRecords: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const url = new URL(`https://api.airtable.com/v0/${config.baseId}/${config.tableId}`);
      if (offset) {
        url.searchParams.set('offset', offset);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Airtable API error:', error);

        // Update config with error status
        await db.update(airtableConfigs).set({
          lastSyncAt: new Date(),
          lastSyncStatus: 'error',
          lastSyncError: error.error?.message || 'Failed to fetch from Airtable',
          updatedAt: new Date(),
        }).where(eq(airtableConfigs.id, configId));

        return NextResponse.json(
          { message: error.error?.message || 'Failed to fetch from Airtable' },
          { status: response.status }
        );
      }

      const data: AirtableResponse = await response.json();
      allRecords = [...allRecords, ...data.records];
      offset = data.offset;
    } while (offset);

    // Map and import records
    let importedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const record of allRecords) {
      try {
        const fields = record.fields;

        // Get email from mapped field
        const emailField = Object.keys(fieldMappings).find(k => fieldMappings[k] === 'email');
        const email = emailField ? fields[emailField] : null;

        if (!email || typeof email !== 'string') {
          skippedCount++;
          continue;
        }

        // Get other mapped fields
        const nameField = Object.keys(fieldMappings).find(k => fieldMappings[k] === 'name');
        const instagramField = Object.keys(fieldMappings).find(k => fieldMappings[k] === 'instagram');
        const statusField = Object.keys(fieldMappings).find(k => fieldMappings[k] === 'status');
        const sourceField = Object.keys(fieldMappings).find(k => fieldMappings[k] === 'source');

        const name = nameField ? fields[nameField] : null;
        const instagramRaw = instagramField ? fields[instagramField] : null;
        // Clean Instagram handle - remove @ if present
        const instagramHandle = instagramRaw?.trim()?.replace(/^@/, '') || null;
        let status = statusField ? fields[statusField]?.toLowerCase() : 'lead';
        const source = sourceField ? fields[sourceField] : 'Airtable Import';

        // Validate status
        if (!leadStatusEnum.includes(status as any)) {
          // Map common Airtable status values
          const statusMap: Record<string, string> = {
            'new': 'lead',
            'new lead': 'lead',
            'prospect': 'lead',
            'member': 'membership',
            'subscriber': 'membership',
            'client': 'one_on_one',
            'lost': 'lost',
            'cold': 'lost',
            'unsubscribed': 'lost',
          };
          status = statusMap[status?.toLowerCase()] || 'lead';
        }

        // Check if lead already exists
        const existingLead = await db.query.leads.findFirst({
          where: eq(leads.email, email.toLowerCase().trim()),
        });

        if (existingLead) {
          skippedCount++;
          continue;
        }

        // Insert new lead
        await db.insert(leads).values({
          email: email.toLowerCase().trim(),
          name: name || null,
          instagramHandle: instagramHandle,
          productSlug: 'airtable-import',
          productName: source || 'Airtable Import',
          source: 'airtable',
          status: status as any,
          addedBy: user.id,
        });

        importedCount++;
      } catch (recordError: any) {
        errors.push(`Record ${record.id}: ${recordError.message}`);
      }
    }

    // Update config with sync status
    await db.update(airtableConfigs).set({
      lastSyncAt: new Date(),
      lastSyncStatus: errors.length > 0 ? 'partial' : 'success',
      lastSyncError: errors.length > 0 ? errors.slice(0, 5).join('; ') : null,
      lastSyncCount: importedCount,
      updatedAt: new Date(),
    }).where(eq(airtableConfigs.id, configId));

    return NextResponse.json({
      success: true,
      imported: importedCount,
      skipped: skippedCount,
      total: allRecords.length,
      errors: errors.slice(0, 5),
    });
  } catch (error: any) {
    console.error('Error syncing from Airtable:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to sync from Airtable' },
      { status: 500 }
    );
  }
}
