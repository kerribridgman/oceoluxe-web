import { NextRequest } from 'next/server';
import { verifyMcpApiKey, hasPermission } from '@/lib/db/queries-mcp';
import { User, McpApiKey } from '@/lib/db/schema';

export interface McpAuthResult {
  user: User;
  apiKey: McpApiKey;
}

/**
 * Get and verify MCP API key from request headers
 * Supports both "Authorization: Bearer <key>" and "X-API-Key: <key>" formats
 */
export async function getUserFromMcpAuth(
  request: NextRequest
): Promise<User | null> {
  // Try Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization');
  let apiKey: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7);
  }

  // Fall back to X-API-Key header
  if (!apiKey) {
    apiKey = request.headers.get('x-api-key');
  }

  if (!apiKey) {
    return null;
  }

  const result = await verifyMcpApiKey(apiKey);
  if (!result || !result.user) {
    return null;
  }

  return result.user;
}

/**
 * Get MCP authentication result with both user and API key
 */
export async function getMcpAuth(
  request: NextRequest
): Promise<McpAuthResult | null> {
  // Try Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization');
  let apiKey: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7);
  }

  // Fall back to X-API-Key header
  if (!apiKey) {
    apiKey = request.headers.get('x-api-key');
  }

  if (!apiKey) {
    return null;
  }

  const result = await verifyMcpApiKey(apiKey);
  if (!result || !result.user || !result.apiKey) {
    return null;
  }

  return {
    user: result.user,
    apiKey: result.apiKey,
  };
}

/**
 * Verify that the API key has permission for a specific resource and operation
 */
export async function verifyMcpPermission(
  request: NextRequest,
  resource: string,
  operation: 'read' | 'write'
): Promise<{ authorized: boolean; user: User | null; apiKey: McpApiKey | null }> {
  const auth = await getMcpAuth(request);

  if (!auth) {
    return { authorized: false, user: null, apiKey: null };
  }

  const authorized = hasPermission(auth.apiKey, resource, operation);

  return {
    authorized,
    user: auth.user,
    apiKey: auth.apiKey,
  };
}
