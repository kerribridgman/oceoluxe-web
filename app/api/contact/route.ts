import { NextRequest, NextResponse } from 'next/server';
import { checkBotProtection, checkPublicRateLimit, isValidEmail, escapeHtml } from '@/lib/security/bot-protection';
import { sendEmail } from '@/lib/email/sendgrid';

const ADMIN_EMAIL = 'kerrib@oceoluxe.com';
const ADHARA_API_KEY = process.env.ADHARA_API_KEY;
const ADHARA_BASE_URL = process.env.ADHARA_BASE_URL;
const ADHARA_WORKSPACE_ID = process.env.ADHARA_WORKSPACE_ID;
const ADHARA_FORM_ID = process.env.NEXT_PUBLIC_ADHARA_FORM_ID;

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 attempts per 15 minutes per IP
    const rateLimited = checkPublicRateLimit(request, 'contact', 3);
    if (rateLimited) return rateLimited;

    const body = await request.json();

    // Bot protection checks
    const botCheck = checkBotProtection({
      _honeypot: body._honeypot,
      _t: body._t,
      _proof: body._proof,
      name: body.full_name,
    });
    if (botCheck) return botCheck;

    const { full_name, email, phone, topic, availability } = body;

    // Validate required fields
    if (!full_name || !email || !phone || !topic || !availability) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Submit to Adhara Forms API (public submit endpoint)
    if (ADHARA_API_KEY && ADHARA_BASE_URL && ADHARA_FORM_ID) {
      try {
        const adharaResponse = await fetch(
          `${ADHARA_BASE_URL}/api/v1/forms/${ADHARA_FORM_ID}/submit`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': ADHARA_API_KEY,
            },
            body: JSON.stringify({
              response_data: {
                full_name,
                email,
                phone,
                topic,
                availability,
              },
            }),
          }
        );

        if (!adharaResponse.ok) {
          console.error('Adhara submission failed:', await adharaResponse.text());
        }
      } catch (adharaError) {
        console.error('Adhara API error:', adharaError);
        // Continue — still send email notification even if Adhara fails
      }
    }

    // Send email notification to Kerri
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Consultation Request from ${escapeHtml(full_name)}`,
        html: `
          <h2>New Consultation Request</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(full_name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Topic</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(topic)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Availability</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(availability)}</td>
            </tr>
          </table>
        `,
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json({ message: 'Consultation request submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
