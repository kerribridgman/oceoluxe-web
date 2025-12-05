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
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    // Get the course
    const course = await db.query.courses.findFirst({
      where: and(eq(courses.slug, slug), eq(courses.isPublished, true)),
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is enrolled
    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, user.id),
        eq(enrollments.courseId, course.id)
      ),
    });

    const isEnrolled = !!enrollment;

    // Get all modules with lessons
    const modules = await db.query.courseModules.findMany({
      where: eq(courseModules.courseId, course.id),
      orderBy: [asc(courseModules.displayOrder)],
    });

    // Get all lessons for the course (through modules)
    const moduleIds = modules.map((m) => m.id);
    const allLessons =
      moduleIds.length > 0
        ? await db.query.lessons.findMany({
            orderBy: [asc(lessons.displayOrder)],
          })
        : [];

    // Filter lessons to those in this course's modules
    const courseLessons = allLessons.filter((l) =>
      moduleIds.includes(l.moduleId)
    );

    // Get completed lessons for this user
    const completedLessonsData = isEnrolled
      ? await db
          .select({ lessonId: lessonCompletions.lessonId })
          .from(lessonCompletions)
          .where(eq(lessonCompletions.userId, user.id))
      : [];

    const completedLessonIds = new Set(
      completedLessonsData.map((c) => c.lessonId)
    );

    // Build modules with lessons
    const modulesWithLessons = modules.map((module) => {
      const moduleLessons = courseLessons
        .filter((l) => l.moduleId === module.id)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.description,
          durationMinutes: lesson.videoDurationMinutes,
          displayOrder: lesson.displayOrder,
          isCompleted: completedLessonIds.has(lesson.id),
          isFree: lesson.isPreview ?? false,
        }));

      return {
        id: module.id,
        title: module.title,
        description: module.description,
        displayOrder: module.displayOrder,
        lessons: moduleLessons,
      };
    });

    // Calculate progress
    const totalLessons = courseLessons.length;
    const completedCount = courseLessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;
    const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    // Find next lesson (first incomplete lesson)
    let nextLesson: { slug: string } | null = null;
    for (const module of modulesWithLessons) {
      for (const lesson of module.lessons) {
        if (!lesson.isCompleted && (isEnrolled || lesson.isFree)) {
          nextLesson = { slug: lesson.slug };
          break;
        }
      }
      if (nextLesson) break;
    }

    // If all lessons complete, set next to first lesson
    if (!nextLesson && courseLessons.length > 0) {
      nextLesson = { slug: courseLessons[0].slug };
    }

    return NextResponse.json({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnailUrl: course.coverImageUrl,
      difficulty: course.difficulty,
      isEnrolled,
      progress,
      totalLessons,
      completedLessons: completedCount,
      modules: modulesWithLessons,
      nextLesson,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
