import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { createLesson, getLessonsByModuleId } from '@/lib/db/queries-courses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const id = parseInt(moduleId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }

    const lessons = await getLessonsByModuleId(id);
    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = await params;
    const id = parseInt(moduleId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid module ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, slug, description, content, videoUrl, videoDurationMinutes, lessonType, displayOrder, isPreview, pointsReward } = body;

    const lesson = await createLesson({
      moduleId: id,
      title: title || 'New Lesson',
      slug: slug || `lesson-${Date.now()}`,
      description,
      content,
      videoUrl,
      videoDurationMinutes,
      lessonType: lessonType || 'video',
      displayOrder: displayOrder || 0,
      isPreview: isPreview || false,
      pointsReward: pointsReward || 10,
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
