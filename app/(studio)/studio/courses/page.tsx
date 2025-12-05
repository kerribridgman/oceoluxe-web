'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  Search,
  Filter,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  difficulty: string | null;
  totalLessons: number;
  estimatedDuration: number | null;
  isEnrolled: boolean;
  progress: number | null;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const { data: courses, isLoading } = useSWR<Course[]>(
    '/api/studio/courses',
    fetcher
  );

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      !selectedDifficulty || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Course Catalog</h1>
        <p className="text-gray-500 mt-1">
          Browse all available courses and start learning
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedDifficulty === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty(null)}
            className={
              selectedDifficulty === null
                ? 'bg-[#CDA7B2] hover:bg-[#CDA7B2]/90'
                : ''
            }
          >
            All
          </Button>
          {difficulties.map((diff) => (
            <Button
              key={diff}
              variant={selectedDifficulty === diff ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(diff)}
              className={
                selectedDifficulty === diff
                  ? 'bg-[#CDA7B2] hover:bg-[#CDA7B2]/90'
                  : ''
              }
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white border-0 shadow-sm animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/studio/courses/${course.slug}`}>
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
                  {course.isEnrolled && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enrolled
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
                  {course.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {course.totalLessons} lessons
                    </span>
                    {course.estimatedDuration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.round(course.estimatedDuration / 60)}h
                      </span>
                    )}
                  </div>
                  {course.isEnrolled && course.progress !== null && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-[#CDA7B2]">
                          {Math.round(course.progress)}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#CDA7B2] rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedDifficulty
                ? 'Try adjusting your search or filters'
                : 'Check back soon for new courses'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
