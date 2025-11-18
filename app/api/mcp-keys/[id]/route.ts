import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import {
  getMcpApiKeyById,
  updateMcpApiKey,
  deleteMcpApiKey,
} from '@/lib/db/queries-mcp';

/**
 * GET /api/mcp-keys/[id] - Get a specific API key
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const apiKey = await getMcpApiKeyById(id, user.id);

    if (!apiKey) {
      return NextResponse.json({ message: 'API key not found' }, { status: 404 });
    }

    // Don't send sensitive data
    const safeKey = {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      permissions: apiKey.permissions,
      lastUsedAt: apiKey.lastUsedAt,
      expiresAt: apiKey.expiresAt,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
    };

    return NextResponse.json({ apiKey: safeKey });
  } catch (error: any) {
    console.error('Error fetching MCP API key:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/mcp-keys/[id] - Update an API key
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, permissions, isActive, expiresAt } = body;

    const updateData: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { message: 'Name must be a non-empty string' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (permissions !== undefined) {
      updateData.permissions = permissions;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    const updated = await updateMcpApiKey(id, user.id, updateData);

    if (!updated) {
      return NextResponse.json({ message: 'API key not found' }, { status: 404 });
    }

    const safeKey = {
      id: updated.id,
      name: updated.name,
      keyPrefix: updated.keyPrefix,
      permissions: updated.permissions,
      lastUsedAt: updated.lastUsedAt,
      expiresAt: updated.expiresAt,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    return NextResponse.json({ apiKey: safeKey });
  } catch (error: any) {
    console.error('Error updating MCP API key:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update API key' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mcp-keys/[id] - Delete (deactivate) an API key
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const deleted = await deleteMcpApiKey(id, user.id);

    if (!deleted) {
      return NextResponse.json({ message: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'API key deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting MCP API key:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
