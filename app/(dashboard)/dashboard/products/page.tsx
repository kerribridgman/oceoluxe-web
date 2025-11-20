'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Package, Plus, Trash2, RefreshCw, Eye, EyeOff, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface MmfcApiKey {
  id: number;
  name: string;
  baseUrl: string;
  maskedApiKey: string;
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
  coverImage: string | null;
  isVisible: boolean;
  syncedAt: string;
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
    <section className="flex-1">
      {/* Page Header */}
      <div className="page-header-gradient mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Products</h1>
              <p>Manage products synced from Make Money from Coding</p>
            </div>
          </div>
          <Button
            asChild
            className="bg-white text-brand-primary hover:bg-white/90 shadow-lg"
          >
            <a href="/dashboard/api-keys">
              <Plus className="w-4 h-4 mr-2" />
              Manage API Keys
            </a>
          </Button>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h2>
        {apiKeys.length === 0 ? (
          <Card className="dashboard-card border-0">
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No API keys configured</p>
              <Button asChild variant="outline">
                <a href="/dashboard/api-keys">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First API Key
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id} className="dashboard-card border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{key.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{key.baseUrl}</p>
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-600 mt-2 inline-block">
                        {key.maskedApiKey}
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSyncProducts(key.id)}
                        disabled={syncingKeyId === key.id}
                        size="sm"
                        className="bg-brand-primary hover:bg-brand-primary-hover"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${syncingKeyId === key.id ? 'animate-spin' : ''}`} />
                        Sync
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteKey(key.id)}
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-gray-500">Auto Sync</p>
                      <p className="font-medium text-gray-900">{key.autoSync ? `Yes (${key.syncFrequency})` : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Sync</p>
                      <p className="font-medium text-gray-900">
                        {key.lastSyncAt ? format(new Date(key.lastSyncAt), 'MMM d, h:mm a') : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <div className="flex items-center gap-1.5">
                        {key.lastSyncStatus === 'success' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-600">Success</span>
                          </>
                        ) : key.lastSyncStatus === 'error' ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-600">Error</span>
                          </>
                        ) : (
                          <span className="font-medium text-gray-400">-</span>
                        )}
                      </div>
                    </div>
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
          <h2 className="text-lg font-semibold text-gray-900">Synced Products</h2>
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:text-brand-primary-hover font-medium flex items-center gap-2 text-sm"
          >
            View Public Page
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {products.length === 0 ? (
          <Card className="dashboard-card border-0">
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products synced yet</p>
              <p className="text-sm text-gray-500 mt-2">Add an API key and sync to see your products here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="dashboard-card border-0 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {(product.featuredImageUrl || product.coverImage) && (
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={product.featuredImageUrl || product.coverImage || ''}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                  {product.description && (
                    <CardDescription className="line-clamp-2 text-sm">
                      {product.description}
                    </CardDescription>
                  )}
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
                      className={product.isVisible ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {product.isVisible ? (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
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
          <Card className="w-full max-w-lg bg-white shadow-2xl border-0">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-2xl font-bold">Add MMFC API Key</CardTitle>
              <CardDescription className="text-base">
                Connect your Make Money from Coding account to sync products
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddApiKey} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
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
                  <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">API Key</Label>
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
                  <Label htmlFor="baseUrl" className="text-sm font-medium text-gray-700">Base URL (Optional)</Label>
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
                      <Label htmlFor="autoSync" className="cursor-pointer font-medium text-gray-700">
                        Enable auto-sync
                      </Label>
                    </div>
                    {formData.autoSync && (
                      <div className="mt-3 ml-6">
                        <Label htmlFor="syncFrequency" className="text-sm font-medium text-gray-700">Sync Frequency</Label>
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
                      <Label htmlFor="skipValidation" className="cursor-pointer font-medium text-gray-700">
                        Skip API key validation
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 ml-6">
                      Enable this if API integration is disabled on MMFC but you want to add the key anyway
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
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
    </section>
  );
}
