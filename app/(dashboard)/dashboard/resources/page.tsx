'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FolderOpen,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Loader2,
  Eye,
  EyeOff,
  Download,
  ExternalLink,
  FileText,
  Star,
  RefreshCw,
  Check,
  AlertCircle,
} from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  category: string;
  thumbnailUrl: string | null;
  downloadUrl: string | null;
  notionUrl: string | null;
  fileType: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  requiredSubscriptionTier: string | null;
  displayOrder: number;
  downloadCount: number | null;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: 'templates', label: 'Templates', color: 'bg-blue-100 text-blue-700' },
  { value: 'guides', label: 'Guides', color: 'bg-green-100 text-green-700' },
  { value: 'tech-packs', label: 'Tech Packs', color: 'bg-purple-100 text-purple-700' },
  { value: 'mood-boards', label: 'Mood Boards', color: 'bg-pink-100 text-pink-700' },
  { value: 'patterns', label: 'Patterns', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-700' },
];

interface SyncProgress {
  current: number;
  total: number;
  currentTitle: string;
  status: 'created' | 'updated' | 'skipped' | 'error';
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Notion sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    synced: number;
    errors: string[];
  } | null>(null);
  const [syncingResourceId, setSyncingResourceId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: 'templates',
    thumbnailUrl: '',
    downloadUrl: '',
    notionUrl: '',
    fileType: 'pdf',
    requiredSubscriptionTier: '',
    isPublished: false,
    isFeatured: false,
  });

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/resources?includeUnpublished=true');
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function syncFromNotion() {
    setIsSyncing(true);
    setSyncProgress(null);
    setSyncResult(null);

    try {
      const eventSource = new EventSource('/api/notion/sync-resources/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'progress') {
            setSyncProgress({
              current: data.current,
              total: data.total,
              currentTitle: data.currentTitle,
              status: data.status,
            });
          } else if (data.type === 'complete') {
            setSyncResult({
              success: data.success,
              synced: data.synced,
              errors: data.errors,
            });
            setIsSyncing(false);
            setSyncProgress(null);
            eventSource.close();
            fetchResources(); // Refresh the list
          } else if (data.type === 'error') {
            setSyncResult({
              success: false,
              synced: 0,
              errors: [data.error],
            });
            setIsSyncing(false);
            setSyncProgress(null);
            eventSource.close();
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        setSyncResult({
          success: false,
          synced: 0,
          errors: ['Connection lost. Please try again.'],
        });
        setIsSyncing(false);
        setSyncProgress(null);
        eventSource.close();
      };
    } catch (error) {
      console.error('Error starting sync:', error);
      setSyncResult({
        success: false,
        synced: 0,
        errors: ['Failed to start sync'],
      });
      setIsSyncing(false);
    }
  }

  async function syncSingleResource(resourceId: number) {
    setSyncingResourceId(resourceId);
    try {
      const response = await fetch(`/api/notion/sync-resources/${resourceId}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setSyncResult({
          success: true,
          synced: 1,
          errors: [],
        });
        fetchResources(); // Refresh the list
      } else {
        setSyncResult({
          success: false,
          synced: 0,
          errors: [result.message || 'Failed to sync resource'],
        });
      }
    } catch (error) {
      console.error('Error syncing resource:', error);
      setSyncResult({
        success: false,
        synced: 0,
        errors: ['Failed to sync resource'],
      });
    } finally {
      setSyncingResourceId(null);
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function startCreate() {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      category: 'templates',
      thumbnailUrl: '',
      downloadUrl: '',
      notionUrl: '',
      fileType: 'pdf',
      requiredSubscriptionTier: '',
      isPublished: false,
      isFeatured: false,
    });
    setIsCreating(true);
    setEditingId(null);
  }

  function startEdit(resource: Resource) {
    setFormData({
      title: resource.title,
      slug: resource.slug,
      description: resource.description || '',
      content: resource.content || '',
      category: resource.category,
      thumbnailUrl: resource.thumbnailUrl || '',
      downloadUrl: resource.downloadUrl || '',
      notionUrl: resource.notionUrl || '',
      fileType: resource.fileType || 'pdf',
      requiredSubscriptionTier: resource.requiredSubscriptionTier || '',
      isPublished: resource.isPublished,
      isFeatured: resource.isFeatured,
    });
    setEditingId(resource.id);
    setIsCreating(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const url = isCreating ? '/api/resources' : `/api/resources/${editingId}`;
      const method = isCreating ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          requiredSubscriptionTier: formData.requiredSubscriptionTier || null,
        }),
      });

      if (response.ok) {
        await fetchResources();
        cancelEdit();
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this resource?')) return;

    try {
      const response = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchResources();
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  }

  async function togglePublish(id: number, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      if (response.ok) {
        fetchResources();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  }

  function getCategoryColor(category: string) {
    return CATEGORIES.find((c) => c.value === category)?.color || 'bg-gray-100 text-gray-700';
  }

  function getCategoryLabel(category: string) {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  }

  // Filter resources by category
  const filteredResources = activeCategory
    ? resources.filter((r) => r.category === activeCategory)
    : resources;

  // Stats
  const totalResources = resources.length;
  const publishedResources = resources.filter((r) => r.isPublished).length;
  const totalDownloads = resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0);

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Resources</h1>
              <p className="text-white/80">
                Downloadable templates, guides, and materials to support learning
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={syncFromNotion}
              disabled={isSyncing}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync from Notion
                </>
              )}
            </Button>
            <Button onClick={startCreate} className="bg-white text-[#3B3937] hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              New Resource
            </Button>
          </div>
        </div>
      </div>

      {/* Sync Progress/Result Banner */}
      {(syncProgress || syncResult) && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            syncResult
              ? syncResult.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          {syncProgress && (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-blue-900">
                    Syncing: {syncProgress.currentTitle}
                  </span>
                  <span className="text-sm text-blue-600">
                    {syncProgress.current} / {syncProgress.total}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(syncProgress.current / syncProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {syncResult && (
            <div className="flex items-start gap-3">
              {syncResult.success ? (
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p
                  className={`font-medium ${
                    syncResult.success ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {syncResult.success
                    ? `Successfully synced ${syncResult.synced} resource${syncResult.synced !== 1 ? 's' : ''}`
                    : 'Sync failed'}
                </p>
                {syncResult.errors.length > 0 && (
                  <ul className="mt-1 text-sm text-red-700">
                    {syncResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => setSyncResult(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#CDA7B2]/10 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-[#CDA7B2]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{totalResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-gray-900">{publishedResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="dashboard-card border-0 mb-6">
          <CardHeader>
            <CardTitle>{isCreating ? 'Create Resource' : 'Edit Resource'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  placeholder="Production Calendar Template"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="production-calendar-template"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A comprehensive production calendar to track your timeline from sampling to delivery."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <select
                  id="fileType"
                  value={formData.fileType}
                  onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="docx">Word (DOCX)</option>
                  <option value="notion">Notion Template</option>
                  <option value="figma">Figma</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadUrl">Download URL</Label>
                <Input
                  id="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notionUrl">Notion URL (optional)</Label>
                <Input
                  id="notionUrl"
                  value={formData.notionUrl}
                  onChange={(e) => setFormData({ ...formData, notionUrl: e.target.value })}
                  placeholder="https://notion.so/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredSubscriptionTier">Access Level</Label>
                <select
                  id="requiredSubscriptionTier"
                  value={formData.requiredSubscriptionTier}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredSubscriptionTier: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Free (Everyone)</option>
                  <option value="member">Members Only</option>
                </select>
              </div>

              <div className="flex items-center gap-6 md:col-span-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isPublished">Published</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#CDA7B2] text-white hover:bg-[#CDA7B2]/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === null
              ? 'bg-[#CDA7B2] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-[#CDA7B2] text-white'
                : `${cat.color} hover:opacity-80`
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Resources List */}
      <Card className="dashboard-card border-0">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="py-12 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No resources yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Create templates, guides, and materials for your members
              </p>
              <Button onClick={startCreate} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Resource
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`p-4 rounded-lg border ${
                    !resource.isPublished
                      ? 'border-dashed border-gray-300 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-full h-32 rounded-lg bg-gray-100 overflow-hidden mb-3">
                    {resource.thumbnailUrl ? (
                      <img
                        src={resource.thumbnailUrl}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(resource.category)}`}>
                      {getCategoryLabel(resource.category)}
                    </span>
                    {resource.isFeatured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                    {!resource.isPublished && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>

                  <h3 className="font-medium text-gray-900 mb-1 truncate">{resource.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {resource.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="uppercase">{resource.fileType}</span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {resource.downloadCount || 0}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublish(resource.id, resource.isPublished)}
                      className={resource.isPublished ? 'text-green-600' : 'text-gray-400'}
                    >
                      {resource.isPublished ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    {resource.notionUrl && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => syncSingleResource(resource.id)}
                          disabled={syncingResourceId === resource.id}
                          title="Sync from Notion"
                        >
                          {syncingResourceId === resource.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                        <a href={resource.notionUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" title="Open in Notion">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </>
                    )}
                    <div className="flex-1" />
                    <Button variant="ghost" size="sm" onClick={() => startEdit(resource)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resource.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
