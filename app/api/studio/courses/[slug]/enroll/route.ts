import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';
import { courses, enrollments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
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

    // Check if already enrolled
    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, user.id),
        eq(enrollments.courseId, course.id)
      ),
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: 'Already enrolled' });
    }

    // TODO: Add subscription check here
    // If course requires subscription and user doesn't have one, return error

    // Create enrollment
    await db.insert(enrollments).values({
      userId: user.id,
      courseId: course.id,
    });

    return NextResponse.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Failed to enroll' },
      { status: 500 }
    );
  }
}
