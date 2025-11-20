import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getUserMmfcApiKeys,
  createMmfcApiKey,
} from '@/lib/db/queries-mmfc';

/**
 * GET /api/mmfc-keys
 * List all MMFC API keys for the authenticated user
 */
export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const keys = await getUserMmfcApiKeys(user.id);

    // Don't return the encrypted API key to the client
    const sanitizedKeys = keys.map((key) => ({
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
    }));

    return NextResponse.json({ keys: sanitizedKeys });
  } catch (error: any) {
    console.error('Error fetching MMFC keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mmfc-keys
 * Create a new MMFC API key
 */
export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, apiKey, baseUrl, autoSync, syncFrequency } = body;

    if (!name || !apiKey) {
      return NextResponse.json(
        { error: 'Name and API key are required' },
        { status: 400 }
      );
    }

    // Validate API key format
    if (!apiKey.startsWith('int_')) {
      return NextResponse.json(
        { error: 'Invalid API key format. Must start with "int_"' },
        { status: 400 }
      );
    }

    // Optional: Validate API key by attempting to fetch products
    // Only validate if skipValidation is not set
    const skipValidation = body.skipValidation === true;

    if (!skipValidation) {
      const testUrl = `${baseUrl || 'https://makemoneyfromcoding.com'}/api/v1/products?limit=1`;

      let testResponse;
      try {
        testResponse = await fetch(testUrl, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
      } catch (fetchError: any) {
        console.error('Failed to connect to MMFC:', fetchError);
        return NextResponse.json(
          { error: `Unable to connect to MMFC: ${fetchError.message}. You can skip validation by enabling "Skip Validation" option.` },
          { status: 400 }
        );
      }

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error('MMFC API key validation failed:', {
          status: testResponse.status,
          statusText: testResponse.statusText,
          body: errorText,
          url: testUrl
        });

        let errorMessage = `Invalid API key (Status: ${testResponse.status}).`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage += ` ${errorJson.message}`;
          }
        } catch {}

        return NextResponse.json(
          { error: errorMessage + ' You can skip validation if you trust your API key.' },
          { status: 400 }
        );
      }
    }

    const newKey = await createMmfcApiKey(
      user.id,
      name,
      apiKey,
      baseUrl,
      autoSync,
      syncFrequency
    );

    return NextResponse.json({
      key: {
        id: newKey.id,
        name: newKey.name,
        baseUrl: newKey.baseUrl,
        autoSync: newKey.autoSync,
        syncFrequency: newKey.syncFrequency,
        isActive: newKey.isActive,
        createdAt: newKey.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating MMFC key:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create API key' },
      { status: 500 }
    );
  }
}
