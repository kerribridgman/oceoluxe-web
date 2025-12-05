import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';
import {
  courses,
  courseModules,
  lessons,
  enrollments,
  lessonCompletions,
} from '@/lib/db/schema';
import { eq, and, asc, inArray } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; lessonSlug: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug: courseSlug, lessonSlug } = await params;

    // Get the course
    const course = await db.query.courses.findFirst({
      where: and(eq(courses.slug, courseSlug), eq(courses.isPublished, true)),
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get all modules for this course
    const modules = await db.query.courseModules.findMany({
      where: eq(courseModules.courseId, course.id),
    });

    const moduleIds = modules.map((m) => m.id);

    // Get the lesson by slug (lessons are in modules, not directly in courses)
    const lesson = await db.query.lessons.findFirst({
      where: and(
        eq(lessons.slug, lessonSlug),
        moduleIds.length > 0 ? inArray(lessons.moduleId, moduleIds) : undefined
      ),
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Check enrollment (unless lesson is free preview)
    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, user.id),
        eq(enrollments.courseId, course.id)
      ),
    });

    const isEnrolled = !!enrollment;
    const canAccess = isEnrolled || lesson.isPreview;

    if (!canAccess) {
      return NextResponse.json(
        { error: 'You must enroll in this course to access this lesson' },
        { status: 403 }
      );
    }

    // Check if lesson is completed
    const completion = await db.query.lessonCompletions.findFirst({
      where: and(
        eq(lessonCompletions.userId, user.id),
        eq(lessonCompletions.lessonId, lesson.id)
      ),
    });

    // Get all lessons for this course (for navigation)
    const allLessons =
      moduleIds.length > 0
        ? await db.query.lessons.findMany({
            where: inArray(lessons.moduleId, moduleIds),
            orderBy: [asc(lessons.displayOrder)],
          })
        : [];

    // Get completion status for all lessons
    const completions = await db
      .select({ lessonId: lessonCompletions.lessonId })
      .from(lessonCompletions)
      .where(eq(lessonCompletions.userId, user.id));

    const completedIds = new Set(completions.map((c) => c.lessonId));

    // Find previous and next lessons
    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
    const previousLesson =
      currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        durationMinutes: lesson.videoDurationMinutes,
        isCompleted: !!completion,
        pointsReward: lesson.pointsReward,
      },
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
      },
      previousLesson: previousLesson
        ? { slug: previousLesson.slug, title: previousLesson.title }
        : null,
      nextLesson: nextLesson
        ? { slug: nextLesson.slug, title: nextLesson.title }
        : null,
      allLessons: allLessons.map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        isCompleted: completedIds.has(l.id),
        durationMinutes: l.videoDurationMinutes,
      })),
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
