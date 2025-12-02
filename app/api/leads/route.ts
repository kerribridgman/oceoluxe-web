import { NextRequest, NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { leads } from '@/lib/db/schema';

// GET /api/leads - Get all leads
export async function GET(request: NextRequest) {
  try {
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));

    return NextResponse.json({ leads: allLeads });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
