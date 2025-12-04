import { eq, and, desc, asc, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import {
  courses,
  courseModules,
  lessons,
  Course,
  NewCourse,
  CourseModule,
  NewCourseModule,
  Lesson,
  NewLesson,
} from './schema';

// =============================================
// COURSE QUERIES
// =============================================

export async function getAllCourses(includeUnpublished = false) {
  if (includeUnpublished) {
    return await db
      .select()
      .from(courses)
      .orderBy(asc(courses.displayOrder), desc(courses.createdAt));
  }

  return await db
    .select()
    .from(courses)
    .where(eq(courses.isPublished, true))
    .orderBy(asc(courses.displayOrder), desc(courses.createdAt));
}

export async function getFeaturedCourses() {
  return await db
    .select()
    .from(courses)
    .where(and(eq(courses.isPublished, true), eq(courses.isFeatured, true)))
    .orderBy(asc(courses.displayOrder));
}

export async function getCourseById(id: number) {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);

  return course || null;
}

export async function getCourseBySlug(slug: string) {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);

  return course || null;
}

export async function getCourseWithModules(courseId: number) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      modules: {
        orderBy: [asc(courseModules.displayOrder)],
        with: {
          lessons: {
            orderBy: [asc(lessons.displayOrder)],
          },
        },
      },
    },
  });

  return course || null;
}

export async function getCourseBySlugWithModules(slug: string) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.slug, slug),
    with: {
      modules: {
        orderBy: [asc(courseModules.displayOrder)],
        with: {
          lessons: {
            orderBy: [asc(lessons.displayOrder)],
          },
        },
      },
    },
  });

  return course || null;
}

export async function createCourse(data: NewCourse): Promise<Course> {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
}

export async function updateCourse(
  id: number,
  data: Partial<NewCourse>
): Promise<Course | null> {
  const [updated] = await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();

  return updated || null;
}

export async function deleteCourse(id: number): Promise<boolean> {
  const result = await db.delete(courses).where(eq(courses.id, id)).returning();
  return result.length > 0;
}

// =============================================
// MODULE QUERIES
// =============================================

export async function getModulesByCourseId(courseId: number) {
  return await db
    .select()
    .from(courseModules)
    .where(eq(courseModules.courseId, courseId))
    .orderBy(asc(courseModules.displayOrder));
}

export async function getModuleById(id: number) {
  const [module] = await db
    .select()
    .from(courseModules)
    .where(eq(courseModules.id, id))
    .limit(1);

  return module || null;
}

export async function getModuleWithLessons(moduleId: number) {
  const module = await db.query.courseModules.findFirst({
    where: eq(courseModules.id, moduleId),
    with: {
      lessons: {
        orderBy: [asc(lessons.displayOrder)],
      },
    },
  });

  return module || null;
}

export async function createModule(data: NewCourseModule): Promise<CourseModule> {
  const [module] = await db.insert(courseModules).values(data).returning();
  return module;
}

export async function updateModule(
  id: number,
  data: Partial<NewCourseModule>
): Promise<CourseModule | null> {
  const [updated] = await db
    .update(courseModules)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courseModules.id, id))
    .returning();

  return updated || null;
}

export async function deleteModule(id: number): Promise<boolean> {
  const result = await db.delete(courseModules).where(eq(courseModules.id, id)).returning();
  return result.length > 0;
}

export async function reorderModules(
  courseId: number,
  moduleOrders: { id: number; displayOrder: number }[]
) {
  await Promise.all(
    moduleOrders.map(({ id, displayOrder }) =>
      db
        .update(courseModules)
        .set({ displayOrder, updatedAt: new Date() })
        .where(and(eq(courseModules.id, id), eq(courseModules.courseId, courseId)))
    )
  );
}

// =============================================
// LESSON QUERIES
// =============================================

export async function getLessonsByModuleId(moduleId: number) {
  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.moduleId, moduleId))
    .orderBy(asc(lessons.displayOrder));
}

export async function getLessonById(id: number) {
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, id))
    .limit(1);

  return lesson || null;
}

export async function getLessonBySlug(moduleId: number, slug: string) {
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.moduleId, moduleId), eq(lessons.slug, slug)))
    .limit(1);

  return lesson || null;
}

export async function createLesson(data: NewLesson): Promise<Lesson> {
  const [lesson] = await db.insert(lessons).values(data).returning();
  return lesson;
}

export async function updateLesson(
  id: number,
  data: Partial<NewLesson>
): Promise<Lesson | null> {
  const [updated] = await db
    .update(lessons)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(lessons.id, id))
    .returning();

  return updated || null;
}

export async function deleteLesson(id: number): Promise<boolean> {
  const result = await db.delete(lessons).where(eq(lessons.id, id)).returning();
  return result.length > 0;
}

export async function reorderLessons(
  moduleId: number,
  lessonOrders: { id: number; displayOrder: number }[]
) {
  await Promise.all(
    lessonOrders.map(({ id, displayOrder }) =>
      db
        .update(lessons)
        .set({ displayOrder, updatedAt: new Date() })
        .where(and(eq(lessons.id, id), eq(lessons.moduleId, moduleId)))
    )
  );
}

export async function getPreviewLessons(courseId: number) {
  return await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      modules: {
        orderBy: [asc(courseModules.displayOrder)],
        with: {
          lessons: {
            where: eq(lessons.isPreview, true),
            orderBy: [asc(lessons.displayOrder)],
          },
        },
      },
    },
  });
}

// =============================================
// COURSE STATS
// =============================================

export async function getCourseStats(courseId: number) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      modules: {
        with: {
          lessons: true,
        },
      },
      enrollments: true,
    },
  });

  if (!course) return null;

  const totalLessons = course.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );

  const totalDuration = course.modules.reduce(
    (acc, mod) =>
      acc +
      mod.lessons.reduce(
        (lessonAcc, lesson) => lessonAcc + (lesson.videoDurationMinutes || 0),
        0
      ),
    0
  );

  return {
    totalModules: course.modules.length,
    totalLessons,
    totalDurationMinutes: totalDuration,
    totalEnrollments: course.enrollments.length,
  };
}
