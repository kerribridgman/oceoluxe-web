import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { leads } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendEmail } from '@/lib/email/sendgrid';

const ADMIN_EMAIL = 'kerrib@oceoluxe.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists for studio_waitlist
    const existingLead = await db.query.leads.findFirst({
      where: and(
        eq(leads.email, email.toLowerCase()),
        eq(leads.source, 'studio_waitlist')
      ),
    });

    if (existingLead) {
      return NextResponse.json(
        { error: 'You are already on the waitlist!' },
        { status: 400 }
      );
    }

    // Insert new lead
    const [newLead] = await db
      .insert(leads)
      .values({
        email: email.toLowerCase(),
        name: name || null,
        productSlug: 'studio-systems',
        productName: 'Studio Systems Waitlist',
        source: 'studio_waitlist',
      })
      .returning();

    // Send admin notification email
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: '🎉 New Studio Systems Waitlist Signup!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B3937;">New Waitlist Signup</h2>
          <p>Someone just joined the Studio Systems waitlist!</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Name:</strong> ${name || 'Not provided'}</p>
            <p style="margin: 10px 0 0;"><strong>Email:</strong> ${email.toLowerCase()}</p>
            <p style="margin: 10px 0 0;"><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            View all waitlist signups in your <a href="https://www.oceoluxe.com/dashboard/leads">admin dashboard</a>.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Successfully joined the waitlist!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all studio_waitlist leads (admin endpoint)
    const waitlistLeads = await db.query.leads.findMany({
      where: eq(leads.source, 'studio_waitlist'),
      orderBy: (leads, { desc }) => [desc(leads.createdAt)],
    });

    return NextResponse.json({ leads: waitlistLeads });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}
