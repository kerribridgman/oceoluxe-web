'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Key,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
  Database,
  Plug,
} from 'lucide-react';
import { format } from 'date-fns';

// MCP API Key Interface
interface McpApiKey {
  id: number;
  name: string;
  keyPrefix: string;
  permissions: any;
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Airtable Config Interface
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
  // MCP API Keys State
  const [apiKeys, setApiKeys] = useState<McpApiKey[]>([]);
  const [mcpLoading, setMcpLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({
    blog: { read: true, write: true },
  });
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [mcpError, setMcpError] = useState<string | null>(null);
  const [isMcpDialogOpen, setIsMcpDialogOpen] = useState(false);

  // Airtable State
  const [airtableConfigs, setAirtableConfigs] = useState<AirtableConfig[]>([]);
  const [airtableLoading, setAirtableLoading] = useState(true);
  const [isAirtableModalOpen, setIsAirtableModalOpen] = useState(false);
  const [isAddingAirtable, setIsAddingAirtable] = useState(false);
  const [isSyncing, setIsSyncing] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    fields?: string[];
  } | null>(null);
  const [newAirtableConfig, setNewAirtableConfig] = useState({
    name: '',
    apiKey: '',
    baseId: '',
    tableId: '',
  });

  useEffect(() => {
    fetchApiKeys();
    fetchAirtableConfigs();
  }, []);

  // ===== MCP API Keys Functions =====
  async function fetchApiKeys() {
    try {
      const response = await fetch('/api/mcp-keys');
      if (!response.ok) throw new Error('Failed to fetch API keys');
      const data = await response.json();
      setApiKeys(data.apiKeys);
    } catch (err) {
      setMcpError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setMcpLoading(false);
    }
  }

  async function handleCreateKey() {
    if (!newKeyName.trim()) {
      setMcpError('Please enter a name for the API key');
      return;
    }

    setCreating(true);
    setMcpError(null);

    try {
      const permissions: any = {};
      if (selectedPermissions.blog.read || selectedPermissions.blog.write) {
        const blogPerms: string[] = [];
        if (selectedPermissions.blog.read) blogPerms.push('read');
        if (selectedPermissions.blog.write) blogPerms.push('write');
        permissions.blog = blogPerms;
      }

      const response = await fetch('/api/mcp-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName.trim(),
          permissions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create API key');
      }

      const data = await response.json();
      setNewlyCreatedKey(data.apiKey);
      setNewKeyName('');
      await fetchApiKeys();
    } catch (err) {
      setMcpError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteKey(id: number) {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/mcp-keys/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete API key');
      await fetchApiKeys();
    } catch (err) {
      setMcpError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  function copyToClipboard(text: string, id?: number) {
    navigator.clipboard.writeText(text);
    if (id !== undefined) {
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }

  function handleCloseMcpDialog() {
    setIsMcpDialogOpen(false);
    setNewlyCreatedKey(null);
    setShowNewKey(false);
    setNewKeyName('');
    setSelectedPermissions({ blog: { read: true, write: true } });
    setMcpError(null);
  }

  // ===== Airtable Functions =====
  async function fetchAirtableConfigs() {
    setAirtableLoading(true);
    try {
      const res = await fetch('/api/airtable');
      if (res.ok) {
        const data = await res.json();
        setAirtableConfigs(data.configs || []);
      }
    } catch (error) {
      console.error('Error fetching Airtable configs:', error);
    } finally {
      setAirtableLoading(false);
    }
  }

  async function handleAddAirtableConfig(e: React.FormEvent) {
    e.preventDefault();
    if (!newAirtableConfig.apiKey || !newAirtableConfig.baseId || !newAirtableConfig.tableId)
      return;

    setIsAddingAirtable(true);
    try {
      const res = await fetch('/api/airtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAirtableConfig),
      });

      if (!res.ok) throw new Error('Failed to add configuration');

      const data = await res.json();
      setAirtableConfigs([data.config, ...airtableConfigs]);
      setNewAirtableConfig({ name: '', apiKey: '', baseId: '', tableId: '' });
      setIsAirtableModalOpen(false);
    } catch (error) {
      console.error('Error adding Airtable config:', error);
      alert('Failed to add configuration. Please check your credentials.');
    } finally {
      setIsAddingAirtable(false);
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
        fetchAirtableConfigs();
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

  async function handleDeleteAirtable(configId: number) {
    if (!confirm('Are you sure you want to delete this integration?')) return;

    try {
      const res = await fetch(`/api/airtable/${configId}`, { method: 'DELETE' });
      if (res.ok) {
        setAirtableConfigs(airtableConfigs.filter((c) => c.id !== configId));
      } else {
        alert('Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting Airtable config:', error);
    }
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Plug className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Integrations</h1>
            <p className="text-white/80">Connect external services and manage API keys</p>
          </div>
        </div>
      </div>

      {/* Airtable Integration Section */}
      <Card className="dashboard-card border-0">
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
            <Button
              onClick={() => setIsAirtableModalOpen(true)}
              className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Connection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {airtableLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Loading configurations...</p>
            </div>
          ) : airtableConfigs.length === 0 ? (
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
              {airtableConfigs.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${config.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
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
                      onClick={() => handleDeleteAirtable(config.id)}
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
            <div
              className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
            >
              <p
                className={`text-sm font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}
              >
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

          {/* Airtable Instructions */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">How to Connect Airtable</h4>
            <div className="grid gap-3 text-sm">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center text-xs font-medium text-[#CDA7B2] flex-shrink-0">
                  1
                </span>
                <p className="text-gray-600">
                  Get your API token from{' '}
                  <a
                    href="https://airtable.com/create/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#CDA7B2] hover:underline"
                  >
                    airtable.com/create/tokens
                  </a>
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center text-xs font-medium text-[#CDA7B2] flex-shrink-0">
                  2
                </span>
                <p className="text-gray-600">
                  Find your Base ID from the URL (starts with "app")
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center text-xs font-medium text-[#CDA7B2] flex-shrink-0">
                  3
                </span>
                <p className="text-gray-600">
                  Your table should have: <strong>Email</strong> (required), Name, Instagram, Status
                  (optional)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCP API Keys Section */}
      <Card className="dashboard-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>MCP API Keys</CardTitle>
                <CardDescription>
                  Connect Claude Desktop and other MCP-compatible tools
                </CardDescription>
              </div>
            </div>
            <Dialog open={isMcpDialogOpen} onOpenChange={setIsMcpDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key for MCP integration. Make sure to copy it - you won't be
                    able to see it again!
                  </DialogDescription>
                </DialogHeader>

                {!newlyCreatedKey ? (
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="key-name">Key Name</Label>
                      <Input
                        id="key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., Claude Desktop, Production Server"
                        className="mt-1"
                        disabled={creating}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Choose a name that helps you identify where this key is used
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Permissions</Label>
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Blog Management</h4>
                          <div className="space-y-2 ml-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.blog.read}
                                onChange={(e) =>
                                  setSelectedPermissions({
                                    ...selectedPermissions,
                                    blog: { ...selectedPermissions.blog, read: e.target.checked },
                                  })
                                }
                                className="w-4 h-4 text-[#CDA7B2] rounded border-gray-300 focus:ring-[#CDA7B2]"
                              />
                              <span className="text-sm text-gray-700">
                                Read - List and view blog posts
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.blog.write}
                                onChange={(e) =>
                                  setSelectedPermissions({
                                    ...selectedPermissions,
                                    blog: { ...selectedPermissions.blog, write: e.target.checked },
                                  })
                                }
                                className="w-4 h-4 text-[#CDA7B2] rounded border-gray-300 focus:ring-[#CDA7B2]"
                              />
                              <span className="text-sm text-gray-700">
                                Write - Create, edit, and delete blog posts
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {mcpError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{mcpError}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleCloseMcpDialog}
                        disabled={creating}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateKey}
                        disabled={creating || !newKeyName.trim()}
                        className="flex-1 bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
                      >
                        {creating ? 'Creating...' : 'Create Key'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        API Key Created Successfully
                      </h4>
                      <p className="text-xs text-green-800 mb-3">
                        Make sure to copy this key now. You won't be able to see it again!
                      </p>
                      <div className="relative">
                        <Input
                          value={newlyCreatedKey}
                          type={showNewKey ? 'text' : 'password'}
                          readOnly
                          className="font-mono text-sm pr-20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowNewKey(!showNewKey)}
                            className="h-7 w-7 p-0"
                          >
                            {showNewKey ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(newlyCreatedKey)}
                            className="h-7 w-7 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleCloseMcpDialog}
                      className="w-full bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
                    >
                      Done
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {mcpLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Loading API keys...</p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="py-8 text-center">
              <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">No API Keys Yet</p>
              <p className="text-sm text-gray-500">
                Create your first API key to start using MCP integration with Claude Desktop
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${key.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{key.name}</p>
                      <p className="text-sm text-gray-500 font-mono">mcp_{key.keyPrefix}...</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created {format(new Date(key.createdAt), 'MMM d, yyyy')}
                        {key.lastUsedAt &&
                          ` • Last used ${format(new Date(key.lastUsedAt), 'MMM d, yyyy')}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* MCP Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" />
                What are MCP API Keys?
              </h4>
              <p className="text-sm text-purple-700">
                Model Context Protocol (MCP) API keys allow you to integrate your blog with Claude
                Desktop and other MCP-compatible tools. With an API key, you can create, edit, and
                manage blog posts directly from Claude Desktop.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Airtable Add Modal */}
      <Dialog open={isAirtableModalOpen} onOpenChange={setIsAirtableModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Connect Airtable Base</DialogTitle>
            <DialogDescription>Enter your Airtable credentials to import leads.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAirtableConfig}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="airtable-name">Connection Name</Label>
                <Input
                  id="airtable-name"
                  value={newAirtableConfig.name}
                  onChange={(e) =>
                    setNewAirtableConfig({ ...newAirtableConfig, name: e.target.value })
                  }
                  placeholder="e.g., Lead Tracking Base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="airtable-apiKey">API Token *</Label>
                <Input
                  id="airtable-apiKey"
                  type="password"
                  required
                  value={newAirtableConfig.apiKey}
                  onChange={(e) =>
                    setNewAirtableConfig({ ...newAirtableConfig, apiKey: e.target.value })
                  }
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
                <Label htmlFor="airtable-baseId">Base ID *</Label>
                <Input
                  id="airtable-baseId"
                  required
                  value={newAirtableConfig.baseId}
                  onChange={(e) =>
                    setNewAirtableConfig({ ...newAirtableConfig, baseId: e.target.value })
                  }
                  placeholder="appXXXXXXXXXXXXXX"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="airtable-tableId">Table Name *</Label>
                <Input
                  id="airtable-tableId"
                  required
                  value={newAirtableConfig.tableId}
                  onChange={(e) =>
                    setNewAirtableConfig({ ...newAirtableConfig, tableId: e.target.value })
                  }
                  placeholder="Leads"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAirtableModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAddingAirtable}
                className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
              >
                {isAddingAirtable ? (
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
    </div>
  );
}
