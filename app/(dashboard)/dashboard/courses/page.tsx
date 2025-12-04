'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Users, Clock, BarChart3, Edit, Eye, EyeOff, Star } from 'lucide-react';
import { format } from 'date-fns';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  requiredSubscriptionTier: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    modules: number;
    lessons: number;
    enrollments: number;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/courses?includeUnpublished=true');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function togglePublish(courseId: number, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  }

  async function toggleFeatured(courseId: number, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });
      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  }

  // Stats
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.isPublished).length;
  const totalEnrollments = courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Courses</h1>
              <p className="text-white/80">Manage your Studio Systems courses and lessons</p>
            </div>
          </div>
          <Link href="/dashboard/courses/new">
            <Button className="bg-white text-[#3B3937] hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#CDA7B2]/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#CDA7B2]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-gray-900">{publishedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{totalEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card className="dashboard-card border-0">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No courses yet</p>
              <p className="text-sm text-gray-500 mb-4">Create your first course to get started</p>
              <Link href="/dashboard/courses/new">
                <Button className="bg-[#CDA7B2] text-white hover:bg-[#CDA7B2]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#CDA7B2]/50 transition-colors"
                >
                  {/* Cover Image */}
                  <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {course.coverImageUrl ? (
                      <img
                        src={course.coverImageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                      {course.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {!course.isPublished && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                      {course.requiredSubscriptionTier && (
                        <span className="text-xs bg-[#CDA7B2]/10 text-[#CDA7B2] px-2 py-0.5 rounded">
                          Members Only
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{course.description || 'No description'}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course._count?.modules || 0} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {course._count?.lessons || 0} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course._count?.enrollments || 0} enrolled
                      </span>
                      {course.estimatedMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.estimatedMinutes} min
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(course.id, course.isFeatured)}
                      className={course.isFeatured ? 'text-yellow-500' : 'text-gray-400'}
                    >
                      <Star className={`w-4 h-4 ${course.isFeatured ? 'fill-yellow-500' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublish(course.id, course.isPublished)}
                      className={course.isPublished ? 'text-green-600' : 'text-gray-400'}
                    >
                      {course.isPublished ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
