import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { invitations, teams, users } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email/sendgrid';

// Only these emails can send admin invitations
const AUTHORIZED_ADMIN_EMAILS = ['kerrib@oceoluxe.com'];

export async function GET() {
  try {
    const user = await getUser();
    if (!user || !AUTHORIZED_ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allInvitations = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        role: invitations.role,
        status: invitations.status,
        invitedAt: invitations.invitedAt,
        expiresAt: invitations.expiresAt,
      })
      .from(invitations)
      .orderBy(desc(invitations.invitedAt));

    return NextResponse.json(allInvitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || !AUTHORIZED_ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ error: 'Unauthorized - only kerrib@oceoluxe.com can send invitations' }, { status: 401 });
    }

    const body = await request.json();
    const { email, role = 'admin' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation
    const [existingInvite] = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email),
          eq(invitations.status, 'pending')
        )
      )
      .limit(1);

    if (existingInvite) {
      return NextResponse.json(
        { error: 'An invitation is already pending for this email' },
        { status: 400 }
      );
    }

    // Get or create the admin team
    let [adminTeam] = await db
      .select()
      .from(teams)
      .where(eq(teams.name, 'Oceo Luxe Admin'))
      .limit(1);

    if (!adminTeam) {
      [adminTeam] = await db
        .insert(teams)
        .values({ name: 'Oceo Luxe Admin' })
        .returning();
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex');

    // Token expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const [invitation] = await db
      .insert(invitations)
      .values({
        teamId: adminTeam.id,
        email,
        role,
        invitedBy: user.id,
        status: 'pending',
        token,
        expiresAt,
      })
      .returning();

    // Send invitation email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oceoluxe.com';
    const inviteUrl = `${baseUrl}/admin-signup?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'You\'re Invited to Join Oceo Luxe Dashboard',
      html: `
        <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h1 style="color: #3B3937; font-weight: 300; margin-bottom: 24px;">You're Invited!</h1>

          <p style="color: #3B3937; line-height: 1.6;">
            Kerri from Oceo Luxe has invited you to join the admin dashboard.
          </p>

          <p style="color: #3B3937; line-height: 1.6;">
            Click the button below to create your account:
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${inviteUrl}"
               style="background-color: #CDA7B2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Create Your Account
            </a>
          </div>

          <p style="color: #967F71; font-size: 14px; line-height: 1.6;">
            This invitation will expire in 7 days.
          </p>

          <p style="color: #967F71; font-size: 14px; line-height: 1.6;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">

          <p style="color: #967F71; font-size: 12px; text-align: center;">
            Oceo Luxe | Fashion Business Coaching
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}
