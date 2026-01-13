import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { quizLeads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendSignatureStyleResultsEmail } from '@/lib/email/quiz-email';

// POST /api/quiz/signature-style/results - Send results email after quiz completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, score, totalQuestions } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Update the lead with their score
    await db
      .update(quizLeads)
      .set({
        scores: { score, totalQuestions },
      })
      .where(eq(quizLeads.email, email.toLowerCase()));

    // Send results email
    const emailResult = await sendSignatureStyleResultsEmail({
      to: email.toLowerCase(),
      name,
      score,
      totalQuestions,
    });

    if (!emailResult.success) {
      console.error('Failed to send signature style results email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Results email sent',
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error('Error sending signature style results:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to send results' },
      { status: 500 }
    );
  }
}
