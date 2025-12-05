'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { comparePasswords, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { validatedAction } from '@/lib/auth/middleware';

const studioSignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const studioSignIn = validatedAction(
  studioSignInSchema,
  async (data) => {
    const { email, password } = data;

    // Find user by email
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!foundUser) {
      return {
        error: 'Invalid email or password. Please try again.',
        email,
        password,
      };
    }

    // Verify password
    const isPasswordValid = await comparePasswords(
      password,
      foundUser.passwordHash
    );

    if (!isPasswordValid) {
      return {
        error: 'Invalid email or password. Please try again.',
        email,
        password,
      };
    }

    // Set session
    await setSession(foundUser);

    // Redirect to studio (the layout will handle subscription check)
    redirect('/studio');
  }
);
