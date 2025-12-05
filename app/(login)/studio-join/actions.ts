'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, type NewUser } from '@/lib/db/schema';
import { hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { validatedAction } from '@/lib/auth/middleware';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// Price IDs - these should be set in environment variables
const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID || '',
  yearly: process.env.STRIPE_STUDIO_YEARLY_PRICE_ID || '',
};

const studioSignUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  plan: z.enum(['monthly', 'yearly']).default('yearly'),
});

export const studioSignUp = validatedAction(
  studioSignUpSchema,
  async (data, formData) => {
    const { name, email, password, plan } = data;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        error: 'An account with this email already exists. Please sign in instead.',
        email,
        password,
        name,
      };
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const newUser: NewUser = {
      email,
      name,
      passwordHash,
      role: 'member', // Studio members get 'member' role (not 'owner' or 'admin')
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    if (!createdUser) {
      return {
        error: 'Failed to create account. Please try again.',
        email,
        password,
        name,
      };
    }

    // Set session so user is logged in
    await setSession(createdUser);

    // Get the price ID for the selected plan
    const priceId = PRICE_IDS[plan];

    if (!priceId) {
      // If no price ID configured, redirect to subscribe page
      redirect('/studio/subscribe');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      client_reference_id: createdUser.id.toString(),
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/studio?welcome=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/studio/subscribe?plan=${plan}&canceled=true`,
      metadata: {
        userId: createdUser.id.toString(),
        subscriptionType: 'studio_systems',
      },
      subscription_data: {
        metadata: {
          userId: createdUser.id.toString(),
          subscriptionType: 'studio_systems',
        },
      },
    });

    if (session.url) {
      redirect(session.url);
    }

    // Fallback redirect (should not reach here if Stripe works)
    redirect(`/studio/subscribe?plan=${plan}`);
  }
);
