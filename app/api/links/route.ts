import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { linkSettings } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq } from 'drizzle-orm';

// GET /api/links - Fetch all link settings
export async function GET() {
  try {
    const links = await db.select().from(linkSettings);

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching link settings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch link settings' },
      { status: 500 }
    );
  }
}

// PUT /api/links - Update link settings
export async function PUT(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin/owner
  if (user.role !== 'owner' && user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { links } = body;

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Update each link
    for (const link of links) {
      await db
        .update(linkSettings)
        .set({
          label: link.label,
          url: link.url,
          updatedBy: user.id,
          updatedAt: new Date(),
        })
        .where(eq(linkSettings.key, link.key));
    }

    return NextResponse.json({ message: 'Link settings updated successfully' });
  } catch (error) {
    console.error('Error updating link settings:', error);
    return NextResponse.json(
      { message: 'Failed to update link settings' },
      { status: 500 }
    );
  }
}
