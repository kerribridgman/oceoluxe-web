import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { quizLeads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/quiz/signature-style - Save signature style quiz lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingLead = await db.query.quizLeads.findFirst({
      where: eq(quizLeads.email, email.toLowerCase()),
    });

    if (existingLead) {
      // Update name if provided and they didn't have one
      if (name && !existingLead.name) {
        await db
          .update(quizLeads)
          .set({ name })
          .where(eq(quizLeads.email, email.toLowerCase()));
      }

      return NextResponse.json({
        success: true,
        message: 'Welcome back!',
        isReturning: true,
      });
    }

    // Create new lead
    await db.insert(quizLeads).values({
      email: email.toLowerCase(),
      name,
      archetype: 'signature_style',
      scores: {},
      source: 'signature_style_quiz',
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz lead captured',
      isReturning: false,
    });
  } catch (error: any) {
    console.error('Error saving signature style quiz lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to save quiz lead' },
      { status: 500 }
    );
  }
}
