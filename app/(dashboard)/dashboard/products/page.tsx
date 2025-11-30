'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Package, Plus, Trash2, RefreshCw, Eye, EyeOff, ExternalLink, AlertCircle, CheckCircle2, RotateCw, Star, X, Download } from 'lucide-react';
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

interface NotionProduct {
  id: number;
  notionPageId: string;
  title: string;
  slug: string;
  description: string | null;
  price: string | null;
  salePrice: string | null;
  productType: string | null;
  category: string | null;
  coverImageUrl: string | null;
  checkoutUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  updatedAt: string;
}

interface SyncProgress {
  current: number;
  total: number;
  title: string;
  status: 'created' | 'updated' | 'skipped' | 'error';
  percentage: number;
}

export default function ProductsPage() {
  const [apiKeys, setApiKeys] = useState<MmfcApiKey[]>([]);
  const [products, setProducts] = useState<MmfcProduct[]>([]);
  const [notionProducts, setNotionProducts] = useState<NotionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);
  const [syncingKeyId, setSyncingKeyId] = useState<number | null>(null);

  // Notion sync state
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingProductId, setSyncingProductId] = useState<number | null>(null);

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
      const [keysRes, productsRes, notionRes] = await Promise.all([
        fetch('/api/mmfc-keys'),
        fetch('/api/mmfc-products'),
        fetch('/api/notion-products')
      ]);

      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setApiKeys(keysData.keys || []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }

      if (notionRes.ok) {
        const notionData = await notionRes.json();
        setNotionProducts(notionData.products || []);
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

  // Notion sync functions
  async function syncFromNotion(limit?: number) {
    setIsSyncing(true);
    setSyncProgress(null);
    setShowSyncModal(false);

    try {
      const url = limit
        ? `/api/notion/sync-products/stream?limit=${limit}`
        : '/api/notion/sync-products/stream';

      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'progress') {
          setSyncProgress({
            current: data.current,
            total: data.total,
            title: data.title,
            status: data.status,
            percentage: data.percentage,
          });
        } else if (data.type === 'complete') {
          eventSource.close();
          setIsSyncing(false);
          setSyncProgress(null);
          fetchData();

          const created = data.products?.filter((p: any) => p.status === 'created').length || 0;
          const updated = data.products?.filter((p: any) => p.status === 'updated').length || 0;

          if (data.errors?.length > 0) {
            alert(`Sync completed with errors.\nCreated: ${created}\nUpdated: ${updated}\nErrors: ${data.errors.join('\n')}`);
          } else {
            alert(`Sync completed!\nCreated: ${created}\nUpdated: ${updated}`);
          }
        } else if (data.type === 'error') {
          eventSource.close();
          setIsSyncing(false);
          setSyncProgress(null);
          alert(`Sync failed: ${data.message}`);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsSyncing(false);
        setSyncProgress(null);
        alert('Connection lost during sync');
      };
    } catch (error) {
      console.error('Error syncing from Notion:', error);
      setIsSyncing(false);
      setSyncProgress(null);
      alert('Failed to start sync');
    }
  }

  async function syncSingleProduct(productId: number) {
    setSyncingProductId(productId);
    try {
      const response = await fetch(`/api/notion/sync-products/${productId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to sync product');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error syncing product:', error);
      alert('Failed to sync product');
    } finally {
      setSyncingProductId(null);
    }
  }

  async function toggleNotionProductPublished(productId: number, isPublished: boolean) {
    try {
      const response = await fetch('/api/notion-products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isPublished })
      });

      if (!response.ok) {
        alert('Failed to update product');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  }

  async function toggleNotionProductFeatured(productId: number, isFeatured: boolean) {
    try {
      const response = await fetch('/api/notion-products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isFeatured })
      });

      if (!response.ok) {
        alert('Failed to update product');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  }

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Products</h1>
              <p>Manage products from Notion and Make Money from Coding</p>
            </div>
          </div>
          <Button
            onClick={() => setShowSyncModal(true)}
            disabled={isSyncing}
            className="bg-white text-brand-primary hover:bg-white/90 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Sync from Notion
          </Button>
        </div>
      </div>

      {/* Sync Progress Bar */}
      {isSyncing && syncProgress && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Syncing: {syncProgress.title}
            </span>
            <span className="text-sm text-gray-500">
              {syncProgress.current} of {syncProgress.total} ({syncProgress.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-brand-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${syncProgress.percentage}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Status: <span className={
              syncProgress.status === 'created' ? 'text-green-600' :
              syncProgress.status === 'updated' ? 'text-blue-600' :
              syncProgress.status === 'error' ? 'text-red-600' : 'text-gray-600'
            }>
              {syncProgress.status}
            </span>
          </div>
        </div>
      )}

      {/* Notion Products Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Notion Products ({notionProducts.length})</h2>
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

        {notionProducts.length === 0 ? (
          <Card className="dashboard-card border-0">
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No Notion products synced yet</p>
              <Button onClick={() => setShowSyncModal(true)} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Sync from Notion
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notionProducts.map((product) => (
              <Card key={product.id} className="dashboard-card border-0 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {product.coverImageUrl && (
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <img
                      src={product.coverImageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => syncSingleProduct(product.id)}
                      disabled={syncingProductId === product.id}
                      className="shrink-0"
                    >
                      <RotateCw className={`w-4 h-4 ${syncingProductId === product.id ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  {product.description && (
                    <CardDescription className="line-clamp-2 text-sm">
                      {product.description}
                    </CardDescription>
                  )}
                  <div className="flex gap-2 mt-2">
                    {product.productType && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {product.productType}
                      </span>
                    )}
                    {product.category && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {product.price ? (
                        <>
                          <p className="text-2xl font-bold text-brand-primary">
                            {product.salePrice || product.price}
                          </p>
                          {product.salePrice && (
                            <p className="text-sm text-gray-500 line-through">{product.price}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-green-600">Free</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={product.isPublished ? 'default' : 'outline'}
                      onClick={() => toggleNotionProductPublished(product.id, !product.isPublished)}
                      className={product.isPublished ? 'bg-green-600 hover:bg-green-700 flex-1' : 'flex-1'}
                    >
                      {product.isPublished ? (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Draft
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={product.isFeatured ? 'default' : 'outline'}
                      onClick={() => toggleNotionProductFeatured(product.id, !product.isFeatured)}
                      className={product.isFeatured ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                    >
                      <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-200" />

      {/* MMFC API Keys Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">MMFC API Keys</h2>
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <a href="/dashboard/api-keys">
              <Plus className="w-4 h-4 mr-2" />
              Manage API Keys
            </a>
          </Button>
        </div>
        {apiKeys.length === 0 ? (
          <Card className="dashboard-card border-0">
            <CardContent className="py-8 text-center">
              <Package className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No MMFC API keys configured</p>
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

      {/* MMFC Products Section */}
      {products.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">MMFC Products ({products.length})</h2>
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
        </div>
      )}

      {/* Sync Options Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl border-0">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Sync Products from Notion</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSyncModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                Choose how many products to sync from your Notion database
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button
                  onClick={() => syncFromNotion(1)}
                  className="w-full justify-start bg-brand-primary hover:bg-brand-primary-hover"
                >
                  <RefreshCw className="w-4 h-4 mr-3" />
                  Sync Latest Product
                  <span className="ml-auto text-xs opacity-70">Quick update</span>
                </Button>
                <Button
                  onClick={() => syncFromNotion(10)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <RefreshCw className="w-4 h-4 mr-3" />
                  Sync Last 10 Products
                  <span className="ml-auto text-xs text-gray-500">Recent changes</span>
                </Button>
                <Button
                  onClick={() => syncFromNotion()}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <RefreshCw className="w-4 h-4 mr-3" />
                  Sync All Products
                  <span className="ml-auto text-xs text-gray-500">Full sync</span>
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Products are synced from most recently edited first
              </p>
            </CardContent>
          </Card>
        </div>
      )}

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
                    Get your API key from Settings - API Integrations on Make Money from Coding
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
