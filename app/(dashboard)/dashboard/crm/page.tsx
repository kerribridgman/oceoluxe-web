'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Mail,
  Calendar,
  Star,
} from 'lucide-react';
import { format } from 'date-fns';

type TabType = 'waitlist' | 'members' | 'churned';

interface WaitlistLead {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
}

interface Member {
  id: number;
  name: string | null;
  email: string;
  tier: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  memberSince: string;
  points: number | null;
  lastActivityAt: string | null;
}

interface ChurnedMember {
  id: number;
  name: string | null;
  email: string;
  tier: string;
  memberSince: string;
  churnedAt: string;
}

interface WaitlistStats {
  total: number;
  thisWeek: number;
  converted: number;
  conversionRate: string;
}

interface MemberStats {
  total: number;
  active: number;
  trialing: number;
  atRisk: number;
  estimatedMRR: string;
}

interface ChurnedStats {
  total: number;
  churnRate: string;
  avgMembershipDays: number;
}

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<TabType>('waitlist');
  const [isLoading, setIsLoading] = useState(true);

  // Waitlist state
  const [waitlistData, setWaitlistData] = useState<WaitlistLead[]>([]);
  const [waitlistStats, setWaitlistStats] = useState<WaitlistStats | null>(null);

  // Members state
  const [membersData, setMembersData] = useState<Member[]>([]);
  const [membersStats, setMembersStats] = useState<MemberStats | null>(null);

  // Churned state
  const [churnedData, setChurnedData] = useState<ChurnedMember[]>([]);
  const [churnedStats, setChurnedStats] = useState<ChurnedStats | null>(null);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  async function fetchData(tab: TabType) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/crm?tab=${tab}`);
      if (response.ok) {
        const result = await response.json();
        if (tab === 'waitlist') {
          setWaitlistData(result.data || []);
          setWaitlistStats(result.stats);
        } else if (tab === 'members') {
          setMembersData(result.data || []);
          setMembersStats(result.stats);
        } else if (tab === 'churned') {
          setChurnedData(result.data || []);
          setChurnedStats(result.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setIsLoading(false);
    }
  }

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
          <AlertTriangle className="w-3 h-3" />
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

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#3B3937] border border-[#967F71] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">CRM</h1>
            <p className="text-white/80">Manage your waitlist and members</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'waitlist' ? 'default' : 'outline'}
          onClick={() => setActiveTab('waitlist')}
          className={activeTab === 'waitlist' ? 'bg-[#CDA7B2] hover:bg-[#CDA7B2]/90' : ''}
        >
          <Clock className="w-4 h-4 mr-2" />
          Waitlist
        </Button>
        <Button
          variant={activeTab === 'members' ? 'default' : 'outline'}
          onClick={() => setActiveTab('members')}
          className={activeTab === 'members' ? 'bg-[#CDA7B2] hover:bg-[#CDA7B2]/90' : ''}
        >
          <UserCheck className="w-4 h-4 mr-2" />
          Members
        </Button>
        <Button
          variant={activeTab === 'churned' ? 'default' : 'outline'}
          onClick={() => setActiveTab('churned')}
          className={activeTab === 'churned' ? 'bg-[#CDA7B2] hover:bg-[#CDA7B2]/90' : ''}
        >
          <UserX className="w-4 h-4 mr-2" />
          Churned
        </Button>
      </div>

      {/* Waitlist Tab */}
      {activeTab === 'waitlist' && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#CDA7B2]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#CDA7B2]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Waitlist</p>
                    <p className="text-2xl font-bold text-gray-900">{waitlistStats?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{waitlistStats?.thisWeek || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Converted</p>
                    <p className="text-2xl font-bold text-gray-900">{waitlistStats?.converted || 0}</p>
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
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{waitlistStats?.conversionRate || '0%'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Waitlist Table */}
          <Card className="dashboard-card border-0">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading waitlist...</p>
                </div>
              ) : waitlistData.length === 0 ? (
                <div className="py-12 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No waitlist signups yet</p>
                  <p className="text-sm text-gray-500">People who join the waitlist will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Signup Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitlistData.map((lead) => (
                        <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900">{lead.name || '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <a href={`mailto:${lead.email}`} className="text-[#CDA7B2] hover:underline">
                              {lead.email}
                            </a>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">
                              {format(new Date(lead.createdAt), 'MMM d, yyyy h:mm a')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#CDA7B2]/10 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-[#CDA7B2]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{membersStats?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Est. MRR</p>
                    <p className="text-2xl font-bold text-gray-900">{membersStats?.estimatedMRR || '$0'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trialing</p>
                    <p className="text-2xl font-bold text-gray-900">{membersStats?.trialing || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">At Risk</p>
                    <p className="text-2xl font-bold text-gray-900">{membersStats?.atRisk || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Members Table */}
          <Card className="dashboard-card border-0">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading members...</p>
                </div>
              ) : membersData.length === 0 ? (
                <div className="py-12 text-center">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No members yet</p>
                  <p className="text-sm text-gray-500">Active subscribers will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Member Since</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Renews</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersData.map((member) => (
                        <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900">{member.name || '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <a href={`mailto:${member.email}`} className="text-[#CDA7B2] hover:underline">
                              {member.email}
                            </a>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">{getTierLabel(member.tier)}</span>
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
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Churned Tab */}
      {activeTab === 'churned' && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <UserX className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Churned</p>
                    <p className="text-2xl font-bold text-gray-900">{churnedStats?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Churn Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{churnedStats?.churnRate || '0%'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Membership</p>
                    <p className="text-2xl font-bold text-gray-900">{churnedStats?.avgMembershipDays || 0} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Churned Table */}
          <Card className="dashboard-card border-0">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading churned members...</p>
                </div>
              ) : churnedData.length === 0 ? (
                <div className="py-12 text-center">
                  <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No churned members</p>
                  <p className="text-sm text-gray-500">Canceled subscriptions will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Previous Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Member Since</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Churned Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {churnedData.map((member) => (
                        <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900">{member.name || '-'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <a href={`mailto:${member.email}`} className="text-[#CDA7B2] hover:underline">
                              {member.email}
                            </a>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">{getTierLabel(member.tier)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">
                              {format(new Date(member.memberSince), 'MMM d, yyyy')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">
                              {format(new Date(member.churnedAt), 'MMM d, yyyy')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
