'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Send,
} from 'lucide-react';

interface Invitation {
  id: number;
  email: string;
  role: string;
  status: string;
  invitedAt: string;
  expiresAt: string | null;
}

export default function TeamSettingsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function fetchInvitations() {
    try {
      const response = await fetch('/api/admin/invites');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      } else if (response.status === 401) {
        setError('You do not have permission to manage invitations');
      }
    } catch (err) {
      console.error('Error fetching invitations:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Invitation sent to ${email}`);
        setEmail('');
        setShowModal(false);
        fetchInvitations();
      } else {
        setError(data.error || 'Failed to send invitation');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsSending(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function isExpired(expiresAt: string | null) {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 text-[#967F71] hover:text-[#3B3937] mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-serif font-light text-[#3B3937]">Team Management</h1>
          <p className="text-[#967F71] mt-2">
            Invite new admins to access the dashboard
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Invite Admin
        </Button>
      </div>

      {error && !showModal && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          {success}
        </div>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif font-light text-[#3B3937]">
            How Admin Invitations Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-[#967F71]">
            <p>1. Only you (kerrib@oceoluxe.com) can send admin invitations</p>
            <p>2. The invited person receives an email with a secure signup link</p>
            <p>3. They create their account and are automatically added as an admin</p>
            <p>4. Invitation links expire after 7 days</p>
          </div>
        </CardContent>
      </Card>

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif font-light text-[#3B3937]">
            Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-[#967F71]">Loading invitations...</div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-[#967F71] mb-4" />
              <p className="text-[#967F71]">No invitations sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => {
                const expired = invitation.status === 'pending' && isExpired(invitation.expiresAt);
                const displayStatus = expired ? 'expired' : invitation.status;

                return (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-[#967F71]" />
                      <div>
                        <p className="font-medium text-[#3B3937]">{invitation.email}</p>
                        <p className="text-sm text-[#967F71]">
                          Invited {formatDate(invitation.invitedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#967F71] capitalize">
                        {invitation.role}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(displayStatus)}`}>
                        {getStatusIcon(displayStatus)}
                        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Invitation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif font-light text-[#3B3937]">
              Invite New Admin
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSendInvite} className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && showModal && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSending || !email}
                className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white"
              >
                {isSending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
