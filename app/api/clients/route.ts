import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { clients } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { getOrCreateEmailListEntry } from '@/lib/email/unsubscribe';

export async function GET() {
  try {
    const allClients = await db
      .select()
      .from(clients)
      .orderBy(desc(clients.createdAt));

    return NextResponse.json(allClients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const [client] = await db
      .insert(clients)
      .values({
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone: phone || null,
        instagramHandle: instagramHandle || null,
        packageType: packageType || 'monthly',
        status: status || 'active',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        sessionsTotal: sessionsTotal || 0,
        sessionsCompleted: sessionsCompleted || 0,
        notes: notes || null,
        source: source || null,
      })
      .returning();

    // Sync to email list for marketing/unsubscribe tracking
    await getOrCreateEmailListEntry(email.toLowerCase(), 'client', client.id, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      clientPackage: packageType || undefined,
      instagramHandle: instagramHandle || undefined,
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
