'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  GraduationCap,
  Play,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface EnrolledCourse {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  difficulty: string | null;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  enrolledAt: string;
  lastAccessedAt: string | null;
  nextLessonSlug: string | null;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function MyCoursesPage() {
  const { data: courses, isLoading } = useSWR<EnrolledCourse[]>(
    '/api/studio/my-courses',
    fetcher
  );

  const inProgressCourses = courses?.filter(
    (c) => c.progress > 0 && c.progress < 100
  );
  const notStartedCourses = courses?.filter((c) => c.progress === 0);
  const completedCourses = courses?.filter((c) => c.progress === 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Courses</h1>
        <p className="text-gray-500 mt-1">
          Track your progress and continue learning
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border-0 shadow-sm animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-200 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses && courses.length > 0 ? (
        <>
          {/* In Progress */}
          {inProgressCourses && inProgressCourses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-[#CDA7B2]" />
                In Progress ({inProgressCourses.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* Not Started */}
          {notStartedCourses && notStartedCourses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-400" />
                Not Started ({notStartedCourses.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notStartedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedCourses && completedCourses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Completed ({completedCourses.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-[#CDA7B2]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              No Enrolled Courses Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Browse our course catalog and start your learning journey.
            </p>
            <Button asChild className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90">
              <Link href="/studio/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: EnrolledCourse }) {
  const isComplete = course.progress === 100;

  return (
    <Link href={`/studio/courses/${course.slug}`}>
      <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all cursor-pointer h-full group">
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#CDA7B2]/20 to-[#3B3937]/10">
              <BookOpen className="w-12 h-12 text-[#CDA7B2]/50" />
            </div>
          )}
          {isComplete && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
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
          </div>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-[#CDA7B2] transition-colors">
            {course.title}
          </h3>

          {/* Progress */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {course.completedLessons} / {course.totalLessons} lessons
              </span>
              <span
                className={`font-medium ${
                  isComplete ? 'text-green-600' : 'text-[#CDA7B2]'
                }`}
              >
                {Math.round(course.progress)}%
              </span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>

          {/* Continue Button */}
          {!isComplete && course.nextLessonSlug && (
            <Button
              asChild
              size="sm"
              className="w-full bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/studio/courses/${course.slug}/lessons/${course.nextLessonSlug}`}
              >
                <Play className="w-4 h-4 mr-2" />
                {course.progress > 0 ? 'Continue' : 'Start'}
              </Link>
            </Button>
          )}

          {isComplete && (
            <Button variant="outline" size="sm" className="w-full">
              <ArrowRight className="w-4 h-4 mr-2" />
              Review Course
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
