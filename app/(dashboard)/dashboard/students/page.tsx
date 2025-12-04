'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  completedAt: string | null;
  progressPercent: number | null;
  user: {
    id: number;
    name: string | null;
    email: string;
  };
  course: {
    id: number;
    title: string;
    slug: string;
  };
}

interface LeaderboardEntry {
  id: number;
  userId: number;
  points: number;
  streak: number;
  user: {
    id: number;
    name: string | null;
  };
}

export default function StudentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'enrollments' | 'leaderboard'>('enrollments');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [enrollmentsRes, leaderboardRes] = await Promise.all([
        fetch('/api/enrollments'),
        fetch('/api/leaderboard'),
      ]);

      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json();
        setEnrollments(data.enrollments || []);
      }

      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Stats
  const totalStudents = new Set(enrollments.map((e) => e.userId)).size;
  const totalEnrollments = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completedAt).length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) /
            enrollments.length
        )
      : 0;

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Students</h1>
            <p className="text-white/80">View enrollments, progress, and leaderboard</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#CDA7B2]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#CDA7B2]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{totalEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'enrollments'
              ? 'bg-[#CDA7B2] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Enrollments
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'leaderboard'
              ? 'bg-[#CDA7B2] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {/* Content */}
      <Card className="dashboard-card border-0">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : activeTab === 'enrollments' ? (
            enrollments.length === 0 ? (
              <div className="py-12 text-center">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No enrollments yet</p>
                <p className="text-sm text-gray-500">
                  Students will appear here when they enroll in courses
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Course
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Progress
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Enrolled
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr
                        key={enrollment.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium text-gray-900">
                              {enrollment.user.name || 'Anonymous'}
                            </span>
                            <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {enrollment.course.title}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#CDA7B2] rounded-full"
                                style={{ width: `${enrollment.progressPercent || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">
                              {enrollment.progressPercent || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {enrollment.completedAt ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                              <Trophy className="w-3 h-3" />
                              Completed
                            </span>
                          ) : (enrollment.progressPercent || 0) > 0 ? (
                            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              In Progress
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              Not Started
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-500">
                            {format(new Date(enrollment.enrolledAt), 'MMM d, yyyy')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : leaderboard.length === 0 ? (
            <div className="py-12 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No leaderboard data yet</p>
              <p className="text-sm text-gray-500">
                Points will be earned as students complete lessons
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-[#CDA7B2]/10 to-transparent' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                        ? 'bg-gray-300 text-gray-700'
                        : index === 2
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">
                      {entry.user.name || 'Anonymous'}
                    </span>
                    {entry.streak > 0 && (
                      <span className="ml-2 text-xs text-orange-600">
                        {entry.streak} day streak
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#CDA7B2]">
                      {entry.points.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">pts</span>
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
