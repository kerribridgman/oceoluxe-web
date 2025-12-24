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
  Users,
  Edit,
  Trash2,
  Calendar,
  Instagram,
  Mail,
  Phone,
} from 'lucide-react';

interface Client {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  instagramHandle: string | null;
  packageType: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  sessionsTotal: number;
  sessionsCompleted: number;
  notes: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ClientForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  packageType: string;
  status: string;
  startDate: string;
  endDate: string;
  sessionsTotal: number;
  sessionsCompleted: number;
  notes: string;
  source: string;
}

const defaultForm: ClientForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  instagramHandle: '',
  packageType: 'monthly',
  status: 'active',
  startDate: '',
  endDate: '',
  sessionsTotal: 0,
  sessionsCompleted: 0,
  notes: '',
  source: '',
};

const packageTypes = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
  { value: 'package_3', label: '3-Session Package' },
  { value: 'package_6', label: '6-Session Package' },
  { value: 'package_12', label: '12-Session Package' },
  { value: 'custom', label: 'Custom' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ClientsPage() {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState<ClientForm>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClientsList(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setEditingClient(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEditModal(client: Client) {
    setEditingClient(client);
    setForm({
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      email: client.email,
      phone: client.phone || '',
      instagramHandle: client.instagramHandle || '',
      packageType: client.packageType,
      status: client.status,
      startDate: client.startDate ? client.startDate.split('T')[0] : '',
      endDate: client.endDate ? client.endDate.split('T')[0] : '',
      sessionsTotal: client.sessionsTotal,
      sessionsCompleted: client.sessionsCompleted,
      notes: client.notes || '',
      source: client.source || '',
    });
    setShowModal(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const url = editingClient
        ? `/api/clients/${editingClient.id}`
        : '/api/clients';

      const response = await fetch(url, {
        method: editingClient ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowModal(false);
        fetchClients();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save client');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Failed to save client');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(client: Client) {
    if (!confirm(`Are you sure you want to delete ${client.firstName || client.email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClients();
      } else {
        alert('Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client');
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/crm"
            className="flex items-center gap-2 text-[#967F71] hover:text-[#3B3937] mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CRM
          </Link>
          <h1 className="text-3xl font-serif font-light text-[#3B3937]">1-on-1 Clients</h1>
          <p className="text-[#967F71] mt-2">
            Manage your coaching clients and their sessions
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {clientsList.filter((c) => c.status === 'active').length}
              </p>
              <p className="text-sm text-[#967F71]">Active Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {clientsList.filter((c) => c.packageType === 'monthly').length}
              </p>
              <p className="text-sm text-[#967F71]">Monthly</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {clientsList.filter((c) => c.packageType === 'annual').length}
              </p>
              <p className="text-sm text-[#967F71]">Annual</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {clientsList.length}
              </p>
              <p className="text-sm text-[#967F71]">Total Clients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      {isLoading ? (
        <div className="text-center py-8 text-[#967F71]">Loading clients...</div>
      ) : clientsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-[#967F71] mb-4" />
            <h3 className="text-lg font-medium text-[#3B3937] mb-2">No clients yet</h3>
            <p className="text-[#967F71] mb-4">
              Add your first 1-on-1 coaching client
            </p>
            <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clientsList.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-[#3B3937]">
                        {client.firstName || client.lastName
                          ? `${client.firstName || ''} ${client.lastName || ''}`.trim()
                          : client.email}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(client.status)}`}>
                        {statusOptions.find((s) => s.value === client.status)?.label || client.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[#faf8f5] text-[#967F71] rounded-full">
                        {packageTypes.find((p) => p.value === client.packageType)?.label || client.packageType}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#967F71]">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </span>
                      {client.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </span>
                      )}
                      {client.instagramHandle && (
                        <span className="flex items-center gap-1">
                          <Instagram className="h-3 w-3" />
                          @{client.instagramHandle.replace('@', '')}
                        </span>
                      )}
                      {client.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Started {formatDate(client.startDate)}
                        </span>
                      )}
                      {client.sessionsTotal > 0 && (
                        <span>
                          Sessions: {client.sessionsCompleted}/{client.sessionsTotal}
                        </span>
                      )}
                    </div>
                    {client.notes && (
                      <p className="text-sm text-[#967F71] mt-2 line-clamp-2">{client.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(client)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(client)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif font-light text-[#3B3937]">
              {editingClient ? 'Edit Client' : 'Add Client'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="instagramHandle">Instagram Handle</Label>
              <Input
                id="instagramHandle"
                value={form.instagramHandle}
                onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
                placeholder="@username"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packageType">Package Type</Label>
                <Select
                  value={form.packageType}
                  onValueChange={(value) => setForm({ ...form, packageType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypes.map((pkg) => (
                      <SelectItem key={pkg.value} value={pkg.value}>
                        {pkg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionsTotal">Total Sessions</Label>
                <Input
                  id="sessionsTotal"
                  type="number"
                  min="0"
                  value={form.sessionsTotal}
                  onChange={(e) => setForm({ ...form, sessionsTotal: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="sessionsCompleted">Sessions Completed</Label>
                <Input
                  id="sessionsCompleted"
                  type="number"
                  min="0"
                  value={form.sessionsCompleted}
                  onChange={(e) => setForm({ ...form, sessionsCompleted: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="source">Source (how they found you)</Label>
              <Input
                id="source"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="e.g., Instagram, Referral, Website"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional notes about this client..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !form.email}
              className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white"
            >
              {isSaving ? 'Saving...' : editingClient ? 'Update Client' : 'Add Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
