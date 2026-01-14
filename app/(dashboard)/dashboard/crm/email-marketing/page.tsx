'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Mail,
  FileText,
  Send,
  Zap,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MousePointer,
} from 'lucide-react';

interface EmailStats {
  totalContacts: number;
  totalLeads: number;
  totalQuizLeads: number;
  totalMembers: number;
  totalClients: number;
  totalWebsiteSignups: number;
  totalTemplates: number;
  totalCampaigns: number;
  totalDrips: number;
  recentSends: number;
  openRate: string;
  clickRate: string;
}

export default function EmailMarketingPage() {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/email-marketing/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching email stats:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const quickActions = [
    {
      title: 'Email Templates',
      description: 'Create and manage reusable email templates',
      href: '/dashboard/crm/email-marketing/templates',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Campaigns',
      description: 'Send one-off email campaigns to your audience',
      href: '/dashboard/crm/email-marketing/campaigns',
      icon: Send,
      color: 'bg-green-500',
    },
    {
      title: 'Drip Sequences',
      description: 'Set up automated email sequences',
      href: '/dashboard/crm/email-marketing/drips',
      icon: Zap,
      color: 'bg-purple-500',
    },
    {
      title: '1-on-1 Clients',
      description: 'Manage your coaching clients',
      href: '/dashboard/crm/clients',
      icon: Users,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-light text-[#3B3937]">Email Marketing</h1>
        <p className="text-[#967F71] mt-2">
          Manage your email templates, campaigns, and automated sequences
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#967F71]">Total Contacts</p>
                <p className="text-2xl font-semibold text-[#3B3937]">
                  {isLoading ? '...' : stats?.totalContacts || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-[#CDA7B2]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#967F71]">Templates</p>
                <p className="text-2xl font-semibold text-[#3B3937]">
                  {isLoading ? '...' : stats?.totalTemplates || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#967F71]">Campaigns Sent</p>
                <p className="text-2xl font-semibold text-[#3B3937]">
                  {isLoading ? '...' : stats?.totalCampaigns || 0}
                </p>
              </div>
              <Send className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#967F71]">Active Drips</p>
                <p className="text-2xl font-semibold text-[#3B3937]">
                  {isLoading ? '...' : stats?.totalDrips || 0}
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif font-light text-[#3B3937]">
            Audience Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-[#faf8f5] rounded-lg">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {isLoading ? '...' : stats?.totalWebsiteSignups || 0}
              </p>
              <p className="text-sm text-[#967F71]">Email Signups</p>
            </div>
            <div className="text-center p-4 bg-[#faf8f5] rounded-lg">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {isLoading ? '...' : stats?.totalLeads || 0}
              </p>
              <p className="text-sm text-[#967F71]">Free Product Leads</p>
            </div>
            <div className="text-center p-4 bg-[#faf8f5] rounded-lg">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {isLoading ? '...' : stats?.totalQuizLeads || 0}
              </p>
              <p className="text-sm text-[#967F71]">Quiz Leads</p>
            </div>
            <div className="text-center p-4 bg-[#faf8f5] rounded-lg">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {isLoading ? '...' : stats?.totalMembers || 0}
              </p>
              <p className="text-sm text-[#967F71]">Members</p>
            </div>
            <div className="text-center p-4 bg-[#faf8f5] rounded-lg">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {isLoading ? '...' : stats?.totalClients || 0}
              </p>
              <p className="text-sm text-[#967F71]">1-on-1 Clients</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-serif font-light text-[#3B3937] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-[#3B3937] mb-1">{action.title}</h3>
                  <p className="text-sm text-[#967F71]">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Email Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif font-light text-[#3B3937]">
            Email Performance (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-[#967F71]" />
                <span className="text-sm text-[#967F71]">Emails Sent</span>
              </div>
              <p className="text-2xl font-semibold text-[#3B3937]">
                {isLoading ? '...' : stats?.recentSends || 0}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-[#967F71]" />
                <span className="text-sm text-[#967F71]">Open Rate</span>
              </div>
              <p className="text-2xl font-semibold text-[#3B3937]">
                {isLoading ? '...' : stats?.openRate || '0%'}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MousePointer className="h-5 w-5 text-[#967F71]" />
                <span className="text-sm text-[#967F71]">Click Rate</span>
              </div>
              <p className="text-2xl font-semibold text-[#3B3937]">
                {isLoading ? '...' : stats?.clickRate || '0%'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
