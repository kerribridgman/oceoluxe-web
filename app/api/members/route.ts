import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { members } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const membersList = await db
      .select()
      .from(members)
      .orderBy(desc(members.createdAt));

    return NextResponse.json(membersList);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const [newMember] = await db
      .insert(members)
      .values({
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
      })
      .returning();

    return NextResponse.json(newMember, { status: 201 });
  } catch (error: any) {
    console.error('Error creating member:', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A member with this email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
