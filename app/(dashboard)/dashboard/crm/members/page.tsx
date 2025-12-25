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
  CreditCard,
} from 'lucide-react';

interface Member {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  instagram_handle: string | null;
  membership_tier: string;
  status: string;
  start_date: string | null;
  renewal_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  notes: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

interface MemberForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  membershipTier: string;
  status: string;
  startDate: string;
  renewalDate: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  notes: string;
  source: string;
}

const defaultForm: MemberForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  instagramHandle: '',
  membershipTier: 'monthly',
  status: 'active',
  startDate: '',
  renewalDate: '',
  stripeCustomerId: '',
  stripeSubscriptionId: '',
  notes: '',
  source: '',
};

const membershipTiers = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
  { value: 'lifetime', label: 'Lifetime' },
  { value: 'trial', label: 'Trial' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'trialing', label: 'Trialing' },
];

export default function MembersPage() {
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberForm>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data = await response.json();
        setMembersList(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setEditingMember(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEditModal(member: Member) {
    setEditingMember(member);
    setForm({
      firstName: member.first_name || '',
      lastName: member.last_name || '',
      email: member.email,
      phone: member.phone || '',
      instagramHandle: member.instagram_handle || '',
      membershipTier: member.membership_tier,
      status: member.status,
      startDate: member.start_date ? member.start_date.split('T')[0] : '',
      renewalDate: member.renewal_date ? member.renewal_date.split('T')[0] : '',
      stripeCustomerId: member.stripe_customer_id || '',
      stripeSubscriptionId: member.stripe_subscription_id || '',
      notes: member.notes || '',
      source: member.source || '',
    });
    setShowModal(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const url = editingMember
        ? `/api/members/${editingMember.id}`
        : '/api/members';

      const response = await fetch(url, {
        method: editingMember ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowModal(false);
        fetchMembers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save member');
      }
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Failed to save member');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(member: Member) {
    if (!confirm(`Are you sure you want to delete ${member.first_name || member.email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMembers();
      } else {
        alert('Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-orange-100 text-orange-800';
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
          <h1 className="text-3xl font-serif font-light text-[#3B3937]">Members</h1>
          <p className="text-[#967F71] mt-2">
            Manage your Studio Systems membership subscribers
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {membersList.filter((m) => m.status === 'active').length}
              </p>
              <p className="text-sm text-[#967F71]">Active Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {membersList.filter((m) => m.membership_tier === 'monthly').length}
              </p>
              <p className="text-sm text-[#967F71]">Monthly</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {membersList.filter((m) => m.membership_tier === 'annual').length}
              </p>
              <p className="text-sm text-[#967F71]">Annual</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#3B3937]">
                {membersList.length}
              </p>
              <p className="text-sm text-[#967F71]">Total Members</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      {isLoading ? (
        <div className="text-center py-8 text-[#967F71]">Loading members...</div>
      ) : membersList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-[#967F71] mb-4" />
            <h3 className="text-lg font-medium text-[#3B3937] mb-2">No members yet</h3>
            <p className="text-[#967F71] mb-4">
              Add your first Studio Systems member
            </p>
            <Button onClick={openCreateModal} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {membersList.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-[#3B3937]">
                        {member.first_name || member.last_name
                          ? `${member.first_name || ''} ${member.last_name || ''}`.trim()
                          : member.email}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(member.status)}`}>
                        {statusOptions.find((s) => s.value === member.status)?.label || member.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[#faf8f5] text-[#967F71] rounded-full">
                        {membershipTiers.find((t) => t.value === member.membership_tier)?.label || member.membership_tier}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#967F71]">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </span>
                      {member.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </span>
                      )}
                      {member.instagram_handle && (
                        <span className="flex items-center gap-1">
                          <Instagram className="h-3 w-3" />
                          @{member.instagram_handle.replace('@', '')}
                        </span>
                      )}
                      {member.start_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {formatDate(member.start_date)}
                        </span>
                      )}
                      {member.renewal_date && (
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          Renews {formatDate(member.renewal_date)}
                        </span>
                      )}
                    </div>
                    {member.notes && (
                      <p className="text-sm text-[#967F71] mt-2 line-clamp-2">{member.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(member)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member)}
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
              {editingMember ? 'Edit Member' : 'Add Member'}
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
                <Label htmlFor="membershipTier">Membership Tier</Label>
                <Select
                  value={form.membershipTier}
                  onValueChange={(value) => setForm({ ...form, membershipTier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipTiers.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        {tier.label}
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
                <Label htmlFor="renewalDate">Renewal Date</Label>
                <Input
                  id="renewalDate"
                  type="date"
                  value={form.renewalDate}
                  onChange={(e) => setForm({ ...form, renewalDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stripeCustomerId">Stripe Customer ID</Label>
                <Input
                  id="stripeCustomerId"
                  value={form.stripeCustomerId}
                  onChange={(e) => setForm({ ...form, stripeCustomerId: e.target.value })}
                  placeholder="cus_..."
                />
              </div>
              <div>
                <Label htmlFor="stripeSubscriptionId">Stripe Subscription ID</Label>
                <Input
                  id="stripeSubscriptionId"
                  value={form.stripeSubscriptionId}
                  onChange={(e) => setForm({ ...form, stripeSubscriptionId: e.target.value })}
                  placeholder="sub_..."
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
                placeholder="Any additional notes about this member..."
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
              {isSaving ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
