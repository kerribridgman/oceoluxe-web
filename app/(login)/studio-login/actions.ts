'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { setSession } from '@/lib/auth/session';
import { comparePasswords } from '@/lib/auth/password';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { validatedAction } from '@/lib/auth/middleware';
import {
  checkRateLimit,
  resetRateLimit,
  getAuthRateLimitKey,
  AUTH_RATE_LIMITS
} from '@/lib/auth/rate-limit';

// Helper to get client IP from headers
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         headersList.get('x-real-ip') ||
         'unknown';
}

const studioSignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

export const studioSignIn = validatedAction(
  studioSignInSchema,
  async (data) => {
    const { email, password } = data;

    // Rate limit check
    const clientIp = await getClientIp();
    const rateLimitKey = getAuthRateLimitKey(clientIp, email);
    const rateLimit = checkRateLimit(rateLimitKey, AUTH_RATE_LIMITS.login);

    if (!rateLimit.allowed) {
      const minutesLeft = Math.ceil(rateLimit.resetIn / 60000);
      return {
        error: `Too many login attempts. Please try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`,
        email,
        password,
      };
    }

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

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey);

    // Redirect to studio (the layout will handle subscription check)
    redirect('/studio');
  }
);
