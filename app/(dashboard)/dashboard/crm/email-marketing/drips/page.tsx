'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Zap,
  Edit,
  Trash2,
  Settings,
  Users,
  Play,
  Pause,
  Mail,
} from 'lucide-react';

interface DripStep {
  id?: number;
  templateId: number;
  stepOrder: number;
  delayDays: number;
  delayHours: number;
  sendTime: string | null;
  isActive: boolean;
  templateName?: string;
  templateSubject?: string;
}

interface DripCampaign {
  id: number;
  name: string;
  description: string | null;
  triggerType: string;
  triggerFilter: string | null;
  audienceType: string;
  isActive: boolean;
  stepCount: number;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
  steps?: DripStep[];
}

interface Template {
  id: number;
  name: string;
  subject: string;
}

interface DripForm {
  name: string;
  description: string;
  triggerType: string;
  audienceType: string;
}

const defaultForm: DripForm = {
  name: '',
  description: '',
  triggerType: 'free_product_download',
  audienceType: 'lead',
};

const triggerTypes = [
  { value: 'free_product_download', label: 'Free Product Download' },
  { value: 'quiz_completion', label: 'Quiz Completion' },
  { value: 'member_signup', label: 'New Member Signup' },
  { value: 'client_signup', label: 'New 1-on-1 Client' },
];

const audienceTypes = [
  { value: 'lead', label: 'Free Product Leads' },
  { value: 'quiz_lead', label: 'Quiz Leads' },
  { value: 'member', label: 'Members' },
  { value: 'client', label: '1-on-1 Clients' },
];

export default function DripsPage() {
  const [dripsList, setDripsList] = useState<DripCampaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [editingDrip, setEditingDrip] = useState<DripCampaign | null>(null);
  const [managingDrip, setManagingDrip] = useState<DripCampaign | null>(null);
  const [form, setForm] = useState<DripForm>(defaultForm);
  const [steps, setSteps] = useState<DripStep[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDrips();
    fetchTemplates();
  }, []);

  async function fetchDrips() {
    try {
      const response = await fetch('/api/email-marketing/drips');
      if (response.ok) {
        const data = await response.json();
        setDripsList(data);
      }
    } catch (error) {
      console.error('Error fetching drip campaigns:', error);
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

  async function fetchDripDetails(id: number) {
    try {
      const response = await fetch(`/api/email-marketing/drips/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching drip details:', error);
    }
    return null;
  }

  function openCreateModal() {
    setEditingDrip(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEditModal(drip: DripCampaign) {
    setEditingDrip(drip);
    setForm({
      name: drip.name,
      description: drip.description || '',
      triggerType: drip.triggerType,
      audienceType: drip.audienceType,
    });
    setShowModal(true);
  }

  async function openStepsModal(drip: DripCampaign) {
    const details = await fetchDripDetails(drip.id);
    if (details) {
      setManagingDrip(details);
      setSteps(details.steps || []);
      setShowStepsModal(true);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const url = editingDrip
        ? `/api/email-marketing/drips/${editingDrip.id}`
        : '/api/email-marketing/drips';

      const response = await fetch(url, {
        method: editingDrip ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowModal(false);
        fetchDrips();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save drip campaign');
      }
    } catch (error) {
      console.error('Error saving drip campaign:', error);
      alert('Failed to save drip campaign');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveSteps() {
    if (!managingDrip) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/email-marketing/drips/${managingDrip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...managingDrip,
          steps,
        }),
      });

      if (response.ok) {
        setShowStepsModal(false);
        fetchDrips();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save steps');
      }
    } catch (error) {
      console.error('Error saving steps:', error);
      alert('Failed to save steps');
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleActive(drip: DripCampaign) {
    try {
      const response = await fetch(`/api/email-marketing/drips/${drip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...drip,
          isActive: !drip.isActive,
        }),
      });

      if (response.ok) {
        fetchDrips();
      } else {
        alert('Failed to update drip campaign');
      }
    } catch (error) {
      console.error('Error toggling drip:', error);
      alert('Failed to update drip campaign');
    }
  }

  async function handleDelete(drip: DripCampaign) {
    if (!confirm(`Are you sure you want to delete "${drip.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/email-marketing/drips/${drip.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDrips();
      } else {
        alert('Failed to delete drip campaign');
      }
    } catch (error) {
      console.error('Error deleting drip campaign:', error);
      alert('Failed to delete drip campaign');
    }
  }

  function addStep() {
    const newStep: DripStep = {
      templateId: templates[0]?.id || 0,
      stepOrder: steps.length + 1,
      delayDays: steps.length === 0 ? 0 : 1,
      delayHours: 0,
      sendTime: '09:00',
      isActive: true,
    };
    setSteps([...steps, newStep]);
  }

  function removeStep(index: number) {
    const newSteps = steps.filter((_, i) => i !== index);
    // Reorder remaining steps
    setSteps(newSteps.map((step, i) => ({ ...step, stepOrder: i + 1 })));
  }

  function updateStep(index: number, updates: Partial<DripStep>) {
    setSteps(steps.map((step, i) => (i === index ? { ...step, ...updates } : step)));
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
          <h1 className="text-3xl font-serif font-light text-[#3B3937]">Drip Campaigns</h1>
          <p className="text-[#967F71] mt-2">
            Set up automated email sequences triggered by user actions
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Drip Campaign
        </Button>
      </div>

      {/* Drips List */}
      {isLoading ? (
        <div className="text-center py-8 text-[#967F71]">Loading drip campaigns...</div>
      ) : dripsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Zap className="h-12 w-12 mx-auto text-[#967F71] mb-4" />
            <h3 className="text-lg font-medium text-[#3B3937] mb-2">No drip campaigns yet</h3>
            <p className="text-[#967F71] mb-4">
              Create automated email sequences for your audience
            </p>
            <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Drip Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {dripsList.map((drip) => (
            <Card key={drip.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-[#3B3937]">{drip.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${drip.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {drip.isActive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                        {drip.isActive ? 'Active' : 'Paused'}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        {triggerTypes.find((t) => t.value === drip.triggerType)?.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[#CDA7B2]/20 text-[#967F71] rounded-full flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {audienceTypes.find((a) => a.value === drip.audienceType)?.label}
                      </span>
                    </div>
                    {drip.description && (
                      <p className="text-sm text-[#967F71] mb-2">{drip.description}</p>
                    )}
                    <div className="flex gap-4 text-xs text-[#967F71]">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {drip.stepCount} email{drip.stepCount !== 1 ? 's' : ''} in sequence
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {drip.enrollmentCount} enrolled
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openStepsModal(drip)}
                      title="Manage Steps"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(drip)}
                      title={drip.isActive ? 'Pause' : 'Activate'}
                    >
                      {drip.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(drip)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(drip)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif font-light text-[#3B3937]">
              {editingDrip ? 'Edit Drip Campaign' : 'Create Drip Campaign'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Welcome Sequence"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this sequence"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="triggerType">Trigger</Label>
              <Select
                value={form.triggerType}
                onValueChange={(value) => setForm({ ...form, triggerType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-[#967F71] mt-1">
                When this event occurs, the sequence will start
              </p>
            </div>

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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !form.name}
              className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white"
            >
              {isSaving ? 'Saving...' : editingDrip ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Steps Management Modal */}
      <Dialog open={showStepsModal} onOpenChange={setShowStepsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif font-light text-[#3B3937]">
              Manage Steps: {managingDrip?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {steps.length === 0 ? (
              <div className="text-center py-8 text-[#967F71]">
                <Mail className="h-8 w-8 mx-auto mb-2" />
                <p>No steps yet. Add your first email to this sequence.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <Card key={index} className="border-l-4 border-l-[#CDA7B2]">
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#CDA7B2] text-white flex items-center justify-center font-medium">
                          {step.stepOrder}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Email Template</Label>
                              <Select
                                value={step.templateId.toString()}
                                onValueChange={(value) =>
                                  updateStep(index, { templateId: parseInt(value) })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                  {templates.map((template) => (
                                    <SelectItem key={template.id} value={template.id.toString()}>
                                      {template.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Send Time</Label>
                              <Input
                                type="time"
                                value={step.sendTime || '09:00'}
                                onChange={(e) => updateStep(index, { sendTime: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Delay Days</Label>
                              <Input
                                type="number"
                                min="0"
                                value={step.delayDays}
                                onChange={(e) =>
                                  updateStep(index, { delayDays: parseInt(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <div>
                              <Label>Delay Hours</Label>
                              <Input
                                type="number"
                                min="0"
                                max="23"
                                value={step.delayHours}
                                onChange={(e) =>
                                  updateStep(index, { delayHours: parseInt(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={step.isActive}
                                  onCheckedChange={(checked) => updateStep(index, { isActive: checked })}
                                />
                                <Label className="text-sm">Active</Label>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-[#967F71]">
                            {index === 0
                              ? 'Sent immediately after trigger (or at specified time if delay is 0)'
                              : `Sent ${step.delayDays} day${step.delayDays !== 1 ? 's' : ''} ${step.delayHours > 0 ? `and ${step.delayHours} hour${step.delayHours !== 1 ? 's' : ''}` : ''} after previous email`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              onClick={addStep}
              className="w-full"
              disabled={templates.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>

            {templates.length === 0 && (
              <p className="text-sm text-orange-600 text-center">
                Create email templates first before adding steps
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStepsModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSteps}
              disabled={isSaving}
              className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white"
            >
              {isSaving ? 'Saving...' : 'Save Steps'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
