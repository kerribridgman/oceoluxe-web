import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';
import {
  courses,
  courseModules,
  lessons,
  enrollments,
  lessonCompletions,
  userProfiles,
  pointsTransactions,
} from '@/lib/db/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';

export async function POST(
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

    // Get the lesson (lessons are in modules)
    const lesson = await db.query.lessons.findFirst({
      where: and(
        eq(lessons.slug, lessonSlug),
        moduleIds.length > 0 ? inArray(lessons.moduleId, moduleIds) : undefined
      ),
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Check enrollment
    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, user.id),
        eq(enrollments.courseId, course.id)
      ),
    });

    if (!enrollment && !lesson.isPreview) {
      return NextResponse.json(
        { error: 'You must enroll in this course' },
        { status: 403 }
      );
    }

    // Check if already completed
    const existingCompletion = await db.query.lessonCompletions.findFirst({
      where: and(
        eq(lessonCompletions.userId, user.id),
        eq(lessonCompletions.lessonId, lesson.id)
      ),
    });

    if (existingCompletion) {
      return NextResponse.json({ message: 'Already completed' });
    }

    // Mark lesson as complete
    await db.insert(lessonCompletions).values({
      userId: user.id,
      lessonId: lesson.id,
    });

    // Award points if lesson has points reward
    if (lesson.pointsReward && lesson.pointsReward > 0) {
      // Get or create user profile
      let profile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, user.id),
      });

      if (!profile) {
        await db.insert(userProfiles).values({
          userId: user.id,
          points: 0,
          streak: 0,
        });
        profile = await db.query.userProfiles.findFirst({
          where: eq(userProfiles.userId, user.id),
        });
      }

      if (profile) {
        // Update total points
        await db
          .update(userProfiles)
          .set({
            points: sql`${userProfiles.points} + ${lesson.pointsReward}`,
          })
          .where(eq(userProfiles.userId, user.id));

        // Log the transaction
        await db.insert(pointsTransactions).values({
          userId: user.id,
          amount: lesson.pointsReward,
          reason: `Completed lesson: ${lesson.title}`,
          referenceType: 'lesson_completion',
          referenceId: lesson.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lesson marked as complete',
      pointsAwarded: lesson.pointsReward ?? 0,
    });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return NextResponse.json(
      { error: 'Failed to mark complete' },
      { status: 500 }
    );
  }
}
