import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { members } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    if (isNaN(memberId)) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
    }

    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1);

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    if (isNaN(memberId)) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      instagramHandle,
      membershipTier,
      status,
      startDate,
      renewalDate,
      stripeCustomerId,
      stripeSubscriptionId,
      notes,
      source,
    } = body;

    const [updatedMember] = await db
      .update(members)
      .set({
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone: phone || null,
        instagramHandle: instagramHandle || null,
        membershipTier: membershipTier || 'monthly',
        status: status || 'active',
        startDate: startDate ? new Date(startDate) : null,
        renewalDate: renewalDate ? new Date(renewalDate) : null,
        stripeCustomerId: stripeCustomerId || null,
        stripeSubscriptionId: stripeSubscriptionId || null,
        notes: notes || null,
        source: source || null,
        updatedAt: new Date(),
      })
      .where(eq(members.id, memberId))
      .returning();

    if (!updatedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(updatedMember);
  } catch (error: any) {
    console.error('Error updating member:', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A member with this email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    if (isNaN(memberId)) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
    }

    const [deletedMember] = await db
      .delete(members)
      .where(eq(members.id, memberId))
      .returning({ id: members.id });

    if (!deletedMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
