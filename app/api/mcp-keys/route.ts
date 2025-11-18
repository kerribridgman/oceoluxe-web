import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getUserMcpApiKeys,
  createMcpApiKey,
} from '@/lib/db/queries-mcp';

/**
 * GET /api/mcp-keys - List all API keys for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await getUserMcpApiKeys(user.id);

    // Don't send sensitive data to the client
    const safeKeys = apiKeys.map((key) => ({
      id: key.id,
      name: key.name,
      keyPrefix: key.keyPrefix,
      permissions: key.permissions,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      isActive: key.isActive,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    }));

    return NextResponse.json({ apiKeys: safeKeys });
  } catch (error: any) {
    console.error('Error fetching MCP API keys:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mcp-keys - Create a new API key
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, permissions, expiresAt } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    const expiresAtDate = expiresAt ? new Date(expiresAt) : undefined;

    const result = await createMcpApiKey(
      user.id,
      name.trim(),
      permissions,
      expiresAtDate
    );

    return NextResponse.json(
      {
        message: 'API key created successfully',
        apiKey: result.apiKey, // Only shown once!
        key: {
          id: result.id,
          name: result.name,
          keyPrefix: result.keyPrefix,
          permissions: result.permissions,
          expiresAt: result.expiresAt,
          isActive: result.isActive,
          createdAt: result.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating MCP API key:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create API key' },
      { status: 500 }
    );
  }
}
