import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';
import {
  courses,
  courseModules,
  lessons,
  enrollments,
  lessonCompletions,
} from '@/lib/db/schema';
import { eq, and, count, desc, asc, inArray } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all enrolled courses
    const enrolledCourses = await db
      .select({
        enrollment: enrollments,
        course: courses,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, user.id))
      .orderBy(desc(enrollments.enrolledAt));

    // For each course, calculate progress and find next lesson
    const coursesWithProgress = await Promise.all(
      enrolledCourses.map(async ({ enrollment, course }) => {
        // Get all modules for this course
        const modules = await db.query.courseModules.findMany({
          where: eq(courseModules.courseId, course.id),
        });

        const moduleIds = modules.map((m) => m.id);

        // Get total lessons (through modules)
        const totalLessonsResult =
          moduleIds.length > 0
            ? await db
                .select({ count: count() })
                .from(lessons)
                .where(inArray(lessons.moduleId, moduleIds))
            : [{ count: 0 }];

        const totalLessons = totalLessonsResult[0]?.count ?? 0;

        // Get completed lessons
        const completedLessonsResult =
          moduleIds.length > 0
            ? await db
                .select({ count: count() })
                .from(lessonCompletions)
                .innerJoin(lessons, eq(lessonCompletions.lessonId, lessons.id))
                .where(
                  and(
                    eq(lessonCompletions.userId, user.id),
                    inArray(lessons.moduleId, moduleIds)
                  )
                )
            : [{ count: 0 }];

        const completedLessons = completedLessonsResult[0]?.count ?? 0;
        const progress =
          totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        // Find next lesson (first incomplete)
        const allLessons =
          moduleIds.length > 0
            ? await db.query.lessons.findMany({
                where: inArray(lessons.moduleId, moduleIds),
                orderBy: [asc(lessons.displayOrder)],
              })
            : [];

        const completedIds = await db
          .select({ lessonId: lessonCompletions.lessonId })
          .from(lessonCompletions)
          .where(eq(lessonCompletions.userId, user.id));

        const completedIdSet = new Set(completedIds.map((c) => c.lessonId));

        const nextLesson = allLessons.find((l) => !completedIdSet.has(l.id));

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          thumbnailUrl: course.coverImageUrl,
          difficulty: course.difficulty,
          progress,
          totalLessons,
          completedLessons,
          enrolledAt: enrollment.enrolledAt.toISOString(),
          nextLessonSlug: nextLesson?.slug ?? allLessons[0]?.slug ?? null,
        };
      })
    );

    return NextResponse.json(coursesWithProgress);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
