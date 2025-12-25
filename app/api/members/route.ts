import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

type DbResult = { rows: Record<string, unknown>[] };

export async function GET() {
  try {
    // Check if members table exists, if not create it
    const checkResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'members'
      );
    `) as unknown as DbResult;

    const tableExists = checkResult.rows[0]?.exists;

    if (!tableExists) {
      // Create the members table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS members (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(50),
          instagram_handle VARCHAR(255),
          membership_tier VARCHAR(50) NOT NULL DEFAULT 'monthly',
          status VARCHAR(20) NOT NULL DEFAULT 'active',
          start_date TIMESTAMP,
          renewal_date TIMESTAMP,
          stripe_customer_id VARCHAR(255),
          stripe_subscription_id VARCHAR(255),
          notes TEXT,
          source VARCHAR(255),
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
    }

    const members = await db.execute(sql`
      SELECT * FROM members ORDER BY created_at DESC
    `) as unknown as DbResult;

    return NextResponse.json(members.rows);
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

    const result = await db.execute(sql`
      INSERT INTO members (
        first_name, last_name, email, phone, instagram_handle,
        membership_tier, status, start_date, renewal_date,
        stripe_customer_id, stripe_subscription_id, notes, source
      ) VALUES (
        ${firstName || null}, ${lastName || null}, ${email}, ${phone || null}, ${instagramHandle || null},
        ${membershipTier || 'monthly'}, ${status || 'active'}, ${startDate || null}, ${renewalDate || null},
        ${stripeCustomerId || null}, ${stripeSubscriptionId || null}, ${notes || null}, ${source || null}
      )
      RETURNING *
    `) as unknown as DbResult;

    return NextResponse.json(result.rows[0], { status: 201 });
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
