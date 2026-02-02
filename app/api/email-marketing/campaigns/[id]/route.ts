import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { campaigns } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignId = parseInt(id, 10);

    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }

    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
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
    const campaignId = parseInt(id, 10);

    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      subject,
      body: campaignBody,
      templateId,
      audienceType,
      audienceFilter,
      attachments,
      fromEmail,
      fromName,
      previewText,
      status,
      scheduledAt,
    } = body;

    const [campaign] = await db
      .update(campaigns)
      .set({
        name,
        subject,
        body: campaignBody,
        templateId,
        audienceType,
        audienceFilter: audienceFilter ? JSON.stringify(audienceFilter) : null,
        attachments: attachments
          ? (typeof attachments === 'string' ? attachments : JSON.stringify(attachments))
          : null,
        fromEmail,
        fromName,
        previewText: previewText !== undefined ? previewText : undefined,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(campaigns.id, campaignId))
      .returning();

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
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
    const campaignId = parseInt(id, 10);

    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }

    // Only allow deleting draft campaigns
    const [existing] = await db
      .select({ status: campaigns.status })
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (existing.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft campaigns can be deleted' },
        { status: 400 }
      );
    }

    const [deleted] = await db
      .delete(campaigns)
      .where(eq(campaigns.id, campaignId))
      .returning();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
