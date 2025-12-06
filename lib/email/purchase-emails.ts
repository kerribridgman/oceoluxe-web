import { sendEmail } from './sendgrid';
import { generatePurchaseConfirmationEmail, generateSubscriptionWelcomeEmail } from './templates';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oceoluxe.com';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'kerrib@oceoluxe.com';

interface ProductInfo {
  name: string;
  description?: string | null;
  deliveryType: string;
  downloadUrl?: string | null;
  accessInstructions?: string | null;
}

interface PurchaseInfo {
  customerEmail: string;
  customerName?: string | null;
  amountPaidCents: number;
  currency: string;
  isSubscription: boolean;
  billingInterval?: 'month' | 'year' | null;
}

export async function sendPurchaseConfirmationEmail(
  product: ProductInfo,
  purchase: PurchaseInfo,
  productSlug: string
) {
  const thankYouUrl = `${BASE_URL}/checkout/thank-you?product=${productSlug}`;

  const { subject, html } = generatePurchaseConfirmationEmail({
    customerName: purchase.customerName || undefined,
    customerEmail: purchase.customerEmail,
    productName: product.name,
    productDescription: product.description,
    amount: purchase.amountPaidCents,
    currency: purchase.currency,
    deliveryType: product.deliveryType as 'download' | 'access' | 'email',
    downloadUrl: product.downloadUrl,
    accessInstructions: product.accessInstructions,
    isSubscription: purchase.isSubscription,
    billingInterval: purchase.billingInterval || undefined,
    thankYouUrl,
  });

  return sendEmail({
    to: purchase.customerEmail,
    subject,
    html,
  });
}

export async function sendSubscriptionWelcomeEmail(
  product: ProductInfo,
  purchase: PurchaseInfo,
  productSlug: string
) {
  const thankYouUrl = `${BASE_URL}/checkout/thank-you?product=${productSlug}`;

  const { subject, html } = generateSubscriptionWelcomeEmail({
    customerName: purchase.customerName || undefined,
    customerEmail: purchase.customerEmail,
    productName: product.name,
    amount: purchase.amountPaidCents,
    currency: purchase.currency,
    deliveryType: product.deliveryType as 'download' | 'access' | 'email',
    accessInstructions: product.accessInstructions,
    isSubscription: true,
    billingInterval: purchase.billingInterval || 'month',
    thankYouUrl,
  });

  return sendEmail({
    to: purchase.customerEmail,
    subject,
    html,
  });
}

// ============================================
// Studio Systems Membership Emails
// ============================================

interface StudioMemberInfo {
  email: string;
  name?: string | null;
  tier: 'monthly' | 'yearly';
  amountCents: number;
}

/**
 * Send welcome email to new Studio Systems member with guided onboarding
 */
export async function sendStudioWelcomeEmail(member: StudioMemberInfo) {
  const dashboardUrl = `${BASE_URL}/studio`;
  const profileUrl = `${BASE_URL}/studio/settings`;
  const coursesUrl = `${BASE_URL}/studio/courses`;
  const communityUrl = `${BASE_URL}/studio/community`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #FAF8F6; font-family: Georgia, 'Times New Roman', serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #CDA7B2 0%, #967F71 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 28px; font-weight: 300; margin: 0 0 8px 0;">Welcome to Studio Systems!</h1>
                  <p style="color: #ffffff; font-size: 14px; letter-spacing: 2px; margin: 0; opacity: 0.9;">BY OCEO LUXE</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="color: #3B3937; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
                    ${member.name ? `Congratulations, ${member.name}!` : 'Congratulations!'}
                  </p>

                  <p style="color: #6B655C; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0;">
                    You're officially part of our community of fashion designers and visionaries. We're so excited to have you here!
                  </p>

                  <p style="color: #6B655C; font-size: 16px; line-height: 1.8; margin: 0 0 32px 0;">
                    Studio Systems was built for creative founders like you — designers who want <strong style="color: #3B3937;">structure as support</strong>, not another thing on your to-do list. Inside, you'll find everything you need to bring your ideas to life with clarity and calm.
                  </p>

                  <!-- Onboarding Steps Box -->
                  <div style="background-color: #FAF8F6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <p style="color: #3B3937; font-size: 16px; font-weight: 600; margin: 0 0 20px 0;">Your Onboarding Checklist:</p>
                    <table cellpadding="0" cellspacing="0" style="width: 100%;">
                      <tr>
                        <td style="padding: 12px 0; color: #6B655C; font-size: 14px; border-bottom: 1px solid #EDEBE8;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #CDA7B2; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px;">1</span>
                          <strong style="color: #3B3937;">Log in to your account</strong><br/>
                          <span style="margin-left: 36px; font-size: 13px;">Use the email you signed up with: ${member.email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #6B655C; font-size: 14px; border-bottom: 1px solid #EDEBE8;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #CDA7B2; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px;">2</span>
                          <strong style="color: #3B3937;"><a href="${profileUrl}" style="color: #3B3937; text-decoration: underline;">Complete your profile</a></strong><br/>
                          <span style="margin-left: 36px; font-size: 13px;">Add your photo and tell us about your brand</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #6B655C; font-size: 14px; border-bottom: 1px solid #EDEBE8;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #CDA7B2; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px;">3</span>
                          <strong style="color: #3B3937;"><a href="${coursesUrl}" style="color: #3B3937; text-decoration: underline;">Start your first course</a></strong><br/>
                          <span style="margin-left: 36px; font-size: 13px;">We recommend starting with "The Oceo Method" foundations</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; color: #6B655C; font-size: 14px;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #CDA7B2; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 12px;">4</span>
                          <strong style="color: #3B3937;"><a href="${communityUrl}" style="color: #3B3937; text-decoration: underline;">Join the community</a></strong><br/>
                          <span style="margin-left: 36px; font-size: 13px;">Introduce yourself and connect with fellow designers</span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="width: 100%;">
                    <tr>
                      <td align="center">
                        <a href="${dashboardUrl}" style="display: inline-block; background-color: #3B3937; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 500;">
                          Go to Your Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="color: #967F71; font-size: 14px; text-align: center; margin: 32px 0 0 0;">
                    Questions? Just reply to this email — we're here to help.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #FAF8F6; padding: 24px; text-align: center; border-top: 1px solid #EDEBE8;">
                  <p style="color: #967F71; font-size: 14px; margin: 0 0 8px 0;">
                    With love,<br/>The Oceo Luxe Team
                  </p>
                  <p style="color: #967F71; font-size: 12px; margin: 0;">
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
  `;

  return sendEmail({
    to: member.email,
    subject: "Welcome to Studio Systems — Let's Get Started!",
    html,
  });
}

/**
 * Send admin notification when new member signs up
 */
export async function sendAdminNewMemberNotification(member: StudioMemberInfo) {
  const tierLabel = member.tier === 'yearly' ? 'Annual' : 'Monthly';
  const amount = (member.amountCents / 100).toFixed(2);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #CDA7B2; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 20px; margin: 0;">New Studio Systems Member!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px;">
            <table cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                  <strong style="color: #666;">Name:</strong>
                  <span style="color: #333; float: right;">${member.name || 'Not provided'}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                  <strong style="color: #666;">Email:</strong>
                  <span style="color: #333; float: right;">${member.email}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                  <strong style="color: #666;">Plan:</strong>
                  <span style="color: #333; float: right;">${tierLabel}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">
                  <strong style="color: #666;">Amount:</strong>
                  <span style="color: #333; float: right;">$${amount}</span>
                </td>
              </tr>
            </table>

            <p style="color: #666; font-size: 14px; margin: 24px 0 0 0; text-align: center;">
              Signed up at ${new Date().toLocaleString()}
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Studio Member: ${member.name || member.email} (${tierLabel})`,
    html,
  });
}

// ============================================
// Waitlist Emails
// ============================================

interface WaitlistSignupInfo {
  email: string;
  name?: string | null;
}

/**
 * Send confirmation email to someone who joins the waitlist
 */
export async function sendWaitlistConfirmationEmail(signup: WaitlistSignupInfo) {
  const quizUrl = `${BASE_URL}/quiz`;
  const instagramUrl = 'https://instagram.com/oceoluxe';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #FAF8F6; font-family: Georgia, 'Times New Roman', serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #CDA7B2 0%, #967F71 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 28px; font-weight: 300; margin: 0 0 8px 0;">You're on the List!</h1>
                  <p style="color: #ffffff; font-size: 14px; letter-spacing: 2px; margin: 0; opacity: 0.9;">STUDIO SYSTEMS BY OCEO LUXE</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="color: #3B3937; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
                    ${signup.name ? `Hi ${signup.name},` : 'Hi there,'}
                  </p>

                  <p style="color: #6B655C; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0;">
                    Thank you for joining the Studio Systems waitlist! We're so excited you're here.
                  </p>

                  <p style="color: #6B655C; font-size: 16px; line-height: 1.8; margin: 0 0 32px 0;">
                    Studio Systems is the membership for fashion designers and visionaries who want <strong style="color: #3B3937;">structure as support</strong> — not another thing on your to-do list. When we open the doors, you'll be the first to know.
                  </p>

                  <!-- What's Inside Box -->
                  <div style="background-color: #FAF8F6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <p style="color: #3B3937; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">What you'll get inside:</p>
                    <table cellpadding="0" cellspacing="0" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #6B655C; font-size: 14px;">
                          <span style="color: #CDA7B2; margin-right: 8px;">&#10003;</span> A proven production flow from vision to delivery
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B655C; font-size: 14px;">
                          <span style="color: #CDA7B2; margin-right: 8px;">&#10003;</span> Done-for-you supplier communication templates
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B655C; font-size: 14px;">
                          <span style="color: #CDA7B2; margin-right: 8px;">&#10003;</span> Pricing and costing systems that protect your margins
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B655C; font-size: 14px;">
                          <span style="color: #CDA7B2; margin-right: 8px;">&#10003;</span> A supportive community of fellow fashion founders
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- While You Wait Box -->
                  <div style="border: 1px solid #EDEBE8; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <p style="color: #3B3937; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">While you wait:</p>
                    <table cellpadding="0" cellspacing="0" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #6B655C; font-size: 14px;">
                          <span style="color: #CDA7B2; margin-right: 8px;">1.</span>
                          <a href="${quizUrl}" style="color: #3B3937; text-decoration: underline;">Take the Designer Archetype Quiz</a> — find out what kind of fashion business you're building
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B655C; font-size: 14px;">
                          <span style="color: #CDA7B2; margin-right: 8px;">2.</span>
                          <a href="${instagramUrl}" style="color: #3B3937; text-decoration: underline;">Follow us on Instagram</a> — for behind-the-scenes and tips
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B655C; font-size: 14px;">
                          <span style="color: #CDA7B2; margin-right: 8px;">3.</span>
                          Keep an eye on your inbox for exclusive updates
                        </td>
                      </tr>
                    </table>
                  </div>

                  <p style="color: #6B655C; font-size: 16px; line-height: 1.8; margin: 0 0 0 0; text-align: center; font-style: italic;">
                    We'll be in touch soon with early access details and founding member pricing.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #FAF8F6; padding: 24px; text-align: center; border-top: 1px solid #EDEBE8;">
                  <p style="color: #967F71; font-size: 14px; margin: 0 0 8px 0;">
                    With love,<br/>The Oceo Luxe Team
                  </p>
                  <p style="color: #967F71; font-size: 12px; margin: 0;">
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
  `;

  return sendEmail({
    to: signup.email,
    subject: "You're on the Studio Systems waitlist!",
    html,
  });
}
