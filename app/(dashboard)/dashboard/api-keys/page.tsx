'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MmfcApiKey {
  id: number;
  name: string;
  baseUrl: string;
  maskedApiKey?: string;
  autoSync: boolean;
  syncFrequency: string | null;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastSyncError: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<MmfcApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingKeyId, setDeletingKeyId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    baseUrl: 'https://makemoneyfromcoding.com',
    autoSync: false,
    syncFrequency: 'daily',
    skipValidation: false,
  });

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/mmfc-keys');
      console.log('API Keys response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('API Keys data:', data);
        setKeys(data.keys || []);
      } else {
        console.error('API Keys response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/mmfc-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to add API key');
        setIsSubmitting(false);
        return;
      }

      alert('API key added successfully!');
      setIsDialogOpen(false);
      setFormData({
        name: '',
        apiKey: '',
        baseUrl: 'https://makemoneyfromcoding.com',
        autoSync: false,
        syncFrequency: 'daily',
        skipValidation: false,
      });
      await fetchKeys();
    } catch (error) {
      console.error('Error adding API key:', error);
      alert('Failed to add API key');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(keyId: number) {
    if (!confirm('Are you sure you want to delete this API key? This will also delete all associated products and scheduling links.')) {
      return;
    }

    setDeletingKeyId(keyId);
    try {
      const response = await fetch(`/api/mmfc-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('Failed to delete API key');
        return;
      }

      alert('API key deleted successfully');
      fetchKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('Failed to delete API key');
    } finally {
      setDeletingKeyId(null);
    }
  }

  async function handleToggleActive(keyId: number, isActive: boolean) {
    try {
      const response = await fetch(`/api/mmfc-keys/${keyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        alert('Failed to update API key');
        return;
      }

      fetchKeys();
    } catch (error) {
      console.error('Error updating API key:', error);
      alert('Failed to update API key');
    }
  }

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="page-header-gradient mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">API Keys</h1>
              <p>Manage your Make Money from Coding API keys</p>
            </div>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-white text-brand-primary hover:bg-white/90 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="dashboard-card border-0 mb-8 bg-blue-50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About MMFC API Keys</h3>
              <p className="text-sm text-gray-700 mb-3">
                Connect your Make Money from Coding account to sync products and scheduling links.
                You can create API keys in your MMFC dashboard under Settings → API Keys.
              </p>
              <a
                href="https://makemoneyfromcoding.com/dashboard/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-brand-primary hover:text-brand-primary-hover font-medium"
              >
                Go to MMFC API Keys
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your API Keys</h2>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="dashboard-card border-0">
                <CardContent className="pt-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : keys.length === 0 ? (
          <Card className="dashboard-card border-0">
            <CardContent className="py-12 text-center">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Keys Added</h3>
              <p className="text-gray-600 mb-4">
                Add your first MMFC API key to start syncing products and scheduling links
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {keys.map((key) => (
              <Card key={key.id} className="dashboard-card border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{key.name}</CardTitle>
                        {key.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">API Key:</span>
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                              {key.maskedApiKey || '••••••••'}
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Base URL:</span>
                            <span className="text-xs">{key.baseUrl}</span>
                          </div>
                        </div>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(key.id)}
                      disabled={deletingKeyId === key.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className={`w-4 h-4 ${deletingKeyId === key.id ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Auto Sync Status */}
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Auto Sync</div>
                      <div className="font-medium text-gray-900">
                        {key.autoSync ? (
                          <span className="text-green-600">
                            Enabled ({key.syncFrequency})
                          </span>
                        ) : (
                          <span className="text-gray-500">Disabled</span>
                        )}
                      </div>
                    </div>

                    {/* Last Sync */}
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Last Sync</div>
                      <div className="font-medium text-gray-900">
                        {key.lastSyncAt ? (
                          <div className="flex items-center gap-1">
                            {key.lastSyncStatus === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : key.lastSyncStatus === 'error' ? (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            ) : null}
                            <span className="text-sm">
                              {new Date(key.lastSyncAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Never</span>
                        )}
                      </div>
                      {key.lastSyncError && (
                        <div className="text-xs text-red-600 mt-1">{key.lastSyncError}</div>
                      )}
                    </div>

                    {/* Active Toggle */}
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Status</div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={key.isActive}
                          onCheckedChange={(checked) => handleToggleActive(key.id, checked)}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {key.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-3">Quick Actions</div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href="/dashboard/products">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Sync Products
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href="/dashboard/scheduling">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Sync Scheduling
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add API Key Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add MMFC API Key</DialogTitle>
              <DialogDescription>
                Connect your Make Money from Coding account by adding an API key
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production Account"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* API Key */}
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="int_..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">
                  Get your API key from{' '}
                  <a
                    href="https://makemoneyfromcoding.com/dashboard/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    MMFC Dashboard
                  </a>
                </p>
              </div>

              {/* Base URL */}
              <div className="grid gap-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  placeholder="https://makemoneyfromcoding.com"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Usually https://makemoneyfromcoding.com (leave default unless using custom domain)
                </p>
              </div>

              {/* Auto Sync */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSync">Auto Sync</Label>
                  <p className="text-xs text-gray-500">Automatically sync products and scheduling</p>
                </div>
                <Switch
                  id="autoSync"
                  checked={formData.autoSync}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoSync: checked })}
                />
              </div>

              {/* Sync Frequency */}
              {formData.autoSync && (
                <div className="grid gap-2">
                  <Label htmlFor="syncFrequency">Sync Frequency</Label>
                  <Select
                    value={formData.syncFrequency}
                    onValueChange={(value) => setFormData({ ...formData, syncFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Skip Validation */}
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="skipValidation">Skip Validation</Label>
                  <p className="text-xs text-gray-500">Skip API key validation (not recommended)</p>
                </div>
                <Switch
                  id="skipValidation"
                  checked={formData.skipValidation}
                  onCheckedChange={(checked) => setFormData({ ...formData, skipValidation: checked })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add API Key
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
