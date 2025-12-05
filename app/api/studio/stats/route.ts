import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';
import { enrollments, lessonCompletions, userProfiles } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get enrolled courses count
    const enrolledCoursesResult = await db
      .select({ count: count() })
      .from(enrollments)
      .where(eq(enrollments.userId, user.id));

    // Get completed lessons count
    const completedLessonsResult = await db
      .select({ count: count() })
      .from(lessonCompletions)
      .where(eq(lessonCompletions.userId, user.id));

    // Get user profile for points and streak
    const profile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, user.id),
    });

    return NextResponse.json({
      enrolledCourses: enrolledCoursesResult[0]?.count ?? 0,
      completedLessons: completedLessonsResult[0]?.count ?? 0,
      totalPoints: profile?.points ?? 0,
      currentStreak: profile?.streak ?? 0,
    });
  } catch (error) {
    console.error('Error fetching studio stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
