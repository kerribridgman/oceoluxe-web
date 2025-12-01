import { sendEmail } from './sendgrid';
import { generatePurchaseConfirmationEmail, generateSubscriptionWelcomeEmail } from './templates';

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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oceoluxe.com';

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
