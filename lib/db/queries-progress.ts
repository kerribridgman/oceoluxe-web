import { eq, and, desc, sql, asc } from 'drizzle-orm';
import { db } from './drizzle';
import {
  lessonCompletions,
  lessons,
  courseModules,
  courses,
  enrollments,
  userProfiles,
  pointsTransactions,
  LessonCompletion,
  NewLessonCompletion,
  UserProfile,
  NewUserProfile,
} from './schema';

// =============================================
// LESSON COMPLETION QUERIES
// =============================================

export async function markLessonComplete(
  userId: number,
  lessonId: number,
  timeSpentMinutes?: number
): Promise<LessonCompletion> {
  // Get the lesson to check points reward
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  const pointsAwarded = lesson?.pointsReward || 10;

  const [completion] = await db
    .insert(lessonCompletions)
    .values({
      userId,
      lessonId,
      timeSpentMinutes,
      pointsAwarded,
    })
    .onConflictDoUpdate({
      target: [lessonCompletions.userId, lessonCompletions.lessonId],
      set: {
        completedAt: new Date(),
        timeSpentMinutes,
      },
    })
    .returning();

  // Award points
  if (pointsAwarded > 0) {
    await awardPoints(userId, pointsAwarded, 'lesson_complete', 'lesson', lessonId);
  }

  // Update course progress
  await updateCourseProgressFromLesson(userId, lessonId);

  return completion;
}

export async function isLessonComplete(
  userId: number,
  lessonId: number
): Promise<boolean> {
  const [completion] = await db
    .select()
    .from(lessonCompletions)
    .where(
      and(
        eq(lessonCompletions.userId, userId),
        eq(lessonCompletions.lessonId, lessonId)
      )
    )
    .limit(1);

  return completion !== null;
}

export async function getUserLessonCompletions(userId: number) {
  return await db.query.lessonCompletions.findMany({
    where: eq(lessonCompletions.userId, userId),
    with: {
      lesson: true,
    },
    orderBy: [desc(lessonCompletions.completedAt)],
  });
}

export async function getUserCompletedLessonIds(userId: number): Promise<number[]> {
  const completions = await db
    .select({ lessonId: lessonCompletions.lessonId })
    .from(lessonCompletions)
    .where(eq(lessonCompletions.userId, userId));

  return completions.map((c) => c.lessonId);
}

export async function getCourseProgress(userId: number, courseId: number) {
  // Get all lessons in the course
  const courseLessons = await db
    .select({ lessonId: lessons.id })
    .from(lessons)
    .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
    .where(eq(courseModules.courseId, courseId));

  if (courseLessons.length === 0) {
    return { completedLessons: 0, totalLessons: 0, progressPercent: 0 };
  }

  const lessonIds = courseLessons.map((l) => l.lessonId);

  // Get completed lessons for this user in this course
  const completedLessons = await db
    .select()
    .from(lessonCompletions)
    .where(
      and(
        eq(lessonCompletions.userId, userId),
        sql`${lessonCompletions.lessonId} = ANY(${lessonIds})`
      )
    );

  const progressPercent = Math.round(
    (completedLessons.length / courseLessons.length) * 100
  );

  return {
    completedLessons: completedLessons.length,
    totalLessons: courseLessons.length,
    progressPercent,
  };
}

async function updateCourseProgressFromLesson(userId: number, lessonId: number) {
  // Find which course this lesson belongs to
  const [lessonInfo] = await db
    .select({
      courseId: courseModules.courseId,
    })
    .from(lessons)
    .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lessonInfo) return;

  // Calculate new progress
  const progress = await getCourseProgress(userId, lessonInfo.courseId);

  // Update enrollment progress
  await db
    .update(enrollments)
    .set({
      progressPercent: progress.progressPercent,
      completedAt: progress.progressPercent >= 100 ? new Date() : null,
    })
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, lessonInfo.courseId)
      )
    );

  // If course completed, award bonus points
  if (progress.progressPercent >= 100) {
    await awardPoints(
      userId,
      50,
      'course_complete',
      'course',
      lessonInfo.courseId
    );
  }
}

// =============================================
// USER PROFILE QUERIES
// =============================================

export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  return profile || null;
}

export async function getOrCreateUserProfile(userId: number): Promise<UserProfile> {
  let profile = await getUserProfile(userId);

  if (!profile) {
    [profile] = await db
      .insert(userProfiles)
      .values({ userId })
      .returning();
  }

  return profile;
}

export async function updateUserProfile(
  userId: number,
  data: Partial<NewUserProfile>
): Promise<UserProfile | null> {
  const [updated] = await db
    .update(userProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(userProfiles.userId, userId))
    .returning();

  return updated || null;
}

// =============================================
// POINTS SYSTEM
// =============================================

export async function awardPoints(
  userId: number,
  amount: number,
  reason: string,
  referenceType?: string,
  referenceId?: number
) {
  // Create transaction record
  await db.insert(pointsTransactions).values({
    userId,
    amount,
    reason,
    referenceType,
    referenceId,
  });

  // Update user profile points
  const profile = await getOrCreateUserProfile(userId);

  await db
    .update(userProfiles)
    .set({
      points: profile.points + amount,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.userId, userId));
}

export async function deductPoints(
  userId: number,
  amount: number,
  reason: string,
  referenceType?: string,
  referenceId?: number
) {
  await awardPoints(userId, -amount, reason, referenceType, referenceId);
}

export async function getUserPoints(userId: number): Promise<number> {
  const profile = await getUserProfile(userId);
  return profile?.points || 0;
}

export async function getPointsHistory(userId: number, limit = 50) {
  return await db
    .select()
    .from(pointsTransactions)
    .where(eq(pointsTransactions.userId, userId))
    .orderBy(desc(pointsTransactions.createdAt))
    .limit(limit);
}

// =============================================
// LEADERBOARD
// =============================================

export async function getLeaderboard(limit = 10) {
  return await db.query.userProfiles.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [desc(userProfiles.points)],
    limit,
  });
}

export async function getUserRank(userId: number): Promise<number | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const [result] = await db
    .select({ count: sql<number>`count(*)::int + 1` })
    .from(userProfiles)
    .where(sql`${userProfiles.points} > ${profile.points}`);

  return result?.count || 1;
}

// =============================================
// STREAK TRACKING
// =============================================

export async function updateStreak(userId: number) {
  const profile = await getOrCreateUserProfile(userId);

  const now = new Date();
  const lastActivity = profile.lastActivityAt;

  if (!lastActivity) {
    // First activity
    await db
      .update(userProfiles)
      .set({
        streak: 1,
        lastActivityAt: now,
        updatedAt: now,
      })
      .where(eq(userProfiles.userId, userId));
    return 1;
  }

  const daysSinceLastActivity = Math.floor(
    (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );

  let newStreak = profile.streak;

  if (daysSinceLastActivity === 0) {
    // Same day, no change
    return profile.streak;
  } else if (daysSinceLastActivity === 1) {
    // Consecutive day, increase streak
    newStreak = profile.streak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  await db
    .update(userProfiles)
    .set({
      streak: newStreak,
      lastActivityAt: now,
      updatedAt: now,
    })
    .where(eq(userProfiles.userId, userId));

  return newStreak;
}

// =============================================
// OVERALL STATS
// =============================================

export async function getUserProgressStats(userId: number) {
  const profile = await getUserProfile(userId);
  const completions = await getUserLessonCompletions(userId);

  // Get enrollment stats
  const userEnrollments = await db.query.enrollments.findMany({
    where: eq(enrollments.userId, userId),
  });

  const completedCourses = userEnrollments.filter(
    (e) => e.completedAt !== null
  ).length;

  const totalTimeSpent = completions.reduce(
    (acc, c) => acc + (c.timeSpentMinutes || 0),
    0
  );

  const rank = await getUserRank(userId);

  return {
    points: profile?.points || 0,
    streak: profile?.streak || 0,
    lessonsCompleted: completions.length,
    coursesCompleted: completedCourses,
    coursesInProgress: userEnrollments.length - completedCourses,
    totalTimeSpentMinutes: totalTimeSpent,
    rank,
  };
}
