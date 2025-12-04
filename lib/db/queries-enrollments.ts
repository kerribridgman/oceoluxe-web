import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './drizzle';
import {
  enrollments,
  courses,
  courseModules,
  lessons,
  lessonCompletions,
  Enrollment,
  NewEnrollment,
} from './schema';

// =============================================
// ENROLLMENT QUERIES
// =============================================

export async function getUserEnrollments(userId: number) {
  return await db.query.enrollments.findMany({
    where: eq(enrollments.userId, userId),
    with: {
      course: true,
    },
    orderBy: [desc(enrollments.enrolledAt)],
  });
}

export async function getEnrollment(userId: number, courseId: number) {
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    )
    .limit(1);

  return enrollment || null;
}

export async function getEnrollmentWithCourse(userId: number, courseId: number) {
  const enrollment = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.userId, userId),
      eq(enrollments.courseId, courseId)
    ),
    with: {
      course: {
        with: {
          modules: {
            with: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  return enrollment || null;
}

export async function isUserEnrolled(
  userId: number,
  courseId: number
): Promise<boolean> {
  const enrollment = await getEnrollment(userId, courseId);
  return enrollment !== null;
}

export async function enrollUser(data: NewEnrollment): Promise<Enrollment> {
  const [enrollment] = await db.insert(enrollments).values(data).returning();
  return enrollment;
}

export async function unenrollUser(
  userId: number,
  courseId: number
): Promise<boolean> {
  const result = await db
    .delete(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    )
    .returning();

  return result.length > 0;
}

export async function updateEnrollmentProgress(
  userId: number,
  courseId: number,
  progressPercent: number
): Promise<Enrollment | null> {
  const updateData: Partial<Enrollment> = {
    progressPercent,
  };

  // Mark as completed if 100%
  if (progressPercent >= 100) {
    updateData.completedAt = new Date();
  }

  const [updated] = await db
    .update(enrollments)
    .set(updateData)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    )
    .returning();

  return updated || null;
}

export async function markEnrollmentComplete(
  userId: number,
  courseId: number
): Promise<Enrollment | null> {
  const [updated] = await db
    .update(enrollments)
    .set({
      progressPercent: 100,
      completedAt: new Date(),
    })
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    )
    .returning();

  return updated || null;
}

// =============================================
// ENROLLMENT STATISTICS
// =============================================

export async function getCourseEnrollmentCount(courseId: number): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(enrollments)
    .where(eq(enrollments.courseId, courseId));

  return result?.count || 0;
}

export async function getCourseCompletionCount(courseId: number): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.courseId, courseId),
        sql`${enrollments.completedAt} IS NOT NULL`
      )
    );

  return result?.count || 0;
}

export async function getUserCompletedCourseCount(userId: number): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        sql`${enrollments.completedAt} IS NOT NULL`
      )
    );

  return result?.count || 0;
}

export async function getUserEnrollmentStats(userId: number) {
  const userEnrollments = await getUserEnrollments(userId);

  const totalEnrollments = userEnrollments.length;
  const completedCourses = userEnrollments.filter(
    (e) => e.completedAt !== null
  ).length;
  const inProgressCourses = userEnrollments.filter(
    (e) => e.completedAt === null && (e.progressPercent ?? 0) > 0
  ).length;

  const averageProgress =
    totalEnrollments > 0
      ? userEnrollments.reduce((acc, e) => acc + (e.progressPercent ?? 0), 0) /
        totalEnrollments
      : 0;

  return {
    totalEnrollments,
    completedCourses,
    inProgressCourses,
    averageProgress: Math.round(averageProgress),
  };
}

// =============================================
// ADMIN QUERIES
// =============================================

export async function getAllEnrollments(limit = 50, offset = 0) {
  return await db.query.enrollments.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        columns: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: [desc(enrollments.enrolledAt)],
    limit,
    offset,
  });
}

export async function getEnrollmentsByCourse(courseId: number) {
  return await db.query.enrollments.findMany({
    where: eq(enrollments.courseId, courseId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [desc(enrollments.enrolledAt)],
  });
}

export async function getRecentEnrollments(limit = 10) {
  return await db.query.enrollments.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        columns: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: [desc(enrollments.enrolledAt)],
    limit,
  });
}
