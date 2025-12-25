import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

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

    const result = await db.execute(sql`
      SELECT * FROM members WHERE id = ${memberId}
    `) as unknown as { rows: Record<string, unknown>[] };

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
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

    const result = await db.execute(sql`
      UPDATE members SET
        first_name = ${firstName || null},
        last_name = ${lastName || null},
        email = ${email},
        phone = ${phone || null},
        instagram_handle = ${instagramHandle || null},
        membership_tier = ${membershipTier || 'monthly'},
        status = ${status || 'active'},
        start_date = ${startDate || null},
        renewal_date = ${renewalDate || null},
        stripe_customer_id = ${stripeCustomerId || null},
        stripe_subscription_id = ${stripeSubscriptionId || null},
        notes = ${notes || null},
        source = ${source || null},
        updated_at = NOW()
      WHERE id = ${memberId}
      RETURNING *
    `) as unknown as { rows: Record<string, unknown>[] };

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
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

    const result = await db.execute(sql`
      DELETE FROM members WHERE id = ${memberId} RETURNING id
    `) as unknown as { rows: Record<string, unknown>[] };

    if (result.rows.length === 0) {
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
