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
                    Studio Systems was built for creative founders like you, designers who want <strong style="color: #3B3937;">structure as support</strong>, not another thing on your to-do list. Inside, you'll find everything you need to bring your ideas to life with clarity and calm.
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
                    Questions? Just reply to this email. We're here to help.
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
    subject: "Welcome to Studio Systems - Let's Get Started!",
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
// Founding Member Emails (Pre-Launch)
// ============================================

/**
 * Send welcome email to founding members who paid during pre-launch
 * Different from regular welcome - they can't access content yet
 */
export async function sendFoundingMemberWelcomeEmail(member: StudioMemberInfo) {
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
              <!-- Hero Image -->
              <tr>
                <td>
                  <img src="https://oceoluxe.com/images/hero-workspace.jpg" alt="Studio Systems by Oceo Luxe" style="width: 100%; height: auto; display: block;" />
                </td>
              </tr>

              <!-- Header Badge -->
              <tr>
                <td style="padding: 32px 40px 0 40px; text-align: center;">
                  <span style="display: inline-block; background: linear-gradient(135deg, #CDA7B2 0%, #BD97A2 100%); color: white; font-size: 12px; letter-spacing: 2px; padding: 8px 20px; border-radius: 20px; text-transform: uppercase;">Founding Member</span>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 24px 40px 40px 40px;">
                  <h1 style="color: #3B3937; font-size: 32px; font-weight: 300; margin: 0 0 24px 0; text-align: center;">You're In!</h1>

                  <p style="color: #3B3937; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
                    ${member.name ? `${member.name}, welcome to the founding circle.` : 'Welcome to the founding circle.'}
                  </p>

                  <p style="color: #6B655C; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0;">
                    You just locked in your <strong style="color: #CDA7B2;">50% founding member discount</strong> for Studio Systems. This rate ($33/month) is yours for life, no matter what we charge in the future.
                  </p>

                  <!-- What You Locked In Box -->
                  <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 32px;">
                    <tr>
                      <td style="background-color: #CDA7B2; border-radius: 12px; padding: 24px; color: white;">
                        <p style="font-size: 14px; letter-spacing: 2px; margin: 0 0 12px 0; text-transform: uppercase; opacity: 0.9;">Your Founding Member Benefits</p>
                        <table cellpadding="0" cellspacing="0" style="width: 100%;">
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: white;">
                              ✓ Lifetime rate of $33/month (50% off)
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: white;">
                              ✓ Twice-monthly live Q&A calls
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: white;">
                              ✓ Complete Notion system for your brand
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: white;">
                              ✓ Private designer community access
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: white;">
                              ✓ Leadership & somatic support resources
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- What Happens Next -->
                  <div style="background-color: #FAF8F6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <p style="color: #3B3937; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">What happens next:</p>
                    <p style="color: #6B655C; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0;">
                      <strong style="color: #3B3937;">Studio Systems opens February 1, 2025.</strong> You'll receive an email with your login details and full access to everything on launch day.
                    </p>
                    <p style="color: #6B655C; font-size: 15px; line-height: 1.7; margin: 0;">
                      Your membership is active and your founding member rate is locked in. You won't be charged again until your next billing cycle.
                    </p>
                  </div>

                  <!-- Follow Along -->
                  <div style="text-align: center; margin-bottom: 32px;">
                    <p style="color: #3B3937; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Follow along in the meantime:</p>
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="https://instagram.com/oceoluxe" style="display: inline-block; background-color: #3B3937; color: white; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-size: 13px;">Instagram</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://www.tiktok.com/@kerribridgman?lang=en" style="display: inline-block; background-color: #3B3937; color: white; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-size: 13px;">TikTok</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://pinterest.com/oceoluxe" style="display: inline-block; background-color: #3B3937; color: white; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-size: 13px;">Pinterest</a>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <p style="color: #3B3937; font-size: 16px; line-height: 1.8; margin: 0 0 0 0; text-align: center;">
                    Thank you for believing in this vision. I can't wait to support you on this journey.
                  </p>

                  <p style="color: #967F71; font-size: 14px; text-align: center; margin: 24px 0 0 0; font-style: italic;">
                    Questions? Just reply to this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #3B3937; padding: 24px; text-align: center;">
                  <p style="color: #ffffff; font-size: 14px; margin: 0 0 8px 0;">
                    With gratitude,<br/>Kerri & The Oceo Luxe Team
                  </p>
                  <p style="color: #ffffff; font-size: 12px; margin: 0; opacity: 0.7;">
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
    subject: "You're a Founding Member! Your spot is secured.",
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
                    Studio Systems is the membership for fashion designers and visionaries who want <strong style="color: #3B3937;">structure as support</strong>, not another thing on your to-do list. When we open the doors, you'll be the first to know.
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
                          <a href="${quizUrl}" style="color: #3B3937; text-decoration: underline;">Take the Designer Archetype Quiz</a> to find out what kind of fashion business you're building
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B655C; font-size: 14px;">
                          <span style="color: #CDA7B2; margin-right: 8px;">2.</span>
                          <a href="${instagramUrl}" style="color: #3B3937; text-decoration: underline;">Follow us on Instagram</a> for behind-the-scenes and tips
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
