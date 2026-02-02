import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { campaigns, emailTemplates } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET() {
  try {
    const allCampaigns = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        subject: campaigns.subject,
        body: campaigns.body,
        templateId: campaigns.templateId,
        audienceType: campaigns.audienceType,
        audienceFilter: campaigns.audienceFilter,
        attachments: campaigns.attachments,
        fromEmail: campaigns.fromEmail,
        fromName: campaigns.fromName,
        previewText: campaigns.previewText,
        status: campaigns.status,
        scheduledAt: campaigns.scheduledAt,
        sentAt: campaigns.sentAt,
        totalRecipients: campaigns.totalRecipients,
        totalSent: campaigns.totalSent,
        totalDelivered: campaigns.totalDelivered,
        totalOpened: campaigns.totalOpened,
        totalClicked: campaigns.totalClicked,
        totalBounced: campaigns.totalBounced,
        totalUnsubscribed: campaigns.totalUnsubscribed,
        createdAt: campaigns.createdAt,
        updatedAt: campaigns.updatedAt,
      })
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt));

    return NextResponse.json(allCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
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
      subject,
      body: campaignBody,
      templateId,
      audienceType,
      audienceFilter,
      attachments,
      fromEmail,
      fromName,
      previewText,
      scheduledAt,
    } = body;

    if (!name || !subject || !campaignBody || !audienceType) {
      return NextResponse.json(
        { error: 'Name, subject, body, and audience type are required' },
        { status: 400 }
      );
    }

    const [campaign] = await db
      .insert(campaigns)
      .values({
        name,
        subject,
        body: campaignBody,
        templateId: templateId || null,
        audienceType,
        audienceFilter: audienceFilter ? JSON.stringify(audienceFilter) : null,
        attachments: attachments
          ? (typeof attachments === 'string' ? attachments : JSON.stringify(attachments))
          : null,
        fromEmail: fromEmail || 'kerrib@oceoluxe.com',
        fromName: fromName || 'Kerri at Oceo Luxe',
        previewText: previewText || null,
        status: 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        createdBy: user.id,
      })
      .returning();

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
