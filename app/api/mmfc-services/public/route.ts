import { NextResponse } from 'next/server';

/**
 * GET /api/mmfc-services/public
 * DEPRECATED - This endpoint is no longer available
 */
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
