import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getUserMmfcApiKeys,
  createMmfcApiKey,
  decryptApiKey,
} from '@/lib/db/queries-mmfc';

// Helper to mask API key for display (matches MMFC format)
function maskApiKey(apiKey: string): string {
  // Show first 12 characters (including int_) and mask the rest
  // Example: int_4P-xifr... (matches MMFC display)
  if (apiKey.length <= 15) return apiKey;
  const start = apiKey.substring(0, 11); // int_4P-xifr
  return `${start}...`;
}

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

    // Decrypt and mask API keys for display (matches MMFC format)
    const sanitizedKeys = keys.map((key) => {
      const decryptedKey = decryptApiKey(key.apiKey);
      const maskedKey = maskApiKey(decryptedKey);

      return {
        id: key.id,
        name: key.name,
        baseUrl: key.baseUrl,
        maskedApiKey: maskedKey, // Masked version for display (e.g., "int_4P-xifr...")
        autoSync: key.autoSync,
        syncFrequency: key.syncFrequency,
        lastSyncAt: key.lastSyncAt,
        lastSyncStatus: key.lastSyncStatus,
        lastSyncError: key.lastSyncError,
        isActive: key.isActive,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt,
      };
    });

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

    // Optional: Validate API key by attempting to fetch products or scheduling
    // Only validate if skipValidation is not set
    const skipValidation = body.skipValidation === true;

    if (!skipValidation) {
      const base = baseUrl || 'https://makemoneyfromcoding.com';
      const productsUrl = `${base}/api/v1/products?limit=1`;
      const schedulingUrl = `${base}/api/v1/scheduling/availability`;

      let validationPassed = false;
      let lastError = '';

      // Try products endpoint first
      try {
        const productsResponse = await fetch(productsUrl, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (productsResponse.ok) {
          validationPassed = true;
        } else {
          const errorText = await productsResponse.text();
          lastError = `Products endpoint: Status ${productsResponse.status}`;

          // If products fails, try scheduling endpoint
          try {
            const schedulingResponse = await fetch(schedulingUrl, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
              },
            });

            if (schedulingResponse.ok) {
              validationPassed = true;
            } else {
              const schedErrorText = await schedulingResponse.text();
              lastError += `. Scheduling endpoint: Status ${schedulingResponse.status}`;
            }
          } catch (schedError: any) {
            lastError += `. Scheduling endpoint error: ${schedError.message}`;
          }
        }
      } catch (fetchError: any) {
        console.error('Failed to connect to MMFC:', fetchError);
        return NextResponse.json(
          { error: `Unable to connect to MMFC: ${fetchError.message}. You can skip validation by enabling "Skip Validation" option.` },
          { status: 400 }
        );
      }

      if (!validationPassed) {
        console.error('MMFC API key validation failed:', lastError);
        return NextResponse.json(
          { error: `Invalid API key or insufficient permissions. ${lastError}. You can skip validation if you trust your API key.` },
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
