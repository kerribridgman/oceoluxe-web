import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';

// This route can be used to track course access if needed in the future
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, just acknowledge the access
    // In the future, this could update a lastAccessedAt field or track analytics
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating access time:', error);
    return NextResponse.json(
      { error: 'Failed to update access' },
      { status: 500 }
    );
  }
}
