import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getMmfcApiKeyById,
  updateMmfcApiKey,
  deleteMmfcApiKey,
} from '@/lib/db/queries-mmfc';

/**
 * GET /api/mmfc-keys/[id]
 * Get a specific MMFC API key
 */
export async function GET(
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

    const key = await getMmfcApiKeyById(apiKeyId, user.id);

    if (!key) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Don't return the encrypted API key
    const sanitizedKey = {
      id: key.id,
      name: key.name,
      baseUrl: key.baseUrl,
      autoSync: key.autoSync,
      syncFrequency: key.syncFrequency,
      lastSyncAt: key.lastSyncAt,
      lastSyncStatus: key.lastSyncStatus,
      lastSyncError: key.lastSyncError,
      isActive: key.isActive,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    };

    return NextResponse.json({ key: sanitizedKey });
  } catch (error: any) {
    console.error('Error fetching MMFC key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/mmfc-keys/[id]
 * Update an MMFC API key
 */
export async function PUT(
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

    const body = await request.json();
    const { name, apiKey, baseUrl, autoSync, syncFrequency, isActive } = body;

    // If updating API key, validate it
    if (apiKey) {
      const testUrl = `${baseUrl || 'https://makemoneyfromcoding.com'}/api/v1/products?limit=1`;
      const testResponse = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!testResponse.ok) {
        return NextResponse.json(
          { error: 'Invalid API key or unable to connect to MMFC' },
          { status: 400 }
        );
      }
    }

    const updated = await updateMmfcApiKey(apiKeyId, user.id, {
      name,
      apiKey,
      baseUrl,
      autoSync,
      syncFrequency,
      isActive,
    });

    if (!updated) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({
      key: {
        id: updated.id,
        name: updated.name,
        baseUrl: updated.baseUrl,
        autoSync: updated.autoSync,
        syncFrequency: updated.syncFrequency,
        isActive: updated.isActive,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating MMFC key:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update API key' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mmfc-keys/[id]
 * Delete an MMFC API key and all associated products
 */
export async function DELETE(
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

    const deleted = await deleteMmfcApiKey(apiKeyId, user.id);

    if (!deleted) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting MMFC key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
