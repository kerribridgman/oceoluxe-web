import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { emailTemplates } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET() {
  try {
    const templates = await db
      .select()
      .from(emailTemplates)
      .orderBy(desc(emailTemplates.createdAt));

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
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
      subject,
      body: templateBody,
      category,
      audienceType,
      attachments,
      fromEmail,
      fromName,
      variables,
      previewText,
    } = body;

    if (!name || !subject || !templateBody) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      );
    }

    const [template] = await db
      .insert(emailTemplates)
      .values({
        name,
        description: description || null,
        subject,
        body: templateBody,
        category: category || null,
        audienceType: audienceType || 'all',
        attachments: attachments
          ? (typeof attachments === 'string' ? attachments : JSON.stringify(attachments))
          : null,
        fromEmail: fromEmail || 'kerrib@oceoluxe.com',
        fromName: fromName || 'Kerri at Oceo Luxe',
        previewText: previewText || null,
        variables: variables
          ? (typeof variables === 'string' ? variables : JSON.stringify(variables))
          : null,
        createdBy: user.id,
        isActive: true,
      })
      .returning();

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
