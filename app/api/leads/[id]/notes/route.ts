import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { leadNotes, leads } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

// GET /api/leads/[id]/notes - Get notes for a lead
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

    return NextResponse.json({ notes });
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST /api/leads/[id]/notes - Add a note to a lead
export async function POST(
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

    // Verify lead exists
    const lead = await db.query.leads.findFirst({
      where: eq(leads.id, leadId),
    });

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ message: 'Note content is required' }, { status: 400 });
    }

    const [newNote] = await db.insert(leadNotes).values({
      leadId,
      authorId: user.id,
      content: content.trim(),
    }).returning();

    // Fetch the note with author info
    const noteWithAuthor = await db.query.leadNotes.findFirst({
      where: eq(leadNotes.id, newNote.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ note: noteWithAuthor });
  } catch (error: any) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to add note' },
      { status: 500 }
    );
  }
}
