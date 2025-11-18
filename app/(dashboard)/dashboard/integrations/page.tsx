'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Copy, Check, Eye, EyeOff, AlertCircle, Key } from 'lucide-react';
import { format } from 'date-fns';

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

export default function IntegrationsPage() {
  const [apiKeys, setApiKeys] = useState<McpApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState({
    blog: { read: true, write: true }
  });
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    try {
      const response = await fetch('/api/mcp-keys');
      if (!response.ok) throw new Error('Failed to fetch API keys');
      const data = await response.json();
      setApiKeys(data.apiKeys);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateKey() {
    if (!newKeyName.trim()) {
      setError('Please enter a name for the API key');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      // Build permissions object from selected permissions
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
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteKey(id: number) {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/mcp-keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete API key');

      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  function copyToClipboard(text: string, id?: number) {
    navigator.clipboard.writeText(text);
    if (id !== undefined) {
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setNewlyCreatedKey(null);
    setShowNewKey(false);
    setNewKeyName('');
    setSelectedPermissions({ blog: { read: true, write: true } });
    setError(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-600">Loading API keys...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="page-header-gradient mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Integrations</h1>
            <p>Manage API keys and third-party integrations</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key for MCP integration. Make sure to copy it - you won't be able to see it again!
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
                              onChange={(e) => setSelectedPermissions({
                                ...selectedPermissions,
                                blog: { ...selectedPermissions.blog, read: e.target.checked }
                              })}
                              className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-700">Read - List and view blog posts</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.blog.write}
                              onChange={(e) => setSelectedPermissions({
                                ...selectedPermissions,
                                blog: { ...selectedPermissions.blog, write: e.target.checked }
                              })}
                              className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-700">Write - Create, edit, and delete blog posts</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCloseDialog}
                      disabled={creating}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateKey}
                      disabled={creating || !newKeyName.trim()}
                      className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white"
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
                          {showNewKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    onClick={handleCloseDialog}
                    className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white"
                  >
                    Done
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Key className="w-4 h-4" />
          What are MCP API Keys?
        </h3>
        <p className="text-sm text-blue-800">
          Model Context Protocol (MCP) API keys allow you to integrate your blog with Claude Desktop and other MCP-compatible tools.
          With an API key, you can create, edit, and manage blog posts directly from Claude Desktop.
        </p>
      </div>

      {apiKeys.length === 0 ? (
        <Card className="dashboard-card border-0">
          <CardContent className="pt-6 text-center py-12">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Keys Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first API key to start using MCP integration with Claude Desktop
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map((key) => (
            <Card key={key.id} className="dashboard-card border-0">
              <CardHeader className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">{key.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {key.keyPrefix}...
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Status</p>
                    <p className={`font-semibold ${key.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {key.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Last Used</p>
                    <p className="font-medium text-gray-900">
                      {key.lastUsedAt ? format(new Date(key.lastUsedAt), 'MMM d, yyyy') : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Created</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(key.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Permissions</p>
                    <p className="font-medium text-gray-900">Blog: Read, Write</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
