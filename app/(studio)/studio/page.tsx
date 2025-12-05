'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Sparkles,
  X,
  Heart,
} from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DashboardStats {
  enrolledCourses: number;
  completedLessons: number;
  totalPoints: number;
  currentStreak: number;
}

interface EnrolledCourse {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt: string | null;
}

export default function StudioDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const { data: stats } = useSWR<DashboardStats>('/api/studio/stats', fetcher);
  const { data: recentCourses } = useSWR<EnrolledCourse[]>(
    '/api/studio/recent-courses',
    fetcher
  );
  const { data: user } = useSWR('/api/user', fetcher);

  // Check for welcome param (new member just subscribed)
  useEffect(() => {
    const isWelcome = searchParams.get('welcome') === 'true' || searchParams.get('success') === 'true';
    if (isWelcome) {
      setShowWelcome(true);
      // Remove the query param from URL without refresh
      router.replace('/studio', { scroll: false });
    }
  }, [searchParams, router]);

  const closeWelcome = () => setShowWelcome(false);

  return (
    <div className="space-y-8">
      {/* Welcome Modal for New Members */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={closeWelcome}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-[#CDA7B2]" />
              </div>

              <h2 className="text-3xl font-serif text-[#3B3937] mb-3">
                Welcome to Studio Systems!
              </h2>

              <p className="text-gray-600 mb-6">
                {user?.name ? `${user.name}, you're` : "You're"} officially part of our community of fashion designers and visionaries. We're so excited to have you here.
              </p>

              <div className="bg-[#FAF8F6] rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-medium text-[#3B3937] mb-3">Here's what to do next:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-[#CDA7B2] mt-0.5 flex-shrink-0" />
                    <span>Browse our courses and start learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-[#CDA7B2] mt-0.5 flex-shrink-0" />
                    <span>Download templates from the Resources section</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-[#CDA7B2] mt-0.5 flex-shrink-0" />
                    <span>Introduce yourself in the Community</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={closeWelcome}
                className="bg-[#3B3937] hover:bg-[#4A4745] text-white px-8 py-6"
              >
                Let's Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#3B3937] to-[#5a5654] rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-serif font-light mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-white/70 mb-6">
          Continue your learning journey where you left off.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90 text-[#3B3937]"
          >
            <Link href="/studio/my-courses">
              <Play className="w-4 h-4 mr-2" />
              Continue Learning
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Link href="/studio/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.enrolledCourses ?? 0}
                </p>
                <p className="text-xs text-gray-500">Enrolled Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.completedLessons ?? 0}
                </p>
                <p className="text-xs text-gray-500">Lessons Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalPoints ?? 0}
                </p>
                <p className="text-xs text-gray-500">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.currentStreak ?? 0}
                </p>
                <p className="text-xs text-gray-500">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Continue Learning
          </h2>
          <Link
            href="/studio/my-courses"
            className="text-sm text-[#CDA7B2] hover:text-[#CDA7B2]/80 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentCourses && recentCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCourses.slice(0, 3).map((course) => (
              <Link key={course.id} href={`/studio/courses/${course.slug}`}>
                <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#CDA7B2]/20 to-[#3B3937]/10">
                        <BookOpen className="w-12 h-12 text-[#CDA7B2]/50" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {course.completedLessons} / {course.totalLessons}{' '}
                          lessons
                        </span>
                        <span>{Math.round(course.progress)}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#CDA7B2]" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Start Your Learning Journey
              </h3>
              <p className="text-gray-500 mb-4">
                Browse our course catalog and enroll in your first course.
              </p>
              <Button asChild className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90">
                <Link href="/studio/courses">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/studio/community">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Community</h3>
                <p className="text-sm text-gray-500">
                  Connect with other members
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/studio/resources">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Resources</h3>
                <p className="text-sm text-gray-500">
                  Templates & downloads
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/studio/leaderboard">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Leaderboard</h3>
                <p className="text-sm text-gray-500">See top performers</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
