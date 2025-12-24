import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { clients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
    }

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      instagramHandle,
      packageType,
      status,
      startDate,
      endDate,
      sessionsTotal,
      sessionsCompleted,
      notes,
      source,
    } = body;

    const [client] = await db
      .update(clients)
      .set({
        firstName,
        lastName,
        email,
        phone,
        instagramHandle,
        packageType,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        sessionsTotal,
        sessionsCompleted,
        notes,
        source,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, clientId))
      .returning();

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(clients)
      .where(eq(clients.id, clientId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
