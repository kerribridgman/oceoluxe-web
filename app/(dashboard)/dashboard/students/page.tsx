'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  DollarSign,
  Download,
  CreditCard,
  Star,
} from 'lucide-react';
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

interface PaidMember {
  id: number;
  name: string | null;
  email: string;
  tier: string;
  status: string;
  memberSince: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  points: number | null;
}

export default function StudentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [paidMembers, setPaidMembers] = useState<PaidMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'enrollments' | 'leaderboard'>('members');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [enrollmentsRes, leaderboardRes, membersRes] = await Promise.all([
        fetch('/api/enrollments'),
        fetch('/api/leaderboard'),
        fetch('/api/crm?tab=members'),
      ]);

      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json();
        setEnrollments(data.enrollments || []);
      }

      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json();
        setLeaderboard(data.leaderboard || []);
      }

      if (membersRes.ok) {
        const data = await membersRes.json();
        setPaidMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Stats
  const totalStudents = new Set(enrollments.map((e) => e.userId)).size;
  const totalPaidMembers = paidMembers.length;
  const completedCourses = enrollments.filter((e) => e.completedAt).length;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) /
            enrollments.length
        )
      : 0;

  function getTierLabel(tier: string) {
    const labels: Record<string, string> = {
      monthly: 'Monthly',
      yearly: 'Annual',
      lifetime: 'Lifetime',
      earlyBird_monthly: 'Early Bird (Monthly)',
      earlyBird_yearly: 'Early Bird (Annual)',
    };
    return labels[tier] || tier;
  }

  function getStatusBadge(status: string, cancelAtPeriodEnd?: boolean) {
    if (cancelAtPeriodEnd) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          Canceling
        </span>
      );
    }
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      trialing: 'bg-blue-100 text-blue-700',
      past_due: 'bg-red-100 text-red-700',
      canceled: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  }

  function exportMembersToCSV() {
    if (paidMembers.length === 0) return;

    const headers = ['Name', 'Email', 'Plan', 'Status', 'Member Since', 'Renewal Date', 'Points'];
    const rows = paidMembers.map(member => [
      member.name || '',
      member.email,
      getTierLabel(member.tier),
      member.cancelAtPeriodEnd ? 'Canceling' : member.status,
      format(new Date(member.memberSince), 'yyyy-MM-dd'),
      member.currentPeriodEnd ? format(new Date(member.currentPeriodEnd), 'yyyy-MM-dd') : '',
      member.points || 0,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `paid-members-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Students</h1>
              <p className="text-white/80">View paid members, enrollments, and leaderboard</p>
            </div>
          </div>
          {activeTab === 'members' && (
            <Button
              onClick={exportMembersToCSV}
              disabled={paidMembers.length === 0}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#CDA7B2]/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#CDA7B2]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid Members</p>
                <p className="text-2xl font-bold text-gray-900">{totalPaidMembers}</p>
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
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
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
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'members'
              ? 'bg-[#CDA7B2] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CreditCard className="w-4 h-4 inline mr-2" />
          Paid Members
        </button>
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'enrollments'
              ? 'bg-[#CDA7B2] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
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
          <Trophy className="w-4 h-4 inline mr-2" />
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
          ) : activeTab === 'members' ? (
            paidMembers.length === 0 ? (
              <div className="py-12 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No paid members yet</p>
                <p className="text-sm text-gray-500">
                  Users who subscribe to Studio Systems will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Member
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Plan
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Member Since
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Renews
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium text-gray-900">
                              {member.name || 'Anonymous'}
                            </span>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {getTierLabel(member.tier)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(member.status, member.cancelAtPeriodEnd)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-500">
                            {format(new Date(member.memberSince), 'MMM d, yyyy')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-500">
                            {member.currentPeriodEnd
                              ? format(new Date(member.currentPeriodEnd), 'MMM d, yyyy')
                              : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {member.points || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
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
