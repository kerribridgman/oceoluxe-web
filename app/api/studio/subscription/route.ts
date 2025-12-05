import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';
import { educationSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for active education subscription
    const subscription = await db.query.educationSubscriptions.findFirst({
      where: eq(educationSubscriptions.userId, user.id),
    });

    // Subscription is active if status is 'active' or 'trialing'
    // and if there's a currentPeriodEnd, it should be in the future
    const isActive =
      subscription &&
      ['active', 'trialing'].includes(subscription.status) &&
      (!subscription.currentPeriodEnd ||
        new Date(subscription.currentPeriodEnd) > new Date());

    return NextResponse.json({
      hasSubscription: !!subscription,
      isActive,
      subscription: subscription
        ? {
            tier: subscription.tier,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          }
        : null,
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    );
  }
}
