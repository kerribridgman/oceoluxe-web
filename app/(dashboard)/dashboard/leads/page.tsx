'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, CheckCircle2, Clock, Package, Download, Sparkles, Brain } from 'lucide-react';
import { format } from 'date-fns';

interface Lead {
  id: number;
  email: string;
  name: string | null;
  productSlug: string;
  productName: string;
  source: string | null;
  deliveryEmailSentAt: string | null;
  createdAt: string;
}

interface QuizLead {
  id: number;
  email: string;
  name: string | null;
  archetype: string;
  scores: Record<string, number> | null;
  source: string | null;
  convertedToMember: boolean;
  emailSequenceStarted: boolean;
  createdAt: string;
}

const archetypeLabels: Record<string, { label: string; emoji: string }> = {
  muse: { label: 'The Muse Chaser', emoji: '✨' },
  world: { label: 'The World Builder', emoji: '🌙' },
  intimate: { label: 'The Intimist', emoji: '🤍' },
  editor: { label: 'The Editor', emoji: '✂️' },
  populist: { label: 'The Populist', emoji: '🌍' },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quizLeads, setQuizLeads] = useState<QuizLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'downloads' | 'quiz'>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setIsLoading(true);
    try {
      const [leadsRes, quizRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/quiz'),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }

      if (quizRes.ok) {
        const data = await quizRes.json();
        setQuizLeads(data.quizLeads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Stats
  const totalLeads = leads.length + quizLeads.length;
  const downloadLeads = leads.length;
  const quizLeadsCount = quizLeads.length;
  const convertedCount = quizLeads.filter(l => l.convertedToMember).length;

  // Combined view for "all" tab
  const allLeads = [
    ...leads.map(l => ({ ...l, type: 'download' as const })),
    ...quizLeads.map(l => ({ ...l, type: 'quiz' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function exportToCSV() {
    const dataToExport = activeTab === 'downloads' ? leads :
                         activeTab === 'quiz' ? quizLeads : allLeads;

    if (dataToExport.length === 0) return;

    let headers: string[];
    let rows: string[][];

    if (activeTab === 'quiz') {
      headers = ['Name', 'Email', 'Archetype', 'Converted', 'Date'];
      rows = (dataToExport as QuizLead[]).map(lead => [
        lead.name || '',
        lead.email,
        archetypeLabels[lead.archetype]?.label || lead.archetype,
        lead.convertedToMember ? 'Yes' : 'No',
        format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      ]);
    } else if (activeTab === 'downloads') {
      headers = ['Name', 'Email', 'Product', 'Email Status', 'Date'];
      rows = (dataToExport as Lead[]).map(lead => [
        lead.name || '',
        lead.email,
        lead.productName,
        lead.deliveryEmailSentAt ? 'Sent' : 'Pending',
        format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      ]);
    } else {
      headers = ['Name', 'Email', 'Source', 'Details', 'Date'];
      rows = allLeads.map(lead => [
        lead.name || '',
        lead.email,
        lead.type === 'quiz' ? 'Quiz' : 'Free Download',
        lead.type === 'quiz'
          ? archetypeLabels[(lead as QuizLead).archetype]?.label || ''
          : (lead as Lead).productName,
        format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      ]);
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${activeTab}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Leads</h1>
              <p className="text-white/80">Free downloads, quiz results, and email captures</p>
            </div>
          </div>
          <Button
            onClick={exportToCSV}
            disabled={totalLeads === 0}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
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
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Free Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{downloadLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quiz Leads</p>
                <p className="text-2xl font-bold text-gray-900">{quizLeadsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Converted</p>
                <p className="text-2xl font-bold text-gray-900">{convertedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-[#CDA7B2] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          All Leads
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'downloads'
              ? 'bg-[#CDA7B2] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Free Downloads
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'quiz'
              ? 'bg-[#CDA7B2] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Brain className="w-4 h-4 inline mr-2" />
          Quiz Leads
        </button>
      </div>

      {/* Leads Table */}
      <Card className="dashboard-card border-0">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading leads...</p>
            </div>
          ) : activeTab === 'all' ? (
            allLeads.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No leads yet</p>
                <p className="text-sm text-gray-500">Leads will appear here from free downloads and quiz completions</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Details</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allLeads.map((lead) => (
                      <tr key={`${lead.type}-${lead.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{lead.name || '-'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <a href={`mailto:${lead.email}`} className="text-[#CDA7B2] hover:underline">
                            {lead.email}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          {lead.type === 'quiz' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              <Brain className="w-3 h-3" />
                              Quiz
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <Package className="w-3 h-3" />
                              Download
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {lead.type === 'quiz' ? (
                            <span className="text-sm text-gray-600">
                              {archetypeLabels[(lead as QuizLead).archetype]?.emoji}{' '}
                              {archetypeLabels[(lead as QuizLead).archetype]?.label || (lead as QuizLead).archetype}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-600">{(lead as Lead).productName}</span>
                          )}
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
            )
          ) : activeTab === 'downloads' ? (
            leads.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No download leads yet</p>
                <p className="text-sm text-gray-500">Leads will appear here when users download free products</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
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
                          <span className="text-sm text-gray-600">{lead.productName}</span>
                        </td>
                        <td className="py-3 px-4">
                          {lead.deliveryEmailSentAt ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle2 className="w-4 h-4" />
                              Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
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
            )
          ) : (
            quizLeads.length === 0 ? (
              <div className="py-12 text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No quiz leads yet</p>
                <p className="text-sm text-gray-500">Leads will appear here when users complete the Designer Archetype quiz</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Archetype</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizLeads.map((lead) => (
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
                          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <span>{archetypeLabels[lead.archetype]?.emoji || '🎯'}</span>
                            {archetypeLabels[lead.archetype]?.label || lead.archetype}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {lead.convertedToMember ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <Sparkles className="w-3 h-3" />
                              Member
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Lead
                            </span>
                          )}
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
            )
          )}
        </CardContent>
      </Card>
    </section>
  );
}
