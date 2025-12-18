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
  Trash2,
  Loader2,
  X,
  Calendar,
  Zap,
} from 'lucide-react';
import { format } from 'date-fns';

interface MemberDetails {
  user: {
    id: number;
    name: string | null;
    email: string;
    createdAt: string;
  };
  subscription: {
    id: number;
    tier: string;
    status: string;
    stripeSubscriptionId: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    createdAt: string;
  } | null;
  profile: {
    points: number;
    streak: number;
    lastActivityAt: string | null;
  } | null;
  enrollments: Array<{
    id: number;
    enrolledAt: string;
    completedAt: string | null;
    progressPercent: number | null;
    courseTitle: string | null;
  }>;
  pointsHistory: Array<{
    id: number;
    amount: number;
    reason: string;
    createdAt: string;
  }>;
}

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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<PaidMember | null>(null);
  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

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

  async function handleDeleteMember(userId: number) {
    if (!confirm('Are you sure you want to delete this member? This will also delete their subscription, progress, and enrollments.')) {
      return;
    }

    setDeletingId(userId);
    try {
      const res = await fetch(`/api/crm?userId=${userId}&deleteUser=true`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPaidMembers(paidMembers.filter((m) => m.id !== userId));
        setEnrollments(enrollments.filter((e) => e.userId !== userId));
        setLeaderboard(leaderboard.filter((l) => l.userId !== userId));
      } else {
        const data = await res.json();
        alert(`Failed to delete member: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleMemberClick(member: PaidMember) {
    setSelectedMember(member);
    setIsLoadingDetails(true);
    setMemberDetails(null);

    try {
      const res = await fetch(`/api/crm/member/${member.id}`);
      if (res.ok) {
        const data = await res.json();
        setMemberDetails(data);
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  }

  function closeModal() {
    setSelectedMember(null);
    setMemberDetails(null);
  }

  function getPointsReasonLabel(reason: string): string {
    const labels: Record<string, string> = {
      lesson_complete: 'Completed lesson',
      course_complete: 'Completed course',
      post_created: 'Created a post',
      comment_created: 'Added a comment',
      achievement_earned: 'Achievement earned',
      signup_bonus: 'Signup bonus',
      daily_login: 'Daily login',
    };
    return labels[reason] || reason.replace(/_/g, ' ');
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
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleMemberClick(member)}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium text-gray-900 hover:text-[#CDA7B2]">
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
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMember(member.id);
                            }}
                            disabled={deletingId === member.id}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title="Delete member"
                          >
                            {deletingId === member.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
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

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#CDA7B2]/10 to-transparent">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedMember.name || 'Anonymous'}
                </h2>
                <p className="text-sm text-gray-500">{selectedMember.email}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoadingDetails ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#CDA7B2] mx-auto mb-4" />
                  <p className="text-gray-500">Loading member details...</p>
                </div>
              ) : memberDetails ? (
                <div className="space-y-6">
                  {/* Subscription Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#CDA7B2]" />
                      Subscription
                    </h3>
                    {memberDetails.subscription ? (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Plan</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getTierLabel(memberDetails.subscription.tier)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status</span>
                          {getStatusBadge(memberDetails.subscription.status, memberDetails.subscription.cancelAtPeriodEnd)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Member since</span>
                          <span className="text-sm text-gray-900">
                            {format(new Date(memberDetails.subscription.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {memberDetails.subscription.currentPeriodEnd && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                              {memberDetails.subscription.cancelAtPeriodEnd ? 'Access until' : 'Renews on'}
                            </span>
                            <span className="text-sm text-gray-900">
                              {format(new Date(memberDetails.subscription.currentPeriodEnd), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No subscription found</p>
                    )}
                  </div>

                  {/* Enrollments */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#CDA7B2]" />
                      Course Progress
                    </h3>
                    {memberDetails.enrollments.length > 0 ? (
                      <div className="space-y-3">
                        {memberDetails.enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {enrollment.courseTitle || 'Unknown Course'}
                              </span>
                              {enrollment.completedAt ? (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  Completed
                                </span>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  {enrollment.progressPercent || 0}%
                                </span>
                              )}
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#CDA7B2] rounded-full transition-all"
                                style={{ width: `${enrollment.progressPercent || 0}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Enrolled {format(new Date(enrollment.enrolledAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                        Not enrolled in any courses yet
                      </p>
                    )}
                  </div>

                  {/* Points History */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Points History
                      {memberDetails.profile && (
                        <span className="ml-auto text-sm font-normal text-gray-500">
                          Total: {memberDetails.profile.points.toLocaleString()} pts
                        </span>
                      )}
                    </h3>
                    {memberDetails.pointsHistory.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {memberDetails.pointsHistory.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm text-gray-700">
                                {getPointsReasonLabel(transaction.reason)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                              </span>
                              <span className="text-xs text-gray-400">
                                {format(new Date(transaction.createdAt), 'MMM d')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                        No points earned yet
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">Failed to load member details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
