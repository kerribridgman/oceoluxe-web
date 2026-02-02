import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { sendMarketingEmail } from '@/lib/email/marketing-email';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subject,
      body: emailBody,
      fromEmail,
      fromName,
      previewText,
      attachments,
      ctaButtonText,
      ctaButtonUrl,
    } = body;

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      );
    }

    // Parse attachments if provided
    let parsedAttachments = [];
    if (attachments) {
      try {
        parsedAttachments = typeof attachments === 'string' ? JSON.parse(attachments) : attachments;
      } catch {
        // ignore parse errors
      }
    }

    const ctaButton = ctaButtonText && ctaButtonUrl
      ? { text: ctaButtonText, url: ctaButtonUrl }
      : undefined;

    const result = await sendMarketingEmail({
      emailListId: 0,
      to: user.email,
      subject,
      body: emailBody,
      fromEmail: fromEmail || undefined,
      fromName: fromName || undefined,
      previewText: previewText || undefined,
      attachments: parsedAttachments,
      ctaButton,
      includeUnsubscribe: false,
      skipTracking: true,
      recipientData: {
        email: user.email,
        firstName: user.name?.split(' ')[0] || null,
        lastName: user.name?.split(' ').slice(1).join(' ') || null,
      },
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${user.email}`,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send test email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
