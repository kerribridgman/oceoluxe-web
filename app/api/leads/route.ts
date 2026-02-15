import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { leads, leadStatusEnum, users } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { getOrCreateEmailListEntry } from '@/lib/email/unsubscribe';

// GET /api/leads - Get all leads (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admin or owner roles to access lead data
    if (user.role !== 'owner' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allLeads = await db
      .select({
        id: leads.id,
        email: leads.email,
        name: leads.name,
        instagramHandle: leads.instagramHandle,
        productSlug: leads.productSlug,
        productName: leads.productName,
        source: leads.source,
        status: leads.status,
        addedBy: leads.addedBy,
        addedByName: users.name,
        deliveryEmailSentAt: leads.deliveryEmailSentAt,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .leftJoin(users, eq(leads.addedBy, users.id))
      .orderBy(desc(leads.createdAt));

    return NextResponse.json({ leads: allLeads });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { message: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/leads - Manually add a lead
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, instagramHandle, source, status } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Validate status if provided
    const leadStatus = status && leadStatusEnum.includes(status) ? status : 'lead';

    // Clean Instagram handle - remove @ if present
    const cleanedInstagram = instagramHandle?.trim()?.replace(/^@/, '') || null;

    const [newLead] = await db.insert(leads).values({
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      instagramHandle: cleanedInstagram,
      productSlug: 'manual-entry',
      productName: source || 'Manual Entry',
      source: source || 'manual',
      status: leadStatus,
      addedBy: user.id,
    }).returning();

    // Sync to email list for marketing/unsubscribe tracking
    await getOrCreateEmailListEntry(email.toLowerCase().trim(), 'lead', newLead.id, {
      firstName: name?.trim() || undefined,
      instagramHandle: cleanedInstagram || undefined,
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error: any) {
    console.error('Error adding lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to add lead' },
      { status: 500 }
    );
  }
}
