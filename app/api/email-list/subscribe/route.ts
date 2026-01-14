import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { emailList } from '@/lib/db/schema';
import { sendEmail } from '@/lib/email/sendgrid';

// HTML escape function to prevent XSS/injection in email templates
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

// POST /api/email-list/subscribe - Subscribe to email list
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = body as {
      email: string;
      firstName?: string;
    };

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.query.emailList.findFirst({
      where: eq(emailList.email, email.toLowerCase()),
    });

    if (existingEmail) {
      // If already subscribed, just return success (don't reveal they're already on the list)
      return NextResponse.json({
        success: true,
        message: "You're on the list! Check your inbox for updates.",
      });
    }

    // Add to the email list
    await db.insert(emailList).values({
      email: email.toLowerCase(),
      firstName: firstName || null,
      source: 'website_signup',
    });

    // Escape user-provided content for safe HTML rendering
    const safeFirstName = firstName ? escapeHtml(firstName) : '';

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to Studio Systems!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #faf8f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #CDA7B2 0%, #967F71 100%); padding: 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
                        Welcome to Studio Systems
                      </h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #3B3937; font-size: 16px; line-height: 1.6;">
                        Hi${safeFirstName ? ` ${safeFirstName}` : ''},
                      </p>

                      <p style="margin: 0 0 20px; color: #3B3937; font-size: 16px; line-height: 1.6;">
                        Thank you for joining our community! You're now subscribed to receive updates on production strategy, factory communication tips, and sustainable sourcing guidance for fashion designers.
                      </p>

                      <p style="margin: 0 0 20px; color: #3B3937; font-size: 16px; line-height: 1.6;">
                        Here's what you can expect:
                      </p>

                      <ul style="margin: 0 0 20px; padding-left: 20px; color: #967F71; font-size: 16px; line-height: 1.8;">
                        <li>Production tips and industry insights</li>
                        <li>Early access to new resources</li>
                        <li>Exclusive content for our email community</li>
                      </ul>

                      <p style="margin: 0; color: #3B3937; font-size: 16px; line-height: 1.6;">
                        <em style="color: #967F71;">"Structure does not limit creativity, it protects it."</em>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f5f3f0; padding: 30px 40px; text-align: center;">
                      <p style="margin: 0 0 10px; color: #967F71; font-size: 14px;">
                        Questions? Reply to this email or contact us at
                        <a href="mailto:kerrib@oceoluxe.com" style="color: #CDA7B2;">kerrib@oceoluxe.com</a>
                      </p>
                      <p style="margin: 0; color: #967F71; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} Studio Systems by Oceo Luxe. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "You're on the list! Check your inbox for a welcome email.",
    });
  } catch (error: any) {
    console.error('Error subscribing to email list:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
