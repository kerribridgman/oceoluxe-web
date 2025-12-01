import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getPurchaseById, markDeliveryEmailSent } from '@/lib/db/queries-purchases';
import { sendPurchaseConfirmationEmail, sendSubscriptionWelcomeEmail } from '@/lib/email/purchase-emails';

// GET /api/purchases/[id] - Get purchase details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const purchase = await getPurchaseById(id);

    if (!purchase) {
      return NextResponse.json({ message: 'Purchase not found' }, { status: 404 });
    }

    return NextResponse.json({ purchase });
  } catch (error: any) {
    console.error('Error fetching purchase:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch purchase' },
      { status: 500 }
    );
  }
}

// POST /api/purchases/[id] - Resend delivery email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const purchase = await getPurchaseById(id);

    if (!purchase) {
      return NextResponse.json({ message: 'Purchase not found' }, { status: 404 });
    }

    const product = purchase.mainProduct;
    const isSubscription = !!purchase.stripeSubscriptionId;

    const emailFn = isSubscription ? sendSubscriptionWelcomeEmail : sendPurchaseConfirmationEmail;

    const emailResult = await emailFn(
      {
        name: product.name,
        description: product.shortDescription,
        deliveryType: product.deliveryType,
        downloadUrl: product.downloadUrl,
        accessInstructions: product.accessInstructions,
      },
      {
        customerEmail: purchase.customerEmail,
        customerName: purchase.customerName,
        amountPaidCents: purchase.amountPaidCents,
        currency: purchase.currency,
        isSubscription,
        billingInterval: purchase.billingInterval as 'month' | 'year' | null,
      },
      product.slug
    );

    if (!emailResult.success) {
      return NextResponse.json(
        { message: `Failed to send email: ${emailResult.error}` },
        { status: 500 }
      );
    }

    await markDeliveryEmailSent(id);

    return NextResponse.json({ message: 'Delivery email resent successfully' });
  } catch (error: any) {
    console.error('Error resending delivery email:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to resend delivery email' },
      { status: 500 }
    );
  }
}
