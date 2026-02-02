import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { db } from '@/lib/db/drizzle';
import { emailSends, emailList, campaigns, dripCampaigns, dripCampaignSteps, emailTemplates, dripEnrollments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUnsubscribeUrl } from './unsubscribe';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || 'kerrib@oceoluxe.com';
const DEFAULT_FROM_NAME = 'Kerri at Oceo Luxe';

export interface EmailAttachment {
  filename: string;
  url: string;
  type: string;
  content?: string; // base64 encoded content
}

export interface RecipientData {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  productName?: string | null;
  archetype?: string | null;
  membershipTier?: string | null;
  clientPackage?: string | null;
  instagramHandle?: string | null;
}

export interface SendMarketingEmailParams {
  emailListId: number;
  to: string;
  subject: string;
  body: string;
  fromEmail?: string;
  fromName?: string;
  attachments?: EmailAttachment[];
  recipientData?: RecipientData;
  ctaButton?: { text: string; url: string };
  campaignId?: number;
  dripCampaignId?: number;
  dripStepId?: number;
  templateId?: number;
  includeUnsubscribe?: boolean;
  previewText?: string;
  skipTracking?: boolean;
}

/**
 * Generate a styled CTA button HTML for email
 */
export function generateCtaButtonHtml(text: string, url: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px auto;"><tr><td style="border-radius: 6px; background: #CDA7B2;"><a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-family: Georgia, serif; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: 0.5px;">${text}</a></td></tr></table>`;
}

/**
 * Replace template variables with recipient data
 */
export function substituteVariables(
  template: string,
  data: RecipientData,
  ctaButton?: { text: string; url: string }
): string {
  let result = template
    .replace(/\{\{\s*first\s*name\s*\}\}/gi, data.firstName || 'there')
    .replace(/\{\{\s*last\s*name\s*\}\}/gi, data.lastName || '')
    .replace(/\{\{\s*email\s*\}\}/gi, data.email || '')
    .replace(/\{\{\s*product\s*name\s*\}\}/gi, data.productName || '')
    .replace(/\{\{\s*archetype\s*\}\}/gi, data.archetype || '')
    .replace(/\{\{\s*membership\s*tier\s*\}\}/gi, data.membershipTier || '')
    .replace(/\{\{\s*client\s*package\s*\}\}/gi, data.clientPackage || '')
    .replace(/\{\{\s*instagram\s*handle\s*\}\}/gi, data.instagramHandle || '');

  if (ctaButton?.text && ctaButton?.url) {
    result = result.replace(
      /\{\{ctaButton\}\}/g,
      generateCtaButtonHtml(ctaButton.text, ctaButton.url)
    );
  } else {
    result = result.replace(/\{\{ctaButton\}\}/g, '');
  }

  return result;
}

/**
 * Fetch attachment content from URL and convert to base64
 */
async function fetchAttachment(attachment: EmailAttachment): Promise<{
  content: string;
  filename: string;
  type: string;
  disposition: 'attachment';
}> {
  const response = await fetch(attachment.url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  return {
    content: base64,
    filename: attachment.filename,
    type: attachment.type || 'application/octet-stream',
    disposition: 'attachment' as const,
  };
}

/**
 * Generate branded email footer with social links and unsubscribe
 */
async function generateEmailFooter(
  emailListId: number,
  includeUnsubscribe: boolean
): Promise<string> {
  const currentYear = new Date().getFullYear();
  const unsubscribeHtml = includeUnsubscribe
    ? `<p style="margin: 0 0 8px 0;"><a href="${await getUnsubscribeUrl(emailListId)}" style="color: #967F71; text-decoration: underline; font-size: 12px;">Unsubscribe from these emails</a></p>`
    : '';

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 40px; border-top: 1px solid #CDA7B2;">
      <tr>
        <td style="padding: 30px 0 0 0; text-align: center;">
          <!-- Social Links -->
          <p style="margin: 0 0 16px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; color: #967F71;">
            <a href="https://www.instagram.com/oceoluxe" target="_blank" style="color: #967F71; text-decoration: none;">Instagram</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="https://www.linkedin.com/in/kerri-bridgman/" target="_blank" style="color: #967F71; text-decoration: none;">LinkedIn</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="https://www.pinterest.com/oceoluxe/" target="_blank" style="color: #967F71; text-decoration: none;">Pinterest</a>
          </p>
          <!-- Tagline -->
          <p style="margin: 0 0 16px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; color: #967F71; font-style: italic;">
            Structure does not limit creativity, it protects it.
          </p>
          <!-- Legal -->
          <p style="margin: 0 0 4px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 11px; color: #967F71;">
            &copy; ${currentYear} Kerri Marie Consulting, LLC dba Oceo Luxe
          </p>
          <p style="margin: 0 0 12px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 11px; color: #967F71;">
            2123 SW 36th Terrace, Delray Beach, FL
          </p>
          ${unsubscribeHtml}
        </td>
      </tr>
    </table>
  `;
}

/**
 * Send a marketing email with tracking, attachments, and variable substitution
 */
export async function sendMarketingEmail({
  emailListId,
  to,
  subject,
  body,
  fromEmail = DEFAULT_FROM_EMAIL,
  fromName = DEFAULT_FROM_NAME,
  attachments = [],
  recipientData,
  ctaButton,
  campaignId,
  dripCampaignId,
  dripStepId,
  templateId,
  includeUnsubscribe = true,
  previewText,
  skipTracking = false,
}: SendMarketingEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not configured, skipping email send');
    return { success: false, error: 'Email not configured' };
  }

  try {
    // Substitute variables in subject and body
    const data: RecipientData = recipientData || { email: to };
    const processedSubject = substituteVariables(subject, data, ctaButton);
    const processedBody = substituteVariables(body, data, ctaButton);

    // Generate footer with unsubscribe link
    const footer = await generateEmailFooter(emailListId, includeUnsubscribe);

    // Preheader (hidden preview text)
    const preheaderHtml = previewText
      ? `<div style="display:none;font-size:1px;color:#faf8f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}${'&zwnj;&nbsp;'.repeat(80)}</div>`
      : '';

    // Personal sign-off (only for Kerri)
    const signOffHtml = fromName.toLowerCase().includes('kerri')
      ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px;">
          <tr><td style="font-family: Georgia, 'Times New Roman', serif; font-size: 15px; color: #3B3937; line-height: 1.6;">With intention,</td></tr>
          <tr><td style="font-family: Georgia, 'Times New Roman', serif; font-size: 15px; color: #CDA7B2; line-height: 1.6;">Kerri</td></tr>
        </table>`
      : '';

    // Wrap body in branded HTML structure
    const htmlContent = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${processedSubject}</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-spacing: 0; border-collapse: collapse; }
    td { padding: 0; }
    img { border: 0; display: block; }
    a { color: #CDA7B2; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #3B3937;">
  ${preheaderHtml}
  <!-- Outer wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #faf8f5;">
    <tr>
      <td style="padding: 20px 0;">
        <!-- Inner container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px 20px 40px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #CDA7B2; letter-spacing: 3px; font-weight: normal;">OCEO LUXE</p>
              <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; color: #967F71; font-style: italic;">Structure does not limit creativity, it protects it.</p>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td style="border-top: 1px solid #CDA7B2; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; border-radius: 8px;">
                <tr>
                  <td style="padding: 32px; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; color: #3B3937; line-height: 1.6;">
                    ${processedBody}
                    ${signOffHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Process attachments
    const processedAttachments = await Promise.all(
      attachments.map((att) => fetchAttachment(att))
    );

    // Send email
    const msg: MailDataRequired = {
      to,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: processedSubject,
      html: htmlContent,
      text: processedBody.replace(/<[^>]*>/g, ''),
    };

    if (processedAttachments.length > 0) {
      msg.attachments = processedAttachments;
    }

    const [response] = await sgMail.send(msg);
    const messageId = response.headers['x-message-id'] as string;

    // Record the send in the database
    if (!skipTracking) {
      await db.insert(emailSends).values({
        emailListId,
        campaignId: campaignId || null,
        dripCampaignId: dripCampaignId || null,
        dripStepId: dripStepId || null,
        templateId: templateId || null,
        toEmail: to,
        subject: processedSubject,
        fromEmail,
        status: 'sent',
        sendgridMessageId: messageId,
        sentAt: new Date(),
      });
    }

    console.log(`Marketing email sent to ${to} with message ID: ${messageId}`);
    return { success: true, messageId };
  } catch (error: unknown) {
    console.error('SendGrid error:', error);

    // Record the failed send
    if (!skipTracking) {
      await db.insert(emailSends).values({
        emailListId,
        campaignId: campaignId || null,
        dripCampaignId: dripCampaignId || null,
        dripStepId: dripStepId || null,
        templateId: templateId || null,
        toEmail: to,
        subject,
        fromEmail,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date(),
      });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send a campaign to all recipients
 */
export async function sendCampaign(campaignId: number): Promise<{
  success: boolean;
  sent: number;
  failed: number;
  error?: string;
}> {
  try {
    // Get the campaign
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return { success: false, sent: 0, failed: 0, error: 'Campaign not found' };
    }

    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return { success: false, sent: 0, failed: 0, error: 'Campaign already sent' };
    }

    // Update campaign status
    await db
      .update(campaigns)
      .set({ status: 'sending' })
      .where(eq(campaigns.id, campaignId));

    // Get recipients based on audience type
    const recipients = await db
      .select()
      .from(emailList)
      .where(eq(emailList.unsubscribedFromAll, false));

    // Filter by audience type
    const filteredRecipients = recipients.filter((r) => {
      if (campaign.audienceType === 'all') return true;
      return r.source === campaign.audienceType;
    });

    // Parse attachments if any (handle potential double-stringification)
    let attachments: EmailAttachment[] = [];
    if (campaign.attachments) {
      try {
        let parsed = JSON.parse(campaign.attachments);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) attachments = parsed;
      } catch (e) {
        console.error('Error parsing campaign attachments:', e);
      }
    }

    let sent = 0;
    let failed = 0;

    // Send to each recipient
    for (const recipient of filteredRecipients) {
      const result = await sendMarketingEmail({
        emailListId: recipient.id,
        to: recipient.email,
        subject: campaign.subject,
        body: campaign.body,
        fromEmail: campaign.fromEmail || undefined,
        fromName: campaign.fromName || undefined,
        attachments,
        recipientData: {
          email: recipient.email,
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          productName: recipient.productName,
          archetype: recipient.archetype,
          membershipTier: recipient.membershipTier,
          clientPackage: recipient.clientPackage,
          instagramHandle: recipient.instagramHandle,
        },
        campaignId,
        previewText: campaign.previewText || undefined,
      });

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    // Update campaign with final stats
    await db
      .update(campaigns)
      .set({
        status: 'sent',
        sentAt: new Date(),
        totalRecipients: filteredRecipients.length,
        totalSent: sent,
        updatedAt: new Date(),
      })
      .where(eq(campaigns.id, campaignId));

    return { success: true, sent, failed };
  } catch (error) {
    console.error('Error sending campaign:', error);
    return {
      success: false,
      sent: 0,
      failed: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send a drip campaign step to an enrolled recipient
 */
export async function sendDripStep(
  enrollmentId: number,
  stepId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the step with template
    const [step] = await db
      .select({
        id: dripCampaignSteps.id,
        dripCampaignId: dripCampaignSteps.dripCampaignId,
        templateId: dripCampaignSteps.templateId,
        templateName: emailTemplates.name,
        templateSubject: emailTemplates.subject,
        templateBody: emailTemplates.body,
        templateFromEmail: emailTemplates.fromEmail,
        templateFromName: emailTemplates.fromName,
        templateAttachments: emailTemplates.attachments,
        templateVariables: emailTemplates.variables,
        templatePreviewText: emailTemplates.previewText,
      })
      .from(dripCampaignSteps)
      .innerJoin(emailTemplates, eq(dripCampaignSteps.templateId, emailTemplates.id))
      .where(eq(dripCampaignSteps.id, stepId))
      .limit(1);

    if (!step) {
      return { success: false, error: 'Step not found' };
    }

    // Get enrollment with email list data
    const [enrollment] = await db
      .select()
      .from(dripEnrollments)
      .where(eq(dripEnrollments.id, enrollmentId))
      .limit(1);

    // Parse attachments (handle potential double-stringification)
    let attachments: EmailAttachment[] = [];
    if (step.templateAttachments) {
      try {
        let parsed = JSON.parse(step.templateAttachments);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) attachments = parsed;
      } catch (e) {
        console.error('Error parsing template attachments:', e);
      }
    }

    // Parse CTA button from template variables
    let ctaButton: { text: string; url: string } | undefined;
    if (step.templateVariables) {
      try {
        const vars = JSON.parse(step.templateVariables);
        if (vars.ctaButtonText && vars.ctaButtonUrl) {
          ctaButton = { text: vars.ctaButtonText, url: vars.ctaButtonUrl };
        }
      } catch (e) {
        console.error('Error parsing template variables:', e);
      }
    }

    // Get the email list entry
    if (!enrollment) {
      return { success: false, error: 'Enrollment not found' };
    }

    const [emailEntry] = await db
      .select()
      .from(emailList)
      .where(eq(emailList.id, enrollment.emailListId))
      .limit(1);

    if (!emailEntry) {
      return { success: false, error: 'Email not found' };
    }

    if (emailEntry.unsubscribedFromDrips || emailEntry.unsubscribedFromAll) {
      return { success: false, error: 'Recipient has unsubscribed' };
    }

    // Send the email
    const result = await sendMarketingEmail({
      emailListId: emailEntry.id,
      to: emailEntry.email,
      subject: step.templateSubject,
      body: step.templateBody,
      fromEmail: step.templateFromEmail || undefined,
      fromName: step.templateFromName || undefined,
      attachments,
      ctaButton,
      recipientData: {
        email: emailEntry.email,
        firstName: emailEntry.firstName,
        lastName: emailEntry.lastName,
        productName: emailEntry.productName,
        archetype: emailEntry.archetype,
        membershipTier: emailEntry.membershipTier,
        clientPackage: emailEntry.clientPackage,
        instagramHandle: emailEntry.instagramHandle,
      },
      dripCampaignId: step.dripCampaignId,
      dripStepId: step.id,
      templateId: step.templateId,
      previewText: step.templatePreviewText || undefined,
    });

    return result;
  } catch (error) {
    console.error('Error sending drip step:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
