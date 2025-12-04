import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getLessonById, updateLesson, deleteLesson } from '@/lib/db/queries-courses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const id = parseInt(lessonId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    const lesson = await getLessonById(id);

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const id = parseInt(lessonId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    const body = await request.json();
    const lesson = await updateLesson(id, body);

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const id = parseInt(lessonId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    const deleted = await deleteLesson(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}
