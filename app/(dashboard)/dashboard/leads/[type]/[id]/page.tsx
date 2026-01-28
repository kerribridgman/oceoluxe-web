'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Package,
  Brain,
  User,
  Trash2,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface Lead {
  id: number;
  email: string;
  name: string | null;
  productSlug?: string;
  productName?: string;
  source?: string | null;
  deliveryEmailSentAt?: string | null;
  archetype?: string;
  scores?: Record<string, number> | null;
  convertedToMember?: boolean;
  emailSequenceStarted?: boolean;
  createdAt: string;
}

interface Application {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string;
  socialHandle: string;
  interest: string;
  experiences: string;
  growthAreas: string;
  obstacles: string;
  willingToInvest: string;
  additionalInfo: string | null;
  status: string;
  createdAt: string;
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string | null;
    email: string;
  };
}

const archetypeLabels: Record<string, { label: string; emoji: string }> = {
  muse: { label: 'The Muse Chaser', emoji: '✨' },
  world: { label: 'The World Builder', emoji: '🌙' },
  intimate: { label: 'The Intimist', emoji: '🤍' },
  editor: { label: 'The Editor', emoji: '✂️' },
  populist: { label: 'The Populist', emoji: '🌍' },
};

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [application, setApplication] = useState<Application | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isQuizLead = type === 'quiz';
  const apiBase = isQuizLead ? '/api/quiz' : '/api/leads';

  useEffect(() => {
    fetchLead();
  }, [id, type]);

  async function fetchLead() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/${id}`);
      if (!res.ok) {
        throw new Error('Lead not found');
      }
      const data = await res.json();
      setLead(data.lead);
      setNotes(data.notes || []);
      setApplication(data.application || null);
    } catch (error: any) {
      console.error('Error fetching lead:', error);
      setError(error.message || 'Failed to load lead');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote.trim() }),
      });

      if (!res.ok) {
        throw new Error('Failed to add note');
      }

      const data = await res.json();
      setNotes([data.note, ...notes]);
      setNewNote('');
    } catch (error: any) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete lead');
      }

      router.push('/dashboard/leads');
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead. Please try again.');
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="flex-1">
        <div className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading lead...</p>
        </div>
      </section>
    );
  }

  if (error || !lead) {
    return (
      <section className="flex-1">
        <div className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || 'Lead not found'}</p>
          <Link href="/dashboard/leads">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1">
      {/* Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                {isQuizLead ? (
                  <Brain className="w-6 h-6 text-white" />
                ) : (
                  <Package className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {lead.name || 'Unknown'}
                </h1>
                <p className="text-white/80">{lead.email}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="outline"
            className="bg-red-500/10 border-red-500/30 text-white hover:bg-red-500/20"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete Lead
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lead Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="dashboard-card border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Lead Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#CDA7B2]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#CDA7B2]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{lead.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#CDA7B2]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#CDA7B2]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-medium text-[#CDA7B2] hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#CDA7B2]/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#CDA7B2]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Added</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(lead.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>

              {isQuizLead && lead.archetype && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Archetype</p>
                    <p className="font-medium text-gray-900">
                      {archetypeLabels[lead.archetype]?.emoji}{' '}
                      {archetypeLabels[lead.archetype]?.label || lead.archetype}
                    </p>
                  </div>
                </div>
              )}

              {!isQuizLead && lead.productName && (
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lead.productSlug === 'inquiry' ? 'bg-[#CDA7B2]/10' : 'bg-blue-100'}`}>
                    <Package className={`w-5 h-5 ${lead.productSlug === 'inquiry' ? 'text-[#CDA7B2]' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{lead.productSlug === 'inquiry' ? 'Inquiry Type' : 'Product Downloaded'}</p>
                    <p className="font-medium text-gray-900">{lead.productName}</p>
                  </div>
                </div>
              )}

              {isQuizLead && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Status</span>
                    {lead.convertedToMember ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Member
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Lead
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="dashboard-card border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-[#CDA7B2]" />
                <span className="text-gray-700">Send Email</span>
              </a>
            </CardContent>
          </Card>

          {/* Application Responses - Only show for inquiry leads */}
          {application && (
            <Card className="dashboard-card border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Application Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900">{application.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Instagram</p>
                  <p className="text-gray-900">{application.socialHandle}</p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">About Their Brand</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{application.interest}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Brand Vision (1-2 Years)</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{application.experiences}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Areas Needing Support</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{application.growthAreas}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Current Challenges</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{application.obstacles}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Ready to Invest?</p>
                  <p className="text-gray-900">{application.willingToInvest === 'yes' ? 'Yes' : 'Not at this time'}</p>
                </div>
                {application.additionalInfo && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Additional Info</p>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{application.additionalInfo}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-2">
          <Card className="dashboard-card border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#CDA7B2]" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="mb-6">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this lead..."
                  rows={3}
                  className="mb-3 resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!newNote.trim() || isSubmitting}
                    className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Add Note
                  </Button>
                </div>
              </form>

              {/* Notes List */}
              {notes.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notes yet</p>
                  <p className="text-sm text-gray-400">Add your first note above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {note.author?.name || note.author?.email || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
