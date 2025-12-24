import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { emailTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateId = parseInt(id, 10);

    if (isNaN(templateId)) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
    }

    const [template] = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.id, templateId))
      .limit(1);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
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
    const templateId = parseInt(id, 10);

    if (isNaN(templateId)) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
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
      isActive,
    } = body;

    const [template] = await db
      .update(emailTemplates)
      .set({
        name,
        description,
        subject,
        body: templateBody,
        category,
        audienceType,
        attachments: attachments ? JSON.stringify(attachments) : null,
        fromEmail,
        fromName,
        variables: variables ? JSON.stringify(variables) : null,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(emailTemplates.id, templateId))
      .returning();

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
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
    const templateId = parseInt(id, 10);

    if (isNaN(templateId)) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(emailTemplates)
      .where(eq(emailTemplates.id, templateId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
