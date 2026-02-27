import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { leads } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendEmail } from '@/lib/email/sendgrid';
import { sendWaitlistConfirmationEmail } from '@/lib/email/purchase-emails';
import { getUser } from '@/lib/db/queries';
import { checkBotProtection, checkPublicRateLimit, isValidEmail, escapeHtml } from '@/lib/security/bot-protection';

const ADMIN_EMAIL = 'kerrib@oceoluxe.com';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 attempts per 15 minutes per IP
    const rateLimited = checkPublicRateLimit(request, 'waitlist');
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const { name, email, _honeypot, _t, _proof } = body;

    // Bot protection checks
    const botCheck = checkBotProtection({ _honeypot, _t, _proof, name });
    if (botCheck) return botCheck;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
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

    // Send confirmation email to the user
    await sendWaitlistConfirmationEmail({
      email: email.toLowerCase(),
      name: name || null,
    });

    // Send admin notification email
    const safeName = name ? escapeHtml(name) : 'Not provided';
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: 'New Studio Systems Waitlist Signup!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B3937;">New Waitlist Signup</h2>
          <p>Someone just joined the Studio Systems waitlist!</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 10px 0 0;"><strong>Email:</strong> ${escapeHtml(email.toLowerCase())}</p>
            <p style="margin: 10px 0 0;"><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            View all waitlist signups in your <a href="https://oceoluxe.com/dashboard/crm">CRM dashboard</a>.
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
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'owner' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
