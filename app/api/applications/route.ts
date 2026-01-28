import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { applications, leads } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { sendEmail } from '@/lib/email/sendgrid';

const ADMIN_EMAIL = 'kerrib@oceoluxe.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      email,
      phone,
      socialHandle,
      interest,
      experiences,
      growthAreas,
      obstacles,
      willingToInvest,
      additionalInfo,
    } = body;

    // Validate required fields
    if (!type || !name || !email || !phone || !socialHandle || !interest || !experiences || !growthAreas || !obstacles || !willingToInvest) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate application type
    if (type !== '1:1-clients') {
      return NextResponse.json(
        { message: 'Invalid application type' },
        { status: 400 }
      );
    }

    // Insert application into database
    await db.insert(applications).values({
      type,
      name,
      email,
      phone,
      socialHandle,
      interest,
      experiences,
      growthAreas,
      obstacles,
      willingToInvest,
      additionalInfo: additionalInfo || null,
      status: 'pending',
    });

    // Also add to leads with "1 on 1 Client" status
    await db.insert(leads).values({
      email,
      name,
      instagramHandle: socialHandle,
      productSlug: 'inquiry',
      productName: '1:1 Client Inquiry',
      source: 'inquiry',
      status: 'one_on_one',
    });

    // Send notification email to admin
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New 1:1 Client Application from ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3B3937;">
          <h1 style="color: #CDA7B2; font-weight: normal; border-bottom: 1px solid #CDA7B2; padding-bottom: 16px;">
            New Application Received
          </h1>

          <h2 style="font-size: 18px; color: #3B3937; margin-top: 24px;">Contact Information</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Social:</strong> ${socialHandle}</p>

          <h2 style="font-size: 18px; color: #3B3937; margin-top: 24px;">About Their Brand</h2>
          <p style="white-space: pre-wrap; background: #faf8f5; padding: 16px; border-radius: 8px;">${interest}</p>

          <h2 style="font-size: 18px; color: #3B3937; margin-top: 24px;">Brand Vision (1-2 Years)</h2>
          <p style="white-space: pre-wrap; background: #faf8f5; padding: 16px; border-radius: 8px;">${experiences}</p>

          <h2 style="font-size: 18px; color: #3B3937; margin-top: 24px;">Areas Needing Support</h2>
          <p style="white-space: pre-wrap; background: #faf8f5; padding: 16px; border-radius: 8px;">${growthAreas}</p>

          <h2 style="font-size: 18px; color: #3B3937; margin-top: 24px;">Current Challenges</h2>
          <p style="white-space: pre-wrap; background: #faf8f5; padding: 16px; border-radius: 8px;">${obstacles}</p>

          <h2 style="font-size: 18px; color: #3B3937; margin-top: 24px;">Ready to Invest?</h2>
          <p>${willingToInvest === 'yes' ? 'Yes, ready to invest' : 'Not at this time'}</p>

          ${additionalInfo ? `
          <h2 style="font-size: 18px; color: #3B3937; margin-top: 24px;">Additional Information</h2>
          <p style="white-space: pre-wrap; background: #faf8f5; padding: 16px; border-radius: 8px;">${additionalInfo}</p>
          ` : ''}

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
            <p style="color: #967F71; font-size: 14px;">
              View all applications in the <a href="https://oceoluxe.com/dashboard/applications" style="color: #CDA7B2;">dashboard</a>.
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to applicant
    await sendEmail({
      to: email,
      subject: `Thanks for reaching out, ${name.split(' ')[0]}!`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3B3937;">
          <h1 style="color: #CDA7B2; font-weight: normal; font-size: 28px; margin-bottom: 24px;">
            Thank you for your application
          </h1>

          <p style="font-size: 16px; line-height: 1.7; color: #3B3937;">
            Hi ${name.split(' ')[0]},
          </p>

          <p style="font-size: 16px; line-height: 1.7; color: #3B3937;">
            Thank you for taking the time to share about your brand. I've received your application and I'm excited to learn more about what you're building.
          </p>

          <p style="font-size: 16px; line-height: 1.7; color: #3B3937;">
            <strong>I'll review your application and get back to you within 3 business days.</strong>
          </p>

          <p style="font-size: 16px; line-height: 1.7; color: #3B3937;">
            In the meantime, feel free to explore the <a href="https://oceoluxe.com/blog" style="color: #CDA7B2;">blog</a> for tips on production and building your fashion brand.
          </p>

          <p style="font-size: 16px; line-height: 1.7; color: #3B3937; margin-top: 32px;">
            Talk soon,<br/>
            <strong>Kerri</strong><br/>
            <span style="color: #967F71;">Oceo Luxe</span>
          </p>

          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e5e5; text-align: center;">
            <p style="color: #967F71; font-size: 14px; font-style: italic;">
              Structure does not limit creativity, it protects it.
            </p>
            <div style="margin-top: 16px;">
              <a href="https://www.instagram.com/oceoluxe" style="color: #967F71; text-decoration: none; margin: 0 8px;">Instagram</a>
              <a href="https://oceoluxe.com" style="color: #967F71; text-decoration: none; margin: 0 8px;">Website</a>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin/owner
  if (user.role !== 'owner' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const allApplications = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt));

    return NextResponse.json({ applications: allApplications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
