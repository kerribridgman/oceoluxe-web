import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { createModule, getModulesByCourseId } from '@/lib/db/queries-courses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const modules = await getModulesByCourseId(courseId);
    return NextResponse.json({ modules });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, displayOrder } = body;

    const module = await createModule({
      courseId,
      title: title || 'New Module',
      description,
      displayOrder: displayOrder || 0,
    });

    return NextResponse.json({ module }, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
