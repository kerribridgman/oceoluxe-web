import { db } from './drizzle';
import { mcpApiKeys, users } from './schema';
import { eq, and, desc } from 'drizzle-orm';
import { createHash, randomBytes } from 'crypto';

/**
 * Generate a new MCP API key
 * Format: mcp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (40 chars after prefix)
 */
export function generateMcpApiKey(): { apiKey: string; keyHash: string; keyPrefix: string } {
  const randomPart = randomBytes(20).toString('hex'); // 40 chars
  const apiKey = `mcp_live_${randomPart}`;

  // Hash the full API key for storage
  const keyHash = createHash('sha256').update(apiKey).digest('hex');

  // Store first 8 chars of random part for identification
  const keyPrefix = `mcp_live_${randomPart.substring(0, 8)}`;

  return { apiKey, keyHash, keyPrefix };
}

/**
 * Verify an MCP API key and return the associated user
 */
export async function verifyMcpApiKey(apiKey: string) {
  if (!apiKey || !apiKey.startsWith('mcp_live_')) {
    return null;
  }

  const keyHash = createHash('sha256').update(apiKey).digest('hex');

  const result = await db
    .select({
      apiKey: mcpApiKeys,
      user: users,
    })
    .from(mcpApiKeys)
    .leftJoin(users, eq(mcpApiKeys.userId, users.id))
    .where(
      and(
        eq(mcpApiKeys.keyHash, keyHash),
        eq(mcpApiKeys.isActive, true)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const { apiKey: key, user } = result[0];

  // Check if key is expired
  if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
    return null;
  }

  // Update last used timestamp
  await db
    .update(mcpApiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(mcpApiKeys.id, key.id));

  return { user, apiKey: key };
}

/**
 * Create a new MCP API key
 */
export async function createMcpApiKey(
  userId: number,
  name: string,
  permissions?: any,
  expiresAt?: Date
) {
  const { apiKey, keyHash, keyPrefix } = generateMcpApiKey();

  const [newKey] = await db
    .insert(mcpApiKeys)
    .values({
      userId,
      name,
      keyHash,
      keyPrefix,
      permissions: permissions || { blog: ['read', 'write'] },
      expiresAt: expiresAt || null,
      isActive: true,
    })
    .returning();

  return { ...newKey, apiKey }; // Return the plain text key only once
}

/**
 * Get all API keys for a user
 */
export async function getUserMcpApiKeys(userId: number) {
  return await db
    .select()
    .from(mcpApiKeys)
    .where(eq(mcpApiKeys.userId, userId))
    .orderBy(desc(mcpApiKeys.createdAt));
}

/**
 * Get a specific API key by ID
 */
export async function getMcpApiKeyById(id: number, userId: number) {
  const [key] = await db
    .select()
    .from(mcpApiKeys)
    .where(
      and(
        eq(mcpApiKeys.id, id),
        eq(mcpApiKeys.userId, userId)
      )
    )
    .limit(1);

  return key || null;
}

/**
 * Update an API key
 */
export async function updateMcpApiKey(
  id: number,
  userId: number,
  data: {
    name?: string;
    permissions?: any;
    isActive?: boolean;
    expiresAt?: Date | null;
  }
) {
  const [updated] = await db
    .update(mcpApiKeys)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(mcpApiKeys.id, id),
        eq(mcpApiKeys.userId, userId)
      )
    )
    .returning();

  return updated || null;
}

/**
 * Delete (deactivate) an API key
 */
export async function deleteMcpApiKey(id: number, userId: number) {
  const [deleted] = await db
    .update(mcpApiKeys)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(mcpApiKeys.id, id),
        eq(mcpApiKeys.userId, userId)
      )
    )
    .returning();

  return deleted || null;
}

/**
 * Permanently delete an API key (use with caution)
 */
export async function permanentlyDeleteMcpApiKey(id: number, userId: number) {
  const [deleted] = await db
    .delete(mcpApiKeys)
    .where(
      and(
        eq(mcpApiKeys.id, id),
        eq(mcpApiKeys.userId, userId)
      )
    )
    .returning();

  return deleted || null;
}

/**
 * Check if user has permission for an operation
 */
export function hasPermission(
  apiKey: typeof mcpApiKeys.$inferSelect,
  resource: string,
  operation: 'read' | 'write'
): boolean {
  try {
    const permissions = apiKey.permissions as any;
    if (!permissions || !permissions[resource]) {
      return false;
    }

    const resourcePermissions = permissions[resource];
    if (Array.isArray(resourcePermissions)) {
      return resourcePermissions.includes(operation);
    }

    return false;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}
