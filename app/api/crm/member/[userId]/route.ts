import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, educationSubscriptions, userProfiles, enrollments, courses, pointsTransactions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUser = await getUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId } = await params;
    const userIdNum = parseInt(userId, 10);

    if (isNaN(userIdNum)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    // Get user info
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userIdNum));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get subscription info
    const [subscription] = await db
      .select()
      .from(educationSubscriptions)
      .where(eq(educationSubscriptions.userId, userIdNum));

    // Get user profile (points, streak)
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userIdNum));

    // Get enrollments with course info
    const userEnrollments = await db
      .select({
        id: enrollments.id,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
        progressPercent: enrollments.progressPercent,
        courseId: courses.id,
        courseTitle: courses.title,
        courseSlug: courses.slug,
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userIdNum))
      .orderBy(desc(enrollments.enrolledAt));

    // Get points history
    const pointsHistory = await db
      .select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userIdNum))
      .orderBy(desc(pointsTransactions.createdAt))
      .limit(20);

    return NextResponse.json({
      user,
      subscription,
      profile,
      enrollments: userEnrollments,
      pointsHistory,
    });
  } catch (error) {
    console.error('Error fetching member details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member details' },
      { status: 500 }
    );
  }
}
