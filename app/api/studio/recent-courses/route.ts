import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';
import {
  enrollments,
  courses,
  courseModules,
  lessons,
  lessonCompletions,
} from '@/lib/db/schema';
import { eq, desc, count, and, inArray } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's enrolled courses with progress
    const enrolledCourses = await db
      .select({
        enrollment: enrollments,
        course: courses,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, user.id))
      .orderBy(desc(enrollments.enrolledAt))
      .limit(6);

    // For each course, calculate progress
    const coursesWithProgress = await Promise.all(
      enrolledCourses.map(async ({ enrollment, course }) => {
        // Get all modules for this course
        const modules = await db.query.courseModules.findMany({
          where: eq(courseModules.courseId, course.id),
        });

        const moduleIds = modules.map((m) => m.id);

        // Get total lessons in course (through modules)
        const totalLessonsResult =
          moduleIds.length > 0
            ? await db
                .select({ count: count() })
                .from(lessons)
                .where(inArray(lessons.moduleId, moduleIds))
            : [{ count: 0 }];

        const totalLessons = totalLessonsResult[0]?.count ?? 0;

        // Get completed lessons for this user in this course
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

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          thumbnailUrl: course.coverImageUrl,
          progress,
          totalLessons,
          completedLessons,
          enrolledAt: enrollment.enrolledAt.toISOString(),
        };
      })
    );

    return NextResponse.json(coursesWithProgress);
  } catch (error) {
    console.error('Error fetching recent courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
