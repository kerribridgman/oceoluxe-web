import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { leads, leadNotes, leadStatusEnum, applications } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

// GET /api/leads/[id] - Get a single lead with notes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json({ message: 'Invalid lead ID' }, { status: 400 });
    }

    const lead = await db.query.leads.findFirst({
      where: eq(leads.id, leadId),
    });

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    // Get notes for this lead
    const notes = await db.query.leadNotes.findMany({
      where: eq(leadNotes.leadId, leadId),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: (leadNotes, { desc }) => [desc(leadNotes.createdAt)],
    });

    // If this is an inquiry lead, fetch the associated application
    let application = null;
    if (lead.productSlug === 'inquiry') {
      const [appData] = await db
        .select()
        .from(applications)
        .where(eq(applications.email, lead.email))
        .orderBy(desc(applications.createdAt))
        .limit(1);
      application = appData || null;
    }

    return NextResponse.json({ lead, notes, application });
  } catch (error: any) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PATCH /api/leads/[id] - Update lead status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json({ message: 'Invalid lead ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !leadStatusEnum.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be one of: lead, membership, one_on_one, lost' },
        { status: 400 }
      );
    }

    const result = await db
      .update(leads)
      .set({ status })
      .where(eq(leads.id, leadId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: result[0] });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete a lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json({ message: 'Invalid lead ID' }, { status: 400 });
    }

    // Delete associated notes first
    await db.delete(leadNotes).where(eq(leadNotes.leadId, leadId));

    // Delete the lead
    const result = await db.delete(leads).where(eq(leads.id, leadId)).returning();

    if (result.length === 0) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead deleted' });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
