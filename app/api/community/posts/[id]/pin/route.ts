import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { pinPost } from '@/lib/db/queries-community';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const body = await request.json();
    const { isPinned } = body;

    const post = await pinPost(postId, isPinned);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error pinning post:', error);
    return NextResponse.json(
      { error: 'Failed to pin post' },
      { status: 500 }
    );
  }
}
