import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './drizzle';
import {
  achievements,
  userAchievements,
  lessonCompletions,
  enrollments,
  communityPosts,
  userProfiles,
  Achievement,
  NewAchievement,
  UserAchievement,
} from './schema';
import { awardPoints } from './queries-progress';

// =============================================
// ACHIEVEMENT DEFINITION QUERIES
// =============================================

export async function getAllAchievements(includeSecret = false) {
  if (includeSecret) {
    return await db
      .select()
      .from(achievements)
      .orderBy(achievements.triggerType, achievements.triggerValue);
  }

  return await db
    .select()
    .from(achievements)
    .where(eq(achievements.isSecret, false))
    .orderBy(achievements.triggerType, achievements.triggerValue);
}

export async function getAchievementById(id: number) {
  const [achievement] = await db
    .select()
    .from(achievements)
    .where(eq(achievements.id, id))
    .limit(1);

  return achievement || null;
}

export async function getAchievementBySlug(slug: string) {
  const [achievement] = await db
    .select()
    .from(achievements)
    .where(eq(achievements.slug, slug))
    .limit(1);

  return achievement || null;
}

export async function createAchievement(data: NewAchievement): Promise<Achievement> {
  const [achievement] = await db.insert(achievements).values(data).returning();
  return achievement;
}

export async function updateAchievement(
  id: number,
  data: Partial<NewAchievement>
): Promise<Achievement | null> {
  const [updated] = await db
    .update(achievements)
    .set(data)
    .where(eq(achievements.id, id))
    .returning();

  return updated || null;
}

export async function deleteAchievement(id: number): Promise<boolean> {
  const result = await db.delete(achievements).where(eq(achievements.id, id)).returning();
  return result.length > 0;
}

// =============================================
// USER ACHIEVEMENT QUERIES
// =============================================

export async function getUserAchievements(userId: number) {
  return await db.query.userAchievements.findMany({
    where: eq(userAchievements.userId, userId),
    with: {
      achievement: true,
    },
    orderBy: [desc(userAchievements.earnedAt)],
  });
}

export async function hasUserEarnedAchievement(
  userId: number,
  achievementId: number
): Promise<boolean> {
  const [result] = await db
    .select()
    .from(userAchievements)
    .where(
      and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      )
    )
    .limit(1);

  return result !== null;
}

export async function awardAchievement(
  userId: number,
  achievementId: number
): Promise<UserAchievement | null> {
  // Check if already earned
  const alreadyEarned = await hasUserEarnedAchievement(userId, achievementId);
  if (alreadyEarned) return null;

  // Get achievement for points
  const achievement = await getAchievementById(achievementId);
  if (!achievement) return null;

  // Award the achievement
  const [userAchievement] = await db
    .insert(userAchievements)
    .values({ userId, achievementId })
    .returning();

  // Award points for the achievement
  if (achievement.pointsValue && achievement.pointsValue > 0) {
    await awardPoints(
      userId,
      achievement.pointsValue,
      'achievement_earned',
      'achievement',
      achievementId
    );
  }

  return userAchievement;
}

// =============================================
// ACHIEVEMENT TRIGGER CHECKS
// =============================================

export async function checkAndAwardAchievements(userId: number) {
  const allAchievements = await getAllAchievements(true);
  const earnedAchievements = await getUserAchievements(userId);
  const earnedIds = new Set(earnedAchievements.map((ua) => ua.achievementId));

  const newlyEarned: UserAchievement[] = [];

  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.id)) continue;

    const isEligible = await checkAchievementEligibility(userId, achievement);
    if (isEligible) {
      const awarded = await awardAchievement(userId, achievement.id);
      if (awarded) {
        newlyEarned.push(awarded);
      }
    }
  }

  return newlyEarned;
}

async function checkAchievementEligibility(
  userId: number,
  achievement: Achievement
): Promise<boolean> {
  switch (achievement.triggerType) {
    case 'lessons_completed': {
      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(lessonCompletions)
        .where(eq(lessonCompletions.userId, userId));

      return (result?.count || 0) >= (achievement.triggerValue || 0);
    }

    case 'courses_completed': {
      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, userId),
            sql`${enrollments.completedAt} IS NOT NULL`
          )
        );

      return (result?.count || 0) >= (achievement.triggerValue || 0);
    }

    case 'posts_created': {
      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(communityPosts)
        .where(eq(communityPosts.userId, userId));

      return (result?.count || 0) >= (achievement.triggerValue || 0);
    }

    case 'streak_days': {
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      return (profile?.streak || 0) >= (achievement.triggerValue || 0);
    }

    case 'points_earned': {
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      return (profile?.points || 0) >= (achievement.triggerValue || 0);
    }

    default:
      return false;
  }
}

// =============================================
// ACHIEVEMENT STATS
// =============================================

export async function getAchievementStats() {
  const [totalResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(achievements);

  const [earnedResult] = await db
    .select({ count: sql<number>`count(DISTINCT user_id)::int` })
    .from(userAchievements);

  return {
    totalAchievements: totalResult?.count || 0,
    usersWithAchievements: earnedResult?.count || 0,
  };
}

export async function getMostEarnedAchievements(limit = 5) {
  return await db
    .select({
      achievement: achievements,
      earnedCount: sql<number>`count(${userAchievements.id})::int`,
    })
    .from(achievements)
    .leftJoin(userAchievements, eq(achievements.id, userAchievements.achievementId))
    .groupBy(achievements.id)
    .orderBy(desc(sql`count(${userAchievements.id})`))
    .limit(limit);
}

// =============================================
// SEED DEFAULT ACHIEVEMENTS
// =============================================

export async function seedDefaultAchievements() {
  const defaultAchievements: NewAchievement[] = [
    {
      name: 'First Steps',
      slug: 'first-steps',
      description: 'Complete your first lesson',
      iconUrl: '/achievements/first-steps.svg',
      pointsValue: 25,
      triggerType: 'lessons_completed',
      triggerValue: 1,
    },
    {
      name: 'Quick Learner',
      slug: 'quick-learner',
      description: 'Complete 5 lessons',
      iconUrl: '/achievements/quick-learner.svg',
      pointsValue: 50,
      triggerType: 'lessons_completed',
      triggerValue: 5,
    },
    {
      name: 'Knowledge Seeker',
      slug: 'knowledge-seeker',
      description: 'Complete 25 lessons',
      iconUrl: '/achievements/knowledge-seeker.svg',
      pointsValue: 100,
      triggerType: 'lessons_completed',
      triggerValue: 25,
    },
    {
      name: 'Course Graduate',
      slug: 'course-graduate',
      description: 'Complete your first course',
      iconUrl: '/achievements/course-graduate.svg',
      pointsValue: 100,
      triggerType: 'courses_completed',
      triggerValue: 1,
    },
    {
      name: 'Master Student',
      slug: 'master-student',
      description: 'Complete 3 courses',
      iconUrl: '/achievements/master-student.svg',
      pointsValue: 250,
      triggerType: 'courses_completed',
      triggerValue: 3,
    },
    {
      name: 'Community Contributor',
      slug: 'community-contributor',
      description: 'Create your first post',
      iconUrl: '/achievements/community-contributor.svg',
      pointsValue: 25,
      triggerType: 'posts_created',
      triggerValue: 1,
    },
    {
      name: 'Active Participant',
      slug: 'active-participant',
      description: 'Create 10 posts',
      iconUrl: '/achievements/active-participant.svg',
      pointsValue: 75,
      triggerType: 'posts_created',
      triggerValue: 10,
    },
    {
      name: 'Week Warrior',
      slug: 'week-warrior',
      description: 'Maintain a 7-day streak',
      iconUrl: '/achievements/week-warrior.svg',
      pointsValue: 100,
      triggerType: 'streak_days',
      triggerValue: 7,
    },
    {
      name: 'Consistency Champion',
      slug: 'consistency-champion',
      description: 'Maintain a 30-day streak',
      iconUrl: '/achievements/consistency-champion.svg',
      pointsValue: 500,
      triggerType: 'streak_days',
      triggerValue: 30,
    },
    {
      name: 'Point Collector',
      slug: 'point-collector',
      description: 'Earn 500 points',
      iconUrl: '/achievements/point-collector.svg',
      pointsValue: 50,
      triggerType: 'points_earned',
      triggerValue: 500,
    },
    {
      name: 'High Achiever',
      slug: 'high-achiever',
      description: 'Earn 1000 points',
      iconUrl: '/achievements/high-achiever.svg',
      pointsValue: 100,
      triggerType: 'points_earned',
      triggerValue: 1000,
      isSecret: true,
    },
  ];

  for (const achievement of defaultAchievements) {
    const existing = await getAchievementBySlug(achievement.slug);
    if (!existing) {
      await createAchievement(achievement);
    }
  }
}
