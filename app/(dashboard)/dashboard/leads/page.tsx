'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  CheckCircle2,
  Clock,
  Package,
  Download,
  Sparkles,
  Brain,
  Trash2,
  ChevronRight,
  UserCheck,
  UserX,
  Crown,
  Plus,
  Loader2,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { format } from 'date-fns';

type LeadStatus = 'lead' | 'membership' | 'one_on_one' | 'lost';

interface Lead {
  id: number;
  email: string;
  name: string | null;
  instagramHandle: string | null;
  productSlug: string;
  productName: string;
  source: string | null;
  status: LeadStatus;
  addedBy: number | null;
  addedByName: string | null;
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
  status: LeadStatus;
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

const statusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  lead: { label: 'Lead', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Users },
  membership: { label: 'Membership', color: 'text-green-700', bgColor: 'bg-green-100', icon: Sparkles },
  one_on_one: { label: '1 on 1 Client', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Crown },
  lost: { label: 'Lost Lead', color: 'text-red-700', bgColor: 'bg-red-100', icon: UserX },
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quizLeads, setQuizLeads] = useState<QuizLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'downloads' | 'quiz'>('all');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Add Lead Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    instagramHandle: '',
    source: '',
    status: 'lead' as LeadStatus,
  });

  // Airtable Sync State
  const [isAirtableModalOpen, setIsAirtableModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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

  // Combined leads with type info
  const allLeads = [
    ...leads.map(l => ({ ...l, type: 'download' as const, status: l.status || 'lead' as LeadStatus })),
    ...quizLeads.map(l => ({ ...l, type: 'quiz' as const, status: l.status || 'lead' as LeadStatus })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply filters
  const filteredLeads = allLeads.filter(lead => {
    if (sourceFilter !== 'all' && lead.type !== (sourceFilter === 'downloads' ? 'download' : 'quiz')) {
      return false;
    }
    if (statusFilter !== 'all' && lead.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Stats by status
  const statusCounts = {
    all: allLeads.length,
    lead: allLeads.filter(l => l.status === 'lead').length,
    membership: allLeads.filter(l => l.status === 'membership').length,
    one_on_one: allLeads.filter(l => l.status === 'one_on_one').length,
    lost: allLeads.filter(l => l.status === 'lost').length,
  };

  function navigateToLead(type: 'download' | 'quiz', id: number) {
    router.push(`/dashboard/leads/${type}/${id}`);
  }

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    if (!newLeadForm.email.trim()) return;

    setIsAddingLead(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadForm),
      });

      if (!res.ok) throw new Error('Failed to add lead');

      const data = await res.json();
      setLeads([data.lead, ...leads]);
      setNewLeadForm({ name: '', email: '', instagramHandle: '', source: '', status: 'lead' });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead. Please try again.');
    } finally {
      setIsAddingLead(false);
    }
  }

  async function handleStatusChange(e: React.MouseEvent, type: 'download' | 'quiz', id: number, newStatus: LeadStatus) {
    e.stopPropagation();
    const updateId = `${type}-${id}`;
    setUpdatingId(updateId);

    try {
      const apiBase = type === 'quiz' ? '/api/quiz' : '/api/leads';
      const res = await fetch(`${apiBase}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update');

      // Update local state
      if (type === 'quiz') {
        setQuizLeads(quizLeads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      } else {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(e: React.MouseEvent, type: 'download' | 'quiz', id: number) {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this lead?')) return;

    const deleteId = `${type}-${id}`;
    setDeletingId(deleteId);

    try {
      const apiBase = type === 'quiz' ? '/api/quiz' : '/api/leads';
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });

      if (!res.ok) throw new Error('Failed to delete');

      if (type === 'quiz') {
        setQuizLeads(quizLeads.filter(l => l.id !== id));
      } else {
        setLeads(leads.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  function exportToCSV() {
    if (filteredLeads.length === 0) return;

    const headers = ['Name', 'Email', 'Source', 'Status', 'Details', 'Date'];
    const rows = filteredLeads.map(lead => [
      lead.name || '',
      lead.email,
      lead.type === 'quiz' ? 'Quiz' : 'Free Download',
      statusConfig[lead.status]?.label || lead.status,
      lead.type === 'quiz'
        ? archetypeLabels[(lead as QuizLead).archetype]?.label || ''
        : (lead as Lead).productName,
      format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm:ss'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${statusFilter}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
              <p className="text-white/80">Manage your leads pipeline</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Airtable Sync Button */}
            <Button
              onClick={() => setIsAirtableModalOpen(true)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Airtable Sync
            </Button>

            {/* Add Lead Button */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-[#CDA7B2] hover:bg-white/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>
                    Manually add a lead to your pipeline.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddLead}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newLeadForm.name}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={newLeadForm.email}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="instagramHandle">Instagram Handle</Label>
                      <Input
                        id="instagramHandle"
                        value={newLeadForm.instagramHandle}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, instagramHandle: e.target.value })}
                        placeholder="@username"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="source">Source</Label>
                      <Input
                        id="source"
                        value={newLeadForm.source}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                        placeholder="e.g., Instagram, Referral, Event"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={newLeadForm.status}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value as LeadStatus })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="lead">Lead</option>
                        <option value="membership">Membership</option>
                        <option value="one_on_one">1 on 1 Client</option>
                        <option value="lost">Lost Lead</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isAddingLead} className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90">
                      {isAddingLead ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Lead'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Export CSV Button */}
            <Button
              onClick={exportToCSV}
              disabled={filteredLeads.length === 0}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Airtable Sync Modal */}
      <Dialog open={isAirtableModalOpen} onOpenChange={setIsAirtableModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Airtable Integration
            </DialogTitle>
            <DialogDescription>
              Connect your Airtable base to sync leads automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mb-4">
              <p className="text-sm text-amber-800">
                <strong>Coming Soon:</strong> Airtable integration is being set up. You'll be able to:
              </p>
              <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                <li>Connect your Airtable base with an API key</li>
                <li>Map Airtable fields to lead fields</li>
                <li>Sync leads automatically or on-demand</li>
                <li>Two-way sync to keep both systems updated</li>
              </ul>
            </div>
            <Button
              onClick={() => router.push('/dashboard/integrations')}
              className="w-full bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure in Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex gap-6">
        {/* Left Sidebar - Status Filters */}
        <div className="w-56 flex-shrink-0">
          <Card className="dashboard-card border-0">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-[#CDA7B2] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    All Leads
                  </span>
                  <span className={`text-xs font-medium ${statusFilter === 'all' ? 'text-white/80' : 'text-gray-400'}`}>
                    {statusCounts.all}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter('lead')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    statusFilter === 'lead'
                      ? 'bg-[#CDA7B2] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    New Leads
                  </span>
                  <span className={`text-xs font-medium ${statusFilter === 'lead' ? 'text-white/80' : 'text-gray-400'}`}>
                    {statusCounts.lead}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter('membership')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    statusFilter === 'membership'
                      ? 'bg-[#CDA7B2] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Membership
                  </span>
                  <span className={`text-xs font-medium ${statusFilter === 'membership' ? 'text-white/80' : 'text-gray-400'}`}>
                    {statusCounts.membership}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter('one_on_one')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    statusFilter === 'one_on_one'
                      ? 'bg-[#CDA7B2] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    1 on 1 Client
                  </span>
                  <span className={`text-xs font-medium ${statusFilter === 'one_on_one' ? 'text-white/80' : 'text-gray-400'}`}>
                    {statusCounts.one_on_one}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter('lost')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    statusFilter === 'lost'
                      ? 'bg-[#CDA7B2] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserX className="w-4 h-4" />
                    Lost Leads
                  </span>
                  <span className={`text-xs font-medium ${statusFilter === 'lost' ? 'text-white/80' : 'text-gray-400'}`}>
                    {statusCounts.lost}
                  </span>
                </button>
              </div>

              <div className="border-t border-gray-100 my-4" />

              <h3 className="text-sm font-semibold text-gray-700 mb-3">Source</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSourceFilter('all')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sourceFilter === 'all'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  All Sources
                </button>
                <button
                  onClick={() => setSourceFilter('downloads')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sourceFilter === 'downloads'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Free Downloads
                </button>
                <button
                  onClick={() => setSourceFilter('quiz')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sourceFilter === 'quiz'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  Quiz Leads
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Leads Table */}
        <div className="flex-1">
          <Card className="dashboard-card border-0">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading leads...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No leads found</p>
                  <p className="text-sm text-gray-500">
                    {statusFilter !== 'all' || sourceFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Leads will appear here from free downloads and quiz completions'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Source</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Added By</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => {
                        const status = statusConfig[lead.status] || statusConfig.lead;
                        const StatusIcon = status.icon;
                        return (
                          <tr
                            key={`${lead.type}-${lead.id}`}
                            onClick={() => navigateToLead(lead.type, lead.id)}
                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          >
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-900">{lead.name || '-'}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[#CDA7B2]">{lead.email}</span>
                            </td>
                            <td className="py-3 px-4">
                              {lead.type === 'quiz' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                  <Brain className="w-3 h-3" />
                                  Quiz
                                </span>
                              ) : (lead as Lead).productSlug === 'manual-entry' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                  <Plus className="w-3 h-3" />
                                  Manual
                                </span>
                              ) : (lead as Lead).productSlug === 'airtable-import' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                  <RefreshCw className="w-3 h-3" />
                                  Airtable
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  <Package className="w-3 h-3" />
                                  Download
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(e as any, lead.type, lead.id, e.target.value as LeadStatus)}
                                disabled={updatingId === `${lead.type}-${lead.id}`}
                                className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${status.bgColor} ${status.color}`}
                              >
                                <option value="lead">Lead</option>
                                <option value="membership">Membership</option>
                                <option value="one_on_one">1 on 1 Client</option>
                                <option value="lost">Lost Lead</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-500">
                                {lead.type === 'download' && (lead as Lead).addedByName
                                  ? (lead as Lead).addedByName
                                  : '-'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-500">
                                {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={(e) => handleDelete(e, lead.type, lead.id)}
                                  disabled={deletingId === `${lead.type}-${lead.id}`}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                  title="Delete lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
