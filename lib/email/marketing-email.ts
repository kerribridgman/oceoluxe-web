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
  campaignId?: number;
  dripCampaignId?: number;
  dripStepId?: number;
  templateId?: number;
  includeUnsubscribe?: boolean;
}

/**
 * Replace template variables with recipient data
 */
export function substituteVariables(
  template: string,
  data: RecipientData
): string {
  return template
    .replace(/\{\{firstName\}\}/g, data.firstName || 'there')
    .replace(/\{\{lastName\}\}/g, data.lastName || '')
    .replace(/\{\{email\}\}/g, data.email || '')
    .replace(/\{\{productName\}\}/g, data.productName || '')
    .replace(/\{\{archetype\}\}/g, data.archetype || '')
    .replace(/\{\{membershipTier\}\}/g, data.membershipTier || '')
    .replace(/\{\{clientPackage\}\}/g, data.clientPackage || '')
    .replace(/\{\{instagramHandle\}\}/g, data.instagramHandle || '');
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
 * Generate email footer with unsubscribe link
 */
async function generateEmailFooter(
  emailListId: number,
  includeUnsubscribe: boolean
): Promise<string> {
  if (!includeUnsubscribe) {
    return '';
  }

  const unsubscribeUrl = await getUnsubscribeUrl(emailListId);

  return `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #666; font-size: 12px;">
      <p>Oceo Luxe | Fashion Business Coaching</p>
      <p>
        <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">
          Unsubscribe from these emails
        </a>
      </p>
    </div>
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
  campaignId,
  dripCampaignId,
  dripStepId,
  templateId,
  includeUnsubscribe = true,
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
    const processedSubject = substituteVariables(subject, data);
    const processedBody = substituteVariables(body, data);

    // Generate footer with unsubscribe link
    const footer = await generateEmailFooter(emailListId, includeUnsubscribe);

    // Wrap body in basic HTML structure
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #3B3937; }
          a { color: #CDA7B2; }
        </style>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #faf8f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px;">
          ${processedBody}
          ${footer}
        </div>
      </body>
      </html>
    `;

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

    console.log(`Marketing email sent to ${to} with message ID: ${messageId}`);
    return { success: true, messageId };
  } catch (error: unknown) {
    console.error('SendGrid error:', error);

    // Record the failed send
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

    // Parse attachments if any
    let attachments: EmailAttachment[] = [];
    if (campaign.attachments) {
      try {
        attachments = JSON.parse(campaign.attachments);
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

    // Parse attachments
    let attachments: EmailAttachment[] = [];
    if (step.templateAttachments) {
      try {
        attachments = JSON.parse(step.templateAttachments);
      } catch (e) {
        console.error('Error parsing template attachments:', e);
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
