import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

/**
 * POST /api/admin/add-constraint
 * Temporary endpoint to add the unique constraint
 */
export async function POST(request: NextRequest) {
  try {
    // Try to add the constraint
    await db.execute(sql`
      ALTER TABLE mmfc_scheduling_links
      ADD CONSTRAINT mmfc_scheduling_links_api_key_id_external_id_key
      UNIQUE (api_key_id, external_id);
    `);

    return NextResponse.json({
      success: true,
      message: 'Constraint added successfully',
    });
  } catch (error: any) {
    console.error('Error adding constraint:', error);

    // Check if constraint already exists
    if (error.message?.includes('already exists') || error.code === '42P07') {
      return NextResponse.json({
        success: true,
        message: 'Constraint already exists',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
