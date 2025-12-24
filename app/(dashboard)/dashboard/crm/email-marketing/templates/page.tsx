'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  FileText,
  Edit,
  Trash2,
  Eye,
  Copy,
  Users,
} from 'lucide-react';

interface EmailTemplate {
  id: number;
  name: string;
  description: string | null;
  subject: string;
  body: string;
  category: string | null;
  audienceType: string | null;
  attachments: string | null;
  fromEmail: string;
  fromName: string;
  variables: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplateForm {
  name: string;
  description: string;
  subject: string;
  body: string;
  category: string;
  audienceType: string;
  fromEmail: string;
  fromName: string;
}

const defaultForm: TemplateForm = {
  name: '',
  description: '',
  subject: '',
  body: '',
  category: 'general',
  audienceType: 'all',
  fromEmail: 'kerrib@oceoluxe.com',
  fromName: 'Kerri at Oceo Luxe',
};

const categories = [
  { value: 'general', label: 'General' },
  { value: 'welcome', label: 'Welcome' },
  { value: 'nurture', label: 'Nurture' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'transactional', label: 'Transactional' },
];

const audienceTypes = [
  { value: 'all', label: 'All Contacts' },
  { value: 'lead', label: 'Free Product Leads' },
  { value: 'quiz_lead', label: 'Quiz Leads' },
  { value: 'member', label: 'Members' },
  { value: 'client', label: '1-on-1 Clients' },
];

const variablesList = [
  '{{firstName}}',
  '{{email}}',
  '{{productName}}',
  '{{archetype}}',
  '{{membershipTier}}',
  '{{clientPackage}}',
  '{{instagramHandle}}',
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [form, setForm] = useState<TemplateForm>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/email-marketing/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setEditingTemplate(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEditModal(template: EmailTemplate) {
    setEditingTemplate(template);
    setForm({
      name: template.name,
      description: template.description || '',
      subject: template.subject,
      body: template.body,
      category: template.category || 'general',
      audienceType: template.audienceType || 'all',
      fromEmail: template.fromEmail,
      fromName: template.fromName,
    });
    setShowModal(true);
  }

  function openPreview(template: EmailTemplate) {
    setPreviewTemplate(template);
    setShowPreview(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const url = editingTemplate
        ? `/api/email-marketing/templates/${editingTemplate.id}`
        : '/api/email-marketing/templates';

      const response = await fetch(url, {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowModal(false);
        fetchTemplates();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(template: EmailTemplate) {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/email-marketing/templates/${template.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTemplates();
      } else {
        alert('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  }

  function duplicateTemplate(template: EmailTemplate) {
    setEditingTemplate(null);
    setForm({
      name: `${template.name} (Copy)`,
      description: template.description || '',
      subject: template.subject,
      body: template.body,
      category: template.category || 'general',
      audienceType: template.audienceType || 'all',
      fromEmail: template.fromEmail,
      fromName: template.fromName,
    });
    setShowModal(true);
  }

  function insertVariable(variable: string) {
    setForm((prev) => ({
      ...prev,
      body: prev.body + variable,
    }));
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
          <h1 className="text-3xl font-serif font-light text-[#3B3937]">Email Templates</h1>
          <p className="text-[#967F71] mt-2">
            Create and manage reusable email templates
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Templates List */}
      {isLoading ? (
        <div className="text-center py-8 text-[#967F71]">Loading templates...</div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-[#967F71] mb-4" />
            <h3 className="text-lg font-medium text-[#3B3937] mb-2">No templates yet</h3>
            <p className="text-[#967F71] mb-4">
              Create your first email template to get started
            </p>
            <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-[#3B3937]">{template.name}</h3>
                      {template.category && (
                        <span className="text-xs px-2 py-0.5 bg-[#faf8f5] text-[#967F71] rounded-full">
                          {template.category}
                        </span>
                      )}
                      {template.audienceType && template.audienceType !== 'all' && (
                        <span className="text-xs px-2 py-0.5 bg-[#CDA7B2]/20 text-[#967F71] rounded-full flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {audienceTypes.find((a) => a.value === template.audienceType)?.label}
                        </span>
                      )}
                      {!template.isActive && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#967F71] mb-1">
                      Subject: {template.subject}
                    </p>
                    {template.description && (
                      <p className="text-sm text-[#967F71]">{template.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPreview(template)}
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateTemplate(template)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(template)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Welcome Email"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this template"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="audienceType">Audience Type</Label>
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
                placeholder="e.g., Welcome to Oceo Luxe, {{firstName}}!"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="body">Email Body (HTML)</Label>
                <div className="flex gap-1">
                  {variablesList.map((variable) => (
                    <Button
                      key={variable}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable)}
                      className="text-xs h-6 px-2"
                    >
                      {variable.replace(/\{\{|\}\}/g, '')}
                    </Button>
                  ))}
                </div>
              </div>
              <Textarea
                id="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="<p>Hi {{firstName}},</p>&#10;&#10;<p>Welcome to Oceo Luxe!</p>"
                rows={12}
                className="font-mono text-sm"
              />
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
              {isSaving ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif font-light text-[#3B3937]">
              Preview: {previewTemplate?.name}
            </DialogTitle>
          </DialogHeader>

          {previewTemplate && (
            <div className="space-y-4 py-4">
              <div className="text-sm text-[#967F71]">
                <strong>From:</strong> {previewTemplate.fromName} &lt;{previewTemplate.fromEmail}&gt;
              </div>
              <div className="text-sm text-[#967F71]">
                <strong>Subject:</strong> {previewTemplate.subject}
              </div>
              <div className="border-t pt-4">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.body }}
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
