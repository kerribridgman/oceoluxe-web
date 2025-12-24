import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { dripCampaigns, dripCampaignSteps, emailTemplates, dripEnrollments } from '@/lib/db/schema';
import { desc, eq, sql, count } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET() {
  try {
    // Get all drip campaigns with step count and enrollment count
    const drips = await db
      .select({
        id: dripCampaigns.id,
        name: dripCampaigns.name,
        description: dripCampaigns.description,
        triggerType: dripCampaigns.triggerType,
        triggerFilter: dripCampaigns.triggerFilter,
        audienceType: dripCampaigns.audienceType,
        isActive: dripCampaigns.isActive,
        createdAt: dripCampaigns.createdAt,
        updatedAt: dripCampaigns.updatedAt,
      })
      .from(dripCampaigns)
      .orderBy(desc(dripCampaigns.createdAt));

    // Get step counts and enrollment counts for each drip
    const dripsWithCounts = await Promise.all(
      drips.map(async (drip) => {
        const [stepCount] = await db
          .select({ count: count() })
          .from(dripCampaignSteps)
          .where(eq(dripCampaignSteps.dripCampaignId, drip.id));

        const [enrollmentCount] = await db
          .select({ count: count() })
          .from(dripEnrollments)
          .where(eq(dripEnrollments.dripCampaignId, drip.id));

        return {
          ...drip,
          stepCount: stepCount?.count || 0,
          enrollmentCount: enrollmentCount?.count || 0,
        };
      })
    );

    return NextResponse.json(dripsWithCounts);
  } catch (error) {
    console.error('Error fetching drip campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drip campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      triggerType,
      triggerFilter,
      audienceType,
    } = body;

    if (!name || !triggerType || !audienceType) {
      return NextResponse.json(
        { error: 'Name, trigger type, and audience type are required' },
        { status: 400 }
      );
    }

    const [drip] = await db
      .insert(dripCampaigns)
      .values({
        name,
        description: description || null,
        triggerType,
        triggerFilter: triggerFilter ? JSON.stringify(triggerFilter) : null,
        audienceType,
        isActive: false,
        createdBy: user.id,
      })
      .returning();

    return NextResponse.json(drip, { status: 201 });
  } catch (error) {
    console.error('Error creating drip campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create drip campaign' },
      { status: 500 }
    );
  }
}
