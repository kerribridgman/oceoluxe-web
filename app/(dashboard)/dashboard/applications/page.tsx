'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Mail,
  Phone,
  Instagram,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import { Application } from '@/lib/db/schema';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filter, setFilter] = useState<'all' | 'coaching' | 'entrepreneur-circle'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const response = await fetch('/api/applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data.applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function updateApplicationStatus(id: number, status: 'approved' | 'rejected', notes?: string) {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      fetchApplications();
      setSelectedApp(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update application');
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (filter !== 'all' && app.type !== filter) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'rejected':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="page-header-gradient mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Applications</h1>
            <p>Review and manage coaching and mastermind applications</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-error">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Programs
          </Button>
          <Button
            variant={filter === 'coaching' ? 'default' : 'outline'}
            onClick={() => setFilter('coaching')}
            size="sm"
          >
            1:1 Coaching
          </Button>
          <Button
            variant={filter === 'entrepreneur-circle' ? 'default' : 'outline'}
            onClick={() => setFilter('entrepreneur-circle')}
            size="sm"
          >
            Entrepreneur Circle
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All Status
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('approved')}
            size="sm"
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('rejected')}
            size="sm"
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Applications List */}
      <Card className="dashboard-card border-0">
        <CardHeader className="border-b border-gray-100 pb-3">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Applications ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No applications found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-brand-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                        <Badge className={`${getStatusColor(app.status)} flex items-center gap-1`}>
                          {getStatusIcon(app.status)}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                          {app.type === 'coaching' ? '1:1 Coaching' : 'Entrepreneur Circle'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4" />
                          <span>{app.socialHandle}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                      className="ml-4"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted {new Date(app.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Application Details</DialogTitle>
            <DialogDescription>
              Review applicant information and take action
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 py-4">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Name</h4>
                  <p className="text-gray-700">{selectedApp.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Program</h4>
                  <p className="text-gray-700">
                    {selectedApp.type === 'coaching' ? '1:1 Tech Coaching' : 'Entrepreneur Circle'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-700">{selectedApp.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-700">{selectedApp.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-1">Social Media</h4>
                  <p className="text-gray-700">{selectedApp.socialHandle}</p>
                </div>
              </div>

              {/* Application Responses */}
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What interests you about working with Patrick?
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.interest}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What kind of experiences do you want to have in your life?
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.experiences}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Where are you looking to grow in your life right now?
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.growthAreas}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What is currently stopping you from achieving your goals?
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.obstacles}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Willing to invest in growth?
                  </h4>
                  <p className="text-gray-700">{selectedApp.willingToInvest === 'yes' ? 'Yes' : 'Not at this time'}</p>
                </div>

                {selectedApp.additionalInfo && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Additional Information
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.additionalInfo}</p>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              {selectedApp.notes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Admin Notes</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedApp.status === 'pending' && (
                <div className="flex gap-3 border-t border-gray-200 pt-6">
                  <Button
                    onClick={() => updateApplicationStatus(selectedApp.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    onClick={() => updateApplicationStatus(selectedApp.id, 'rejected')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
