import { NextResponse } from 'next/server';

/**
 * GET /api/mmfc-products/public
 * DEPRECATED - This endpoint is no longer available
 */
export async function GET() {
  return NextResponse.json({ error: 'Not found', products: [], count: 0 }, { status: 404 });
}
