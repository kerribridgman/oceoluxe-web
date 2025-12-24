import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { invitations, users, teams, teamMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth/password';
import { setSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 });
    }

    const [invitation] = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        role: invitations.role,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
      })
      .from(invitations)
      .where(eq(invitations.token, token))
      .limit(1);

    if (!invitation) {
      return NextResponse.json({ valid: false, error: 'Invalid invitation token' }, { status: 400 });
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json({ valid: false, error: 'Invitation has already been used' }, { status: 400 });
    }

    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Invitation has expired' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
      role: invitation.role,
    });
  } catch (error) {
    console.error('Error validating invitation:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate invitation' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, name, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Get the invitation
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(eq(invitations.token, token))
      .limit(1);

    if (!invitation) {
      return NextResponse.json({ success: false, error: 'Invalid invitation token' }, { status: 400 });
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Invitation has already been used' }, { status: 400 });
    }

    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, invitation.email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Create the user
    const passwordHash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        email: invitation.email,
        name: name || null,
        passwordHash,
        role: invitation.role,
      })
      .returning();

    // Add user to the team
    await db.insert(teamMembers).values({
      userId: newUser.id,
      teamId: invitation.teamId,
      role: invitation.role,
    });

    // Mark invitation as accepted
    await db
      .update(invitations)
      .set({ status: 'accepted' })
      .where(eq(invitations.id, invitation.id));

    // Set session
    await setSession(newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
