'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Package, Plus, Trash2, RefreshCw, Eye, EyeOff, Settings as SettingsIcon, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface MmfcApiKey {
  id: number;
  name: string;
  baseUrl: string;
  encryptedKey: string; // Encrypted API key
  autoSync: boolean;
  syncFrequency: string;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastSyncError: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MmfcProduct {
  id: number;
  externalId: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  salePrice: string | null;
  featuredImageUrl: string | null;
  isVisible: boolean;
  syncedAt: string;
}

// Helper function to display masked API key for identification
function maskApiKey(encryptedKey: string): string {
  // Show first 8 and last 4 characters of the encrypted key
  if (encryptedKey.length <= 12) return encryptedKey;
  const start = encryptedKey.substring(0, 8);
  const end = encryptedKey.substring(encryptedKey.length - 4);
  return `${start}...${end}`;
}

export default function ProductsPage() {
  const [apiKeys, setApiKeys] = useState<MmfcApiKey[]>([]);
  const [products, setProducts] = useState<MmfcProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);
  const [syncingKeyId, setSyncingKeyId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    baseUrl: 'https://makemoneyfromcoding.com',
    autoSync: false,
    syncFrequency: 'daily',
    skipValidation: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [keysRes, productsRes] = await Promise.all([
        fetch('/api/mmfc-keys'),
        fetch('/api/mmfc-products')
      ]);

      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setApiKeys(keysData.keys || []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddApiKey(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch('/api/mmfc-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to add API key');
        return;
      }

      setShowAddKeyDialog(false);
      setFormData({
        name: '',
        apiKey: '',
        baseUrl: 'https://makemoneyfromcoding.com',
        autoSync: false,
        syncFrequency: 'daily',
        skipValidation: false
      });
      fetchData();
    } catch (error) {
      console.error('Error adding API key:', error);
      alert('Failed to add API key');
    }
  }

  async function handleSyncProducts(keyId: number) {
    setSyncingKeyId(keyId);
    try {
      const response = await fetch(`/api/mmfc-keys/${keyId}/sync`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to sync products');
        return;
      }

      alert(`Successfully synced ${data.productsCount} products!`);
      fetchData();
    } catch (error) {
      console.error('Error syncing products:', error);
      alert('Failed to sync products');
    } finally {
      setSyncingKeyId(null);
    }
  }

  async function handleDeleteKey(keyId: number) {
    if (!confirm('Are you sure? This will delete all synced products from this API key.')) {
      return;
    }

    try {
      const response = await fetch(`/api/mmfc-keys/${keyId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        alert('Failed to delete API key');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('Failed to delete API key');
    }
  }

  async function toggleProductVisibility(productId: number, isVisible: boolean) {
    try {
      const response = await fetch('/api/mmfc-products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isVisible })
      });

      if (!response.ok) {
        alert('Failed to update product visibility');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error updating product visibility:', error);
      alert('Failed to update product visibility');
    }
  }

  return (
    <div className="dashboard-page-container">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">
              Manage products synced from Make Money from Coding
            </p>
          </div>
          <Button onClick={() => setShowAddKeyDialog(true)} className="btn-add">
            <Plus className="w-4 h-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="mb-8">
        <h2 className="section-title">API Keys</h2>
        {apiKeys.length === 0 ? (
          <Card className="empty-state-card">
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No API keys configured</p>
              <Button onClick={() => setShowAddKeyDialog(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First API Key
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {apiKeys.map((key) => (
              <Card key={key.id} className="api-key-card">
                <CardHeader className="api-key-card-header">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-2xl font-bold text-gray-900">{key.name}</CardTitle>
                      <CardDescription className="mt-2 text-base font-medium text-gray-700">
                        {key.baseUrl}
                      </CardDescription>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-gray-300 text-gray-600">
                          {maskApiKey(key.encryptedKey)}
                        </code>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button
                        onClick={() => handleSyncProducts(key.id)}
                        disabled={syncingKeyId === key.id}
                        className="btn-sync"
                      >
                        <RefreshCw className={`w-5 h-5 mr-2 ${syncingKeyId === key.id ? 'animate-spin' : ''}`} />
                        Sync
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteKey(key.id)}
                        title="Delete API Key"
                        className="btn-delete"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6 text-base">
                    <div className="info-box">
                      <p className="info-box-label">Auto Sync</p>
                      <p className="info-box-value">{key.autoSync ? `Yes (${key.syncFrequency})` : 'No'}</p>
                    </div>
                    <div className="info-box">
                      <p className="info-box-label">Last Sync</p>
                      <p className="info-box-value">
                        {key.lastSyncAt ? format(new Date(key.lastSyncAt), 'MMM d, yyyy h:mm a') : 'Never'}
                      </p>
                    </div>
                    {key.lastSyncStatus && (
                      <div className="col-span-2 info-box">
                        <p className="info-box-label mb-2">Status</p>
                        <div className="flex items-center gap-2">
                          {key.lastSyncStatus === 'success' ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="status-success">Success</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 text-red-600" />
                              <span className="status-error">Error: {key.lastSyncError}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Synced Products</h2>
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4a9fd8] hover:text-[#3a8fc8] font-semibold flex items-center gap-2 text-lg"
          >
            View Public Page
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {products.length === 0 ? (
          <Card className="empty-state-card">
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products synced yet</p>
              <p className="text-sm text-gray-500 mt-2">Add an API key and sync to see your products here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.featuredImageUrl && (
                  <img
                    src={product.featuredImageUrl}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-brand-primary">
                        ${product.salePrice || product.price}
                      </p>
                      {product.salePrice && (
                        <p className="text-sm text-gray-500 line-through">${product.price}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={product.isVisible ? 'default' : 'outline'}
                      onClick={() => toggleProductVisibility(product.id, !product.isVisible)}
                    >
                      {product.isVisible ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hidden
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add API Key Dialog */}
      {showAddKeyDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-2xl border-2 border-gray-200">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="text-2xl">Add MMFC API Key</CardTitle>
              <CardDescription className="text-base">
                Connect your Make Money from Coding account to sync products
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddApiKey} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</Label>
                  <Input
                    id="name"
                    placeholder="My MMFC Account"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="apiKey" className="text-sm font-semibold text-gray-700">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="mmfc_..."
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    required
                    className="mt-1.5"
                  />
                  <p className="text-xs text-gray-600 mt-2 bg-blue-50 border border-blue-200 rounded p-2">
                    💡 Get your API key from Settings → API Integrations on Make Money from Coding
                  </p>
                </div>
                <div>
                  <Label htmlFor="baseUrl" className="text-sm font-semibold text-gray-700">Base URL (Optional)</Label>
                  <Input
                    id="baseUrl"
                    placeholder="https://makemoneyfromcoding.com"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoSync"
                        checked={formData.autoSync}
                        onChange={(e) => setFormData({ ...formData, autoSync: e.target.checked })}
                        className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                      />
                      <Label htmlFor="autoSync" className="cursor-pointer font-semibold text-gray-700">
                        Enable auto-sync
                      </Label>
                    </div>
                    {formData.autoSync && (
                      <div className="mt-3 ml-6">
                        <Label htmlFor="syncFrequency" className="text-sm font-semibold text-gray-700">Sync Frequency</Label>
                        <select
                          id="syncFrequency"
                          value={formData.syncFrequency}
                          onChange={(e) => setFormData({ ...formData, syncFrequency: e.target.value })}
                          className="w-full mt-1.5 rounded-md border border-gray-300 p-2.5 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="skipValidation"
                        checked={formData.skipValidation}
                        onChange={(e) => setFormData({ ...formData, skipValidation: e.target.checked })}
                        className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                      />
                      <Label htmlFor="skipValidation" className="cursor-pointer font-semibold text-gray-700">
                        Skip API key validation
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 ml-6">
                      Enable this if API integration is disabled on MMFC but you want to add the key anyway
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddKeyDialog(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-primary hover:bg-brand-primary/90 px-6">
                    Add API Key
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
