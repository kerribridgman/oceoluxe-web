import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@oceoluxe.com';
const FROM_NAME = 'Oceoluxe';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not configured, skipping email send');
    return { success: false, error: 'Email not configured' };
  }

  try {
    await sgMail.send({
      to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error: any) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
}
