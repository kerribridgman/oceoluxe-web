'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import {
  Settings,
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
  Database,
} from 'lucide-react';
import { format } from 'date-fns';

interface AirtableConfig {
  id: number;
  name: string;
  apiKey: string;
  baseId: string;
  tableId: string;
  fieldMappings: Record<string, string>;
  syncDirection: string;
  autoSync: boolean;
  syncFrequency: string;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastSyncError: string | null;
  lastSyncCount: number | null;
  isActive: boolean;
  createdAt: string;
}

export default function IntegrationsPage() {
  const [configs, setConfigs] = useState<AirtableConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; fields?: string[] } | null>(null);

  const [newConfig, setNewConfig] = useState({
    name: '',
    apiKey: '',
    baseId: '',
    tableId: '',
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  async function fetchConfigs() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/airtable');
      if (res.ok) {
        const data = await res.json();
        setConfigs(data.configs || []);
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddConfig(e: React.FormEvent) {
    e.preventDefault();
    if (!newConfig.apiKey || !newConfig.baseId || !newConfig.tableId) return;

    setIsAdding(true);
    try {
      const res = await fetch('/api/airtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });

      if (!res.ok) throw new Error('Failed to add configuration');

      const data = await res.json();
      setConfigs([data.config, ...configs]);
      setNewConfig({ name: '', apiKey: '', baseId: '', tableId: '' });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding config:', error);
      alert('Failed to add configuration. Please check your credentials.');
    } finally {
      setIsAdding(false);
    }
  }

  async function handleTestConnection(configId: number) {
    setIsTesting(configId);
    setTestResult(null);
    try {
      const res = await fetch(`/api/airtable/${configId}/test`, { method: 'POST' });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message,
        fields: data.availableFields,
      });
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to test connection' });
    } finally {
      setIsTesting(null);
    }
  }

  async function handleSync(configId: number) {
    setIsSyncing(configId);
    try {
      const res = await fetch(`/api/airtable/${configId}/sync`, { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        alert(`Sync complete! Imported ${data.imported} leads (${data.skipped} skipped).`);
        fetchConfigs(); // Refresh to show updated sync status
      } else {
        alert(`Sync failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Failed to sync. Please try again.');
    } finally {
      setIsSyncing(null);
    }
  }

  async function handleDelete(configId: number) {
    if (!confirm('Are you sure you want to delete this integration?')) return;

    try {
      const res = await fetch(`/api/airtable/${configId}`, { method: 'DELETE' });
      if (res.ok) {
        setConfigs(configs.filter(c => c.id !== configId));
      } else {
        alert('Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  }

  return (
    <section className="flex-1 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard/leads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-500">Connect external services to sync your leads</p>
          </div>
        </div>
      </div>

      {/* Airtable Integration */}
      <Card className="dashboard-card border-0 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFBF00]/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-[#FFBF00]" />
              </div>
              <div>
                <CardTitle>Airtable</CardTitle>
                <CardDescription>Import leads from your Airtable bases</CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Connection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Loading configurations...</p>
            </div>
          ) : configs.length === 0 ? (
            <div className="py-8 text-center">
              <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">No Airtable connections yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Connect your Airtable base to import leads automatically
              </p>
              <a
                href="https://airtable.com/create/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#CDA7B2] hover:underline inline-flex items-center gap-1"
              >
                Get your Airtable API token
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${config.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium text-gray-900">{config.name}</p>
                      <p className="text-sm text-gray-500">
                        Base: {config.baseId} / Table: {config.tableId}
                      </p>
                      {config.lastSyncAt && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          {config.lastSyncStatus === 'success' && (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          )}
                          {config.lastSyncStatus === 'error' && (
                            <XCircle className="w-3 h-3 text-red-500" />
                          )}
                          {config.lastSyncStatus === 'partial' && (
                            <Clock className="w-3 h-3 text-yellow-500" />
                          )}
                          Last sync: {format(new Date(config.lastSyncAt), 'MMM d, yyyy h:mm a')}
                          {config.lastSyncCount !== null && ` (${config.lastSyncCount} imported)`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(config.id)}
                      disabled={isTesting === config.id}
                    >
                      {isTesting === config.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(config.id)}
                      disabled={isSyncing === config.id}
                    >
                      {isSyncing === config.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Sync Now
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(config.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Test Result */}
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.success ? 'Connection successful!' : 'Connection failed'}
              </p>
              <p className={`text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {testResult.message}
              </p>
              {testResult.fields && testResult.fields.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-green-700 font-medium">Available fields:</p>
                  <p className="text-xs text-green-600">{testResult.fields.join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="dashboard-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">How to Connect Airtable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[#CDA7B2]">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Get your API Token</p>
              <p className="text-sm text-gray-500">
                Go to{' '}
                <a
                  href="https://airtable.com/create/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CDA7B2] hover:underline"
                >
                  airtable.com/create/tokens
                </a>
                {' '}and create a personal access token with read access to your base.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[#CDA7B2]">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Find your Base ID</p>
              <p className="text-sm text-gray-500">
                Open your Airtable base and copy the Base ID from the URL. It starts with "app" (e.g., appXXXXXXXXXXXXXX).
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[#CDA7B2]">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Enter your Table Name</p>
              <p className="text-sm text-gray-500">
                Enter the name of the table containing your leads (e.g., "Leads" or "Contacts").
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[#CDA7B2]">4</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Required Fields</p>
              <p className="text-sm text-gray-500">
                Your Airtable should have at minimum an "Email" field. Optional: "Name", "Status", "Source".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Config Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Connect Airtable Base</DialogTitle>
            <DialogDescription>
              Enter your Airtable credentials to import leads.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddConfig}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Connection Name</Label>
                <Input
                  id="name"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                  placeholder="e.g., Lead Tracking Base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Token *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  required
                  value={newConfig.apiKey}
                  onChange={(e) => setNewConfig({ ...newConfig, apiKey: e.target.value })}
                  placeholder="pat..."
                />
                <p className="text-xs text-gray-500">
                  <a
                    href="https://airtable.com/create/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#CDA7B2] hover:underline"
                  >
                    Create a personal access token
                  </a>
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="baseId">Base ID *</Label>
                <Input
                  id="baseId"
                  required
                  value={newConfig.baseId}
                  onChange={(e) => setNewConfig({ ...newConfig, baseId: e.target.value })}
                  placeholder="appXXXXXXXXXXXXXX"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tableId">Table Name *</Label>
                <Input
                  id="tableId"
                  required
                  value={newConfig.tableId}
                  onChange={(e) => setNewConfig({ ...newConfig, tableId: e.target.value })}
                  placeholder="Leads"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAdding} className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90">
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
