import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { leads } from '@/lib/db/schema';
import { getFreeNotionProductConfig } from '@/lib/config/notion-product-prices';
import { sendEmail } from '@/lib/email/sendgrid';

// POST /api/leads/claim-free-product - Save lead and send delivery email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, productSlug, productName } = body as {
      email: string;
      name?: string;
      productSlug: string;
      productName: string;
    };

    // Validate required fields
    if (!email || !productSlug || !productName) {
      return NextResponse.json(
        { message: 'Email, product slug, and product name are required' },
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

    // Get the free product config to get the download URL
    const productConfig = getFreeNotionProductConfig(productSlug);
    if (!productConfig) {
      return NextResponse.json(
        { message: 'This product is not available as a free download' },
        { status: 400 }
      );
    }

    const downloadUrl = productConfig.downloadUrl;
    if (!downloadUrl) {
      return NextResponse.json(
        { message: 'Download URL is not configured for this product' },
        { status: 400 }
      );
    }

    // Save the lead to the database
    const [lead] = await db.insert(leads).values({
      email,
      name: name || null,
      productSlug,
      productName,
      source: 'free_product',
    }).returning();

    // Send the delivery email
    const emailResult = await sendEmail({
      to: email,
      subject: `Your Free Download: ${productName}`,
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
                        Your Download is Ready!
                      </h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #3B3937; font-size: 16px; line-height: 1.6;">
                        Hi${name ? ` ${name}` : ''},
                      </p>

                      <p style="margin: 0 0 20px; color: #3B3937; font-size: 16px; line-height: 1.6;">
                        Thank you for downloading <strong>${productName}</strong>! Click the button below to access your free resource:
                      </p>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${downloadUrl}" style="display: inline-block; background-color: #CDA7B2; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 500;">
                              Access Your Download
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 0; color: #967F71; font-size: 14px; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link into your browser:
                        <br>
                        <a href="${downloadUrl}" style="color: #CDA7B2; word-break: break-all;">${downloadUrl}</a>
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
                        &copy; ${new Date().getFullYear()} Oceo Luxe. All rights reserved.
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

    // Update the lead with email sent timestamp if successful
    if (emailResult.success) {
      await db.update(leads)
        .set({ deliveryEmailSentAt: new Date() })
        .where(eq(leads.id, lead.id));
    }

    return NextResponse.json({
      success: true,
      message: 'Check your email for the download link!',
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error('Error claiming free product:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to process your request' },
      { status: 500 }
    );
  }
}
