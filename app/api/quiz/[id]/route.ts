import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { quizLeads, leadNotes, leadStatusEnum } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

// GET /api/quiz/[id] - Get a single quiz lead with notes
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

    const lead = await db.query.quizLeads.findFirst({
      where: eq(quizLeads.id, leadId),
    });

    if (!lead) {
      return NextResponse.json({ message: 'Quiz lead not found' }, { status: 404 });
    }

    // Get notes for this quiz lead
    const notes = await db.query.leadNotes.findMany({
      where: eq(leadNotes.quizLeadId, leadId),
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

    return NextResponse.json({ lead, notes });
  } catch (error: any) {
    console.error('Error fetching quiz lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch quiz lead' },
      { status: 500 }
    );
  }
}

// PATCH /api/quiz/[id] - Update quiz lead status
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

    // Also update convertedToMember if status is membership
    const updateData: { status: string; convertedToMember?: boolean } = { status };
    if (status === 'membership') {
      updateData.convertedToMember = true;
    }

    const result = await db
      .update(quizLeads)
      .set(updateData)
      .where(eq(quizLeads.id, leadId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ message: 'Quiz lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: result[0] });
  } catch (error: any) {
    console.error('Error updating quiz lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update quiz lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/quiz/[id] - Delete a quiz lead
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
    await db.delete(leadNotes).where(eq(leadNotes.quizLeadId, leadId));

    // Delete the quiz lead
    const result = await db.delete(quizLeads).where(eq(quizLeads.id, leadId)).returning();

    if (result.length === 0) {
      return NextResponse.json({ message: 'Quiz lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Quiz lead deleted' });
  } catch (error: any) {
    console.error('Error deleting quiz lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete quiz lead' },
      { status: 500 }
    );
  }
}
