'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Send,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Mail,
  MousePointer,
} from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  subject: string;
  body: string;
  templateId: number | null;
  audienceType: string;
  audienceFilter: string | null;
  attachments: string | null;
  fromEmail: string;
  fromName: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  totalRecipients: number;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
  createdAt: string;
  updatedAt: string;
}

interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
}

interface CampaignForm {
  name: string;
  subject: string;
  body: string;
  templateId: string;
  audienceType: string;
  fromEmail: string;
  fromName: string;
  scheduledAt: string;
}

const defaultForm: CampaignForm = {
  name: '',
  subject: '',
  body: '',
  templateId: '',
  audienceType: 'all',
  fromEmail: 'kerrib@oceoluxe.com',
  fromName: 'Kerri at Oceo Luxe',
  scheduledAt: '',
};

const audienceTypes = [
  { value: 'all', label: 'All Contacts' },
  { value: 'lead', label: 'Free Product Leads' },
  { value: 'quiz_lead', label: 'Quiz Leads' },
  { value: 'member', label: 'Members' },
  { value: 'client', label: '1-on-1 Clients' },
];

export default function CampaignsPage() {
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState<CampaignForm>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, []);

  async function fetchCampaigns() {
    try {
      const response = await fetch('/api/email-marketing/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaignsList(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/email-marketing/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.filter((t: Template & { isActive?: boolean }) => t.isActive !== false));
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }

  function openCreateModal() {
    setEditingCampaign(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEditModal(campaign: Campaign) {
    setEditingCampaign(campaign);
    setForm({
      name: campaign.name,
      subject: campaign.subject,
      body: campaign.body,
      templateId: campaign.templateId?.toString() || '',
      audienceType: campaign.audienceType,
      fromEmail: campaign.fromEmail,
      fromName: campaign.fromName,
      scheduledAt: campaign.scheduledAt ? campaign.scheduledAt.slice(0, 16) : '',
    });
    setShowModal(true);
  }

  function openPreview(campaign: Campaign) {
    setPreviewCampaign(campaign);
    setShowPreview(true);
  }

  function handleTemplateSelect(templateId: string) {
    const template = templates.find((t) => t.id.toString() === templateId);
    if (template) {
      setForm({
        ...form,
        templateId,
        subject: template.subject,
        body: template.body,
      });
    } else {
      setForm({ ...form, templateId });
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const url = editingCampaign
        ? `/api/email-marketing/campaigns/${editingCampaign.id}`
        : '/api/email-marketing/campaigns';

      const payload = {
        ...form,
        templateId: form.templateId ? parseInt(form.templateId) : null,
        scheduledAt: form.scheduledAt || null,
      };

      const response = await fetch(url, {
        method: editingCampaign ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        fetchCampaigns();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save campaign');
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Failed to save campaign');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(campaign: Campaign) {
    if (campaign.status !== 'draft') {
      alert('Only draft campaigns can be deleted');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/email-marketing/campaigns/${campaign.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCampaigns();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'sending':
        return <Send className="h-4 w-4 animate-pulse" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/crm/email-marketing"
            className="flex items-center gap-2 text-[#967F71] hover:text-[#3B3937] mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Email Marketing
          </Link>
          <h1 className="text-3xl font-serif font-light text-[#3B3937]">Campaigns</h1>
          <p className="text-[#967F71] mt-2">
            Create and send one-off email campaigns
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaigns List */}
      {isLoading ? (
        <div className="text-center py-8 text-[#967F71]">Loading campaigns...</div>
      ) : campaignsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Send className="h-12 w-12 mx-auto text-[#967F71] mb-4" />
            <h3 className="text-lg font-medium text-[#3B3937] mb-2">No campaigns yet</h3>
            <p className="text-[#967F71] mb-4">
              Create your first email campaign
            </p>
            <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {campaignsList.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-[#3B3937]">{campaign.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[#CDA7B2]/20 text-[#967F71] rounded-full flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {audienceTypes.find((a) => a.value === campaign.audienceType)?.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#967F71] mb-2">
                      Subject: {campaign.subject}
                    </p>
                    {campaign.status === 'sent' && (
                      <div className="flex flex-wrap gap-4 text-xs text-[#967F71]">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Sent: {campaign.totalSent}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Opens: {campaign.totalOpened} ({campaign.totalSent > 0 ? ((campaign.totalOpened / campaign.totalSent) * 100).toFixed(1) : 0}%)
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="h-3 w-3" />
                          Clicks: {campaign.totalClicked} ({campaign.totalSent > 0 ? ((campaign.totalClicked / campaign.totalSent) * 100).toFixed(1) : 0}%)
                        </span>
                      </div>
                    )}
                    {campaign.scheduledAt && campaign.status === 'scheduled' && (
                      <p className="text-xs text-blue-600">
                        Scheduled for: {formatDate(campaign.scheduledAt)}
                      </p>
                    )}
                    {campaign.sentAt && (
                      <p className="text-xs text-[#967F71]">
                        Sent on: {formatDate(campaign.sentAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPreview(campaign)}
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {campaign.status === 'draft' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(campaign)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(campaign)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif font-light text-[#3B3937]">
              {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., December Newsletter"
                />
              </div>
              <div>
                <Label htmlFor="templateId">Use Template (optional)</Label>
                <Select
                  value={form.templateId}
                  onValueChange={handleTemplateSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No template</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="audienceType">Audience</Label>
                <Select
                  value={form.audienceType}
                  onValueChange={(value) => setForm({ ...form, audienceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceTypes.map((aud) => (
                      <SelectItem key={aud.value} value={aud.value}>
                        {aud.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={form.fromName}
                  onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g., Your December Update from Oceo Luxe"
              />
            </div>

            <div>
              <Label htmlFor="body">Email Body (HTML)</Label>
              <Textarea
                id="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="<p>Hi {{firstName}},</p>&#10;&#10;<p>Here's your update...</p>"
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="scheduledAt">Schedule Send (optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
              <p className="text-xs text-[#967F71] mt-1">
                Leave empty to save as draft
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !form.name || !form.subject || !form.body}
              className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white"
            >
              {isSaving ? 'Saving...' : editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif font-light text-[#3B3937]">
              Preview: {previewCampaign?.name}
            </DialogTitle>
          </DialogHeader>

          {previewCampaign && (
            <div className="space-y-4 py-4">
              <div className="text-sm text-[#967F71]">
                <strong>From:</strong> {previewCampaign.fromName} &lt;{previewCampaign.fromEmail}&gt;
              </div>
              <div className="text-sm text-[#967F71]">
                <strong>Subject:</strong> {previewCampaign.subject}
              </div>
              <div className="text-sm text-[#967F71]">
                <strong>To:</strong> {audienceTypes.find((a) => a.value === previewCampaign.audienceType)?.label}
              </div>
              <div className="border-t pt-4">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewCampaign.body }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
