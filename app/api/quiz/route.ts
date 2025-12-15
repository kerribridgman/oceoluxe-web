import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { quizLeads } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { sendQuizResultEmail } from '@/lib/email/quiz-email';

// GET /api/quiz - Get all quiz leads
export async function GET() {
  try {
    const allQuizLeads = await db
      .select()
      .from(quizLeads)
      .orderBy(desc(quizLeads.createdAt));

    return NextResponse.json({ quizLeads: allQuizLeads });
  } catch (error: any) {
    console.error('Error fetching quiz leads:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch quiz leads' },
      { status: 500 }
    );
  }
}

// POST /api/quiz - Save quiz lead with email and archetype
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, archetype, scores } = body;

    if (!email || !archetype) {
      return NextResponse.json(
        { message: 'Email and archetype are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingLead = await db.query.quizLeads.findFirst({
      where: eq(quizLeads.email, email.toLowerCase()),
    });

    if (existingLead) {
      // Update existing lead with new archetype if they retook the quiz
      await db
        .update(quizLeads)
        .set({
          archetype,
          scores,
          name: name || existingLead.name,
        })
        .where(eq(quizLeads.email, email.toLowerCase()));

      // Send updated archetype email for returning users too
      const emailResult = await sendQuizResultEmail({
        to: email.toLowerCase(),
        name: name || existingLead.name,
        archetype,
      });

      if (!emailResult.success) {
        console.error('Failed to send quiz email to returning user:', emailResult.error);
      }

      return NextResponse.json({
        success: true,
        message: 'Quiz result updated',
        isReturning: true,
        emailSent: emailResult.success,
      });
    }

    // Create new lead
    await db.insert(quizLeads).values({
      email: email.toLowerCase(),
      name,
      archetype,
      scores,
      source: 'designer_archetype_quiz',
    });

    // Send quiz result email
    const emailResult = await sendQuizResultEmail({
      to: email.toLowerCase(),
      name,
      archetype,
    });

    if (!emailResult.success) {
      console.error('Failed to send quiz email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Quiz lead captured',
      isReturning: false,
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error('Error saving quiz lead:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to save quiz lead' },
      { status: 500 }
    );
  }
}
