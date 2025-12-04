import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getAllResources, createResource } from '@/lib/db/queries-resources';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    const category = searchParams.get('category');

    let resources = await getAllResources(includeUnpublished);

    if (category) {
      resources = resources.filter((r) => r.category === category);
    }

    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
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
      title,
      slug,
      description,
      content,
      category,
      thumbnailUrl,
      downloadUrl,
      notionUrl,
      fileType,
      isPublished,
      isFeatured,
      requiredSubscriptionTier,
    } = body;

    if (!title || !slug || !category) {
      return NextResponse.json(
        { error: 'Title, slug, and category are required' },
        { status: 400 }
      );
    }

    const resource = await createResource({
      title,
      slug,
      description,
      content,
      category,
      thumbnailUrl,
      downloadUrl,
      notionUrl,
      fileType,
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
      requiredSubscriptionTier,
      createdBy: user.id,
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
