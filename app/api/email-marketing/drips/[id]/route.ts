import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { dripCampaigns, dripCampaignSteps, emailTemplates } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dripId = parseInt(id, 10);

    if (isNaN(dripId)) {
      return NextResponse.json({ error: 'Invalid drip campaign ID' }, { status: 400 });
    }

    const [drip] = await db
      .select()
      .from(dripCampaigns)
      .where(eq(dripCampaigns.id, dripId))
      .limit(1);

    if (!drip) {
      return NextResponse.json({ error: 'Drip campaign not found' }, { status: 404 });
    }

    // Get all steps for this drip campaign with template info
    const steps = await db
      .select({
        id: dripCampaignSteps.id,
        dripCampaignId: dripCampaignSteps.dripCampaignId,
        templateId: dripCampaignSteps.templateId,
        stepOrder: dripCampaignSteps.stepOrder,
        delayDays: dripCampaignSteps.delayDays,
        delayHours: dripCampaignSteps.delayHours,
        sendTime: dripCampaignSteps.sendTime,
        isActive: dripCampaignSteps.isActive,
        templateName: emailTemplates.name,
        templateSubject: emailTemplates.subject,
      })
      .from(dripCampaignSteps)
      .leftJoin(emailTemplates, eq(dripCampaignSteps.templateId, emailTemplates.id))
      .where(eq(dripCampaignSteps.dripCampaignId, dripId))
      .orderBy(asc(dripCampaignSteps.stepOrder));

    return NextResponse.json({ ...drip, steps });
  } catch (error) {
    console.error('Error fetching drip campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drip campaign' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const dripId = parseInt(id, 10);

    if (isNaN(dripId)) {
      return NextResponse.json({ error: 'Invalid drip campaign ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      description,
      triggerType,
      triggerFilter,
      audienceType,
      isActive,
      steps,
    } = body;

    // Update the drip campaign
    const [drip] = await db
      .update(dripCampaigns)
      .set({
        name,
        description,
        triggerType,
        triggerFilter: triggerFilter ? JSON.stringify(triggerFilter) : null,
        audienceType,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(dripCampaigns.id, dripId))
      .returning();

    if (!drip) {
      return NextResponse.json({ error: 'Drip campaign not found' }, { status: 404 });
    }

    // If steps are provided, update them
    if (steps && Array.isArray(steps)) {
      // Delete existing steps
      await db.delete(dripCampaignSteps).where(eq(dripCampaignSteps.dripCampaignId, dripId));

      // Insert new steps
      if (steps.length > 0) {
        await db.insert(dripCampaignSteps).values(
          steps.map((step: { templateId: number; stepOrder: number; delayDays: number; delayHours: number; sendTime?: string; isActive?: boolean }) => ({
            dripCampaignId: dripId,
            templateId: step.templateId,
            stepOrder: step.stepOrder,
            delayDays: step.delayDays || 0,
            delayHours: step.delayHours || 0,
            sendTime: step.sendTime || null,
            isActive: step.isActive !== false,
          }))
        );
      }
    }

    return NextResponse.json(drip);
  } catch (error) {
    console.error('Error updating drip campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update drip campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const dripId = parseInt(id, 10);

    if (isNaN(dripId)) {
      return NextResponse.json({ error: 'Invalid drip campaign ID' }, { status: 400 });
    }

    // Delete steps first (cascade should handle this, but being explicit)
    await db.delete(dripCampaignSteps).where(eq(dripCampaignSteps.dripCampaignId, dripId));

    // Delete the drip campaign
    const [deleted] = await db
      .delete(dripCampaigns)
      .where(eq(dripCampaigns.id, dripId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Drip campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting drip campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete drip campaign' },
      { status: 500 }
    );
  }
}
