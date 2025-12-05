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
import { eq, count, and, sum } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all published courses
    const allCourses = await db.query.courses.findMany({
      where: eq(courses.isPublished, true),
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    // Get user's enrollments
    const userEnrollments = await db
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.userId, user.id));

    const enrolledCourseIds = new Set(userEnrollments.map((e) => e.courseId));

    // For each course, get lesson count and duration
    const coursesWithDetails = await Promise.all(
      allCourses.map(async (course) => {
        // Get total lessons and duration (lessons are in modules, modules are in courses)
        const lessonStats = await db
          .select({
            count: count(),
            totalDuration: sum(lessons.videoDurationMinutes),
          })
          .from(lessons)
          .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
          .where(eq(courseModules.courseId, course.id));

        const totalLessons = lessonStats[0]?.count ?? 0;
        const estimatedDuration = lessonStats[0]?.totalDuration
          ? Number(lessonStats[0].totalDuration)
          : course.estimatedMinutes;

        const isEnrolled = enrolledCourseIds.has(course.id);

        // Calculate progress if enrolled
        let progress: number | null = null;
        if (isEnrolled && totalLessons > 0) {
          const completedCount = await db
            .select({ count: count() })
            .from(lessonCompletions)
            .innerJoin(lessons, eq(lessonCompletions.lessonId, lessons.id))
            .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
            .where(
              and(
                eq(lessonCompletions.userId, user.id),
                eq(courseModules.courseId, course.id)
              )
            );

          progress =
            ((completedCount[0]?.count ?? 0) / totalLessons) * 100;
        }

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          thumbnailUrl: course.coverImageUrl,
          difficulty: course.difficulty,
          totalLessons,
          estimatedDuration,
          isEnrolled,
          progress,
        };
      })
    );

    return NextResponse.json(coursesWithDetails);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
