import { NextRequest, NextResponse } from 'next/server';
import { inArray } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { emailList } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

// POST /api/email-marketing/contacts/bulk-delete - Delete contacts by email
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { emails } = body as { emails: string[] };

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'A non-empty array of emails is required' },
        { status: 400 }
      );
    }

    // Cap at 500 per request to prevent abuse
    if (emails.length > 500) {
      return NextResponse.json(
        { error: 'Maximum 500 contacts can be deleted at once' },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(emailList)
      .where(inArray(emailList.email, emails))
      .returning({ email: emailList.email });

    return NextResponse.json({
      success: true,
      deleted: deleted.length,
    });
  } catch (error: any) {
    console.error('Error bulk deleting contacts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete contacts' },
      { status: 500 }
    );
  }
}
