import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getAllCourses, createCourse, getCourseStats } from '@/lib/db/queries-courses';
import { db } from '@/lib/db/drizzle';
import { courses, courseModules, lessons, enrollments } from '@/lib/db/schema';
import { eq, sql, asc, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    // For admin, include counts
    const coursesWithCounts = await db
      .select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        description: courses.description,
        shortDescription: courses.shortDescription,
        coverImageUrl: courses.coverImageUrl,
        difficulty: courses.difficulty,
        estimatedMinutes: courses.estimatedMinutes,
        isPublished: courses.isPublished,
        isFeatured: courses.isFeatured,
        requiredSubscriptionTier: courses.requiredSubscriptionTier,
        displayOrder: courses.displayOrder,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
      })
      .from(courses)
      .where(includeUnpublished ? undefined : eq(courses.isPublished, true))
      .orderBy(asc(courses.displayOrder), desc(courses.createdAt));

    // Get counts for each course
    const coursesData = await Promise.all(
      coursesWithCounts.map(async (course) => {
        const [moduleCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(courseModules)
          .where(eq(courseModules.courseId, course.id));

        const [lessonCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(lessons)
          .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
          .where(eq(courseModules.courseId, course.id));

        const [enrollmentCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(enrollments)
          .where(eq(enrollments.courseId, course.id));

        return {
          ...course,
          _count: {
            modules: moduleCount?.count || 0,
            lessons: lessonCount?.count || 0,
            enrollments: enrollmentCount?.count || 0,
          },
        };
      })
    );

    return NextResponse.json({ courses: coursesData });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, description, shortDescription, coverImageUrl, difficulty, estimatedMinutes, requiredSubscriptionTier } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const course = await createCourse({
      title,
      slug,
      description,
      shortDescription,
      coverImageUrl,
      difficulty,
      estimatedMinutes,
      requiredSubscriptionTier,
      createdBy: user.id,
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
