'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  GraduationCap,
  Play,
  CheckCircle,
  Lock,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Module {
  id: number;
  title: string;
  description: string | null;
  orderIndex: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  durationMinutes: number | null;
  orderIndex: number;
  isCompleted: boolean;
  isFree: boolean;
}

interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  difficulty: string | null;
  isEnrolled: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  modules: Module[];
  nextLesson: { slug: string } | null;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { data: course, isLoading } = useSWR<CourseDetail>(
    `/api/studio/courses/${slug}`,
    fetcher
  );

  async function handleEnroll() {
    if (!course) return;

    setIsEnrolling(true);
    try {
      const res = await fetch(`/api/studio/courses/${slug}/enroll`, {
        method: 'POST',
      });

      if (res.ok) {
        mutate(`/api/studio/courses/${slug}`);
        mutate('/api/studio/stats');
        mutate('/api/studio/recent-courses');
      }
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setIsEnrolling(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
          <div className="aspect-video bg-gray-200 rounded-lg mb-6" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Course not found
        </h2>
        <p className="text-gray-500 mb-4">
          This course doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/studio/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/studio/courses"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            {course.difficulty && (
              <Badge
                className={
                  difficultyColors[course.difficulty] ||
                  'bg-gray-100 text-gray-700'
                }
              >
                {course.difficulty.charAt(0).toUpperCase() +
                  course.difficulty.slice(1)}
              </Badge>
            )}
            {course.isEnrolled && (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Enrolled
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {course.title}
          </h1>

          {course.description && (
            <p className="text-gray-600">{course.description}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              {course.totalLessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {course.modules.length} modules
            </span>
          </div>
        </div>

        {/* Course Card */}
        <Card className="bg-white border-0 shadow-sm">
          <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#CDA7B2]/20 to-[#3B3937]/10">
                <BookOpen className="w-16 h-16 text-[#CDA7B2]/50" />
              </div>
            )}
          </div>
          <CardContent className="p-4 space-y-4">
            {course.isEnrolled ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Your Progress</span>
                    <span className="font-medium">
                      {Math.round(course.progress)}%
                    </span>
                  </div>
                  <Progress value={course.progress} />
                  <p className="text-xs text-gray-400">
                    {course.completedLessons} of {course.totalLessons} lessons
                    completed
                  </p>
                </div>
                {course.nextLesson && (
                  <Button
                    asChild
                    className="w-full bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
                  >
                    <Link
                      href={`/studio/courses/${course.slug}/lessons/${course.nextLesson.slug}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Content */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Course Content
        </h2>
        <div className="space-y-4">
          {course.modules.map((module, moduleIndex) => (
            <Card key={module.id} className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#CDA7B2]/10 text-[#CDA7B2] flex items-center justify-center text-sm font-medium">
                    {moduleIndex + 1}
                  </span>
                  {module.title}
                </CardTitle>
                {module.description && (
                  <p className="text-sm text-gray-500">{module.description}</p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-gray-100">
                  {module.lessons.map((lesson) => {
                    const canAccess = course.isEnrolled || lesson.isFree;

                    return (
                      <div
                        key={lesson.id}
                        className={`py-3 flex items-center gap-3 ${
                          canAccess
                            ? 'cursor-pointer hover:bg-gray-50 -mx-4 px-4 transition-colors'
                            : 'opacity-60'
                        }`}
                        onClick={() =>
                          canAccess &&
                          router.push(
                            `/studio/courses/${course.slug}/lessons/${lesson.slug}`
                          )
                        }
                      >
                        <div className="flex-shrink-0">
                          {lesson.isCompleted ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                          ) : canAccess ? (
                            <div className="w-8 h-8 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center">
                              <Play className="w-4 h-4 text-[#CDA7B2]" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              lesson.isCompleted
                                ? 'text-gray-500'
                                : 'text-gray-900'
                            }`}
                          >
                            {lesson.title}
                          </p>
                          {lesson.durationMinutes && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.durationMinutes} min
                            </p>
                          )}
                        </div>
                        {canAccess && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        {lesson.isFree && !course.isEnrolled && (
                          <Badge variant="outline" className="text-xs">
                            Free
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
