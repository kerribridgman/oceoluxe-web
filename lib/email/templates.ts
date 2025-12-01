interface PurchaseEmailData {
  customerName?: string;
  customerEmail: string;
  productName: string;
  productDescription?: string | null;
  amount: number;
  currency: string;
  deliveryType: 'download' | 'access' | 'email';
  downloadUrl?: string | null;
  accessInstructions?: string | null;
  isSubscription?: boolean;
  billingInterval?: 'month' | 'year';
  thankYouUrl: string;
}

function formatPrice(cents: number, currency: string = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #3B3937; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { text-align: center; margin-bottom: 40px; }
  .logo { font-size: 28px; font-weight: 300; color: #CDA7B2; letter-spacing: 2px; }
  .card { background: #ffffff; border: 1px solid #EDEBE8; border-radius: 12px; padding: 32px; margin: 24px 0; }
  .product-name { font-size: 24px; font-weight: 400; color: #CDA7B2; margin: 0 0 8px 0; }
  .amount { font-size: 20px; color: #3B3937; margin: 16px 0; }
  .button { display: inline-block; background: #CDA7B2; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 16px 0; }
  .button-secondary { background: #3B3937; }
  .instructions { background: #F5F3F0; padding: 20px; border-radius: 8px; margin: 20px 0; }
  .footer { text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #EDEBE8; font-size: 14px; color: #967F71; }
  h1, h2, h3 { font-weight: 500; }
`;

export function generatePurchaseConfirmationEmail(data: PurchaseEmailData): { subject: string; html: string } {
  const greeting = data.customerName ? `Hi ${data.customerName},` : 'Hi there,';

  let deliveryContent = '';

  if (data.deliveryType === 'download' && data.downloadUrl) {
    deliveryContent = `
      <div class="card">
        <h2 style="margin-top: 0;">📥 Download Your Product</h2>
        <p>Your download is ready! Click the button below to get your files.</p>
        <a href="${data.downloadUrl}" class="button" target="_blank">Download Now</a>
        <p style="font-size: 14px; color: #967F71;">This link will also be available in your account.</p>
      </div>
    `;
  } else if (data.deliveryType === 'access' && data.accessInstructions) {
    deliveryContent = `
      <div class="card">
        <h2 style="margin-top: 0;">🔑 Access Instructions</h2>
        <div class="instructions">
          <p style="white-space: pre-wrap; margin: 0;">${data.accessInstructions}</p>
        </div>
      </div>
    `;
  } else if (data.deliveryType === 'email' && data.downloadUrl) {
    // Email delivery with a Notion template link
    deliveryContent = `
      <div class="card">
        <h2 style="margin-top: 0;">🎁 Access Your Template</h2>
        <p>Your Notion template is ready! Click the button below to duplicate it to your workspace.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.downloadUrl}" class="button" target="_blank" style="font-size: 16px;">Get Your Template</a>
        </div>
        <div style="background: #F5F3F0; padding: 16px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0 0 8px 0; font-weight: 500;">How to use:</p>
          <ol style="margin: 0; padding-left: 20px; color: #967F71;">
            <li>Click the button above to open the template</li>
            <li>Click "Duplicate" in the top right corner</li>
            <li>The template will be added to your Notion workspace</li>
          </ol>
        </div>
        <p style="font-size: 14px; color: #967F71; margin-top: 16px;">Save this email - you can access your template anytime using the link above.</p>
      </div>
    `;
  } else if (data.deliveryType === 'email' && data.accessInstructions) {
    deliveryContent = `
      <div class="card">
        <h2 style="margin-top: 0;">📧 Your Product Details</h2>
        <div class="instructions">
          <p style="white-space: pre-wrap; margin: 0;">${data.accessInstructions}</p>
        </div>
      </div>
    `;
  }

  const subscriptionNote = data.isSubscription
    ? `<p style="font-size: 14px; color: #967F71;">This is a ${data.billingInterval === 'year' ? 'yearly' : 'monthly'} subscription. You can manage your subscription at any time.</p>`
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for your purchase!</title>
      <style>${baseStyles}</style>
    </head>
    <body style="background: #faf8f5; margin: 0; padding: 0;">
      <div class="container">
        <div class="header">
          <div class="logo">OCEOLUXE</div>
        </div>

        <div class="card">
          <h1 style="margin-top: 0; text-align: center;">Thank You for Your Purchase! ✨</h1>

          <p>${greeting}</p>

          <p>Thank you for your order! We're thrilled to have you.</p>

          <div style="background: #F5F3F0; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p class="product-name">${data.productName}</p>
            ${data.productDescription ? `<p style="color: #967F71; margin: 8px 0 0 0;">${data.productDescription}</p>` : ''}
            <p class="amount">${formatPrice(data.amount, data.currency)}${data.isSubscription ? `/${data.billingInterval === 'year' ? 'year' : 'month'}` : ''}</p>
            ${subscriptionNote}
          </div>
        </div>

        ${deliveryContent}

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.thankYouUrl}" class="button button-secondary">View Your Order</a>
        </div>

        <div class="footer">
          <p>Questions? Reply to this email or contact us at <a href="mailto:kerrib@oceoluxe.com" style="color: #CDA7B2;">kerrib@oceoluxe.com</a></p>
          <p style="margin-top: 16px;">© ${new Date().getFullYear()} Oceoluxe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const subject = `Your Oceoluxe order: ${data.productName}`;

  return { subject, html };
}

export function generateSubscriptionWelcomeEmail(data: PurchaseEmailData): { subject: string; html: string } {
  const greeting = data.customerName ? `Hi ${data.customerName},` : 'Hi there,';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${data.productName}!</title>
      <style>${baseStyles}</style>
    </head>
    <body style="background: #faf8f5; margin: 0; padding: 0;">
      <div class="container">
        <div class="header">
          <div class="logo">OCEOLUXE</div>
        </div>

        <div class="card">
          <h1 style="margin-top: 0; text-align: center;">Welcome! 🎉</h1>

          <p>${greeting}</p>

          <p>Your subscription to <strong>${data.productName}</strong> is now active!</p>

          <div style="background: #F5F3F0; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0;"><strong>Billing:</strong> ${formatPrice(data.amount, data.currency)}/${data.billingInterval === 'year' ? 'year' : 'month'}</p>
          </div>

          ${data.accessInstructions ? `
            <div class="instructions">
              <h3 style="margin-top: 0;">Getting Started</h3>
              <p style="white-space: pre-wrap; margin: 0;">${data.accessInstructions}</p>
            </div>
          ` : ''}

          <p>You can manage your subscription at any time from your account.</p>
        </div>

        <div class="footer">
          <p>Questions? Reply to this email or contact us at <a href="mailto:kerrib@oceoluxe.com" style="color: #CDA7B2;">kerrib@oceoluxe.com</a></p>
          <p style="margin-top: 16px;">© ${new Date().getFullYear()} Oceoluxe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const subject = `Welcome to ${data.productName}!`;

  return { subject, html };
}
