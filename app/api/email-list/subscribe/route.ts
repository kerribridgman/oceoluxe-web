import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { emailList } from '@/lib/db/schema';
import { sendEmail } from '@/lib/email/sendgrid';
import { checkRateLimit } from '@/lib/auth/rate-limit';

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

// Detect gibberish names commonly used by spam bots
function isLikelyBotName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;

  const trimmed = name.trim();

  // First names longer than 20 characters without spaces are extremely rare
  if (trimmed.length > 20 && !trimmed.includes(' ')) return true;

  // Count upper↔lower case transitions (real names have 0-3)
  let caseTransitions = 0;
  for (let i = 1; i < trimmed.length; i++) {
    const prevLower = /[a-z]/.test(trimmed[i - 1]);
    const prevUpper = /[A-Z]/.test(trimmed[i - 1]);
    const currLower = /[a-z]/.test(trimmed[i]);
    const currUpper = /[A-Z]/.test(trimmed[i]);
    if ((prevLower && currUpper) || (prevUpper && currLower)) caseTransitions++;
  }
  if (caseTransitions > 4) return true;

  // 5+ consecutive consonants is extremely rare in real names
  if (/[^aeiouAEIOU\s\-']{5,}/.test(trimmed)) return true;

  // Very low vowel ratio for names longer than 6 chars
  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 6) {
    const vowelCount = (letters.match(/[aeiouAEIOU]/g) || []).length;
    if (vowelCount / letters.length < 0.15) return true;
  }

  return false;
}

// Validate the proof token sent by the client
function isValidProofToken(timestamp: number | undefined, proof: string | undefined): boolean {
  if (!timestamp || !proof) return false;
  try {
    const expected = Buffer.from(String(timestamp).split('').reverse().join('') + 'oceo').toString('base64');
    return proof === expected;
  } catch {
    return false;
  }
}

// POST /api/email-list/subscribe - Subscribe to email list
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP: 5 attempts per 15 minutes
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimit = checkRateLimit(`subscribe:${ip}`, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, firstName, website, _t, _proof } = body as {
      email: string;
      firstName?: string;
      website?: string;
      _t?: number;
      _proof?: string;
    };

    // Silent rejection helper — returns fake success to not tip off bots
    const silentReject = () =>
      NextResponse.json({
        success: true,
        message: "You're on the list! Check your inbox for updates.",
      });

    // Honeypot: if the hidden "website" field has a value, a bot filled it in
    if (website) return silentReject();

    // Proof token: client must compute a token from the timestamp
    if (!isValidProofToken(_t, _proof)) return silentReject();

    // Timestamp validation: reject if form was filled in under 3 seconds
    if (_t) {
      const elapsed = Date.now() - _t;
      if (elapsed < 3000) return silentReject();
    }

    // Gibberish name detection: catch random-string bot names
    if (firstName && isLikelyBotName(firstName)) return silentReject();

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

    // Block emails exceeding RFC max length (254 chars)
    if (email.length > 254) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Block emails with 3+ consecutive dots in local part (common bot pattern)
    const localPart = email.split('@')[0];
    if (/\.{3,}/.test(localPart)) {
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
