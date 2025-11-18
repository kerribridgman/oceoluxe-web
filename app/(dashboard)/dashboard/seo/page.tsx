'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Save, Upload, X, ExternalLink, FileCode } from 'lucide-react';
import Link from 'next/link';

interface SeoSettings {
  id?: number;
  page: string;
  title: string;
  description: string;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  ogType: string;
  twitterCard: string;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImageUrl: string | null;
  canonicalUrl: string | null;
  metaRobots: string;
}

export default function SeoSettingsPage() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [uploadingTwitter, setUploadingTwitter] = useState(false);

  const [formData, setFormData] = useState<SeoSettings>({
    page: 'home',
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImageUrl: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImageUrl: '',
    canonicalUrl: '',
    metaRobots: 'index, follow',
  });

  useEffect(() => {
    fetchSeoSettings();
  }, [selectedPage]);

  async function fetchSeoSettings() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/seo/${selectedPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch SEO settings');
      }
      const data = await response.json();
      setFormData({
        ...data.seo,
        keywords: data.seo.keywords || '',
        ogTitle: data.seo.ogTitle || '',
        ogDescription: data.seo.ogDescription || '',
        ogImageUrl: data.seo.ogImageUrl || '',
        twitterTitle: data.seo.twitterTitle || '',
        twitterDescription: data.seo.twitterDescription || '',
        twitterImageUrl: data.seo.twitterImageUrl || '',
        canonicalUrl: data.seo.canonicalUrl || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'og' | 'twitter'
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'og') {
      setUploadingOg(true);
    } else {
      setUploadingTwitter(true);
    }
    setError(null);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', 'og');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (response.ok) {
        // Get absolute URL
        const absoluteUrl = result.url.startsWith('http')
          ? result.url
          : `${window.location.origin}${result.url}`;

        if (type === 'og') {
          setFormData({ ...formData, ogImageUrl: absoluteUrl });
        } else {
          setFormData({ ...formData, twitterImageUrl: absoluteUrl });
        }
      } else {
        setError(result.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading image');
    } finally {
      if (type === 'og') {
        setUploadingOg(false);
      } else {
        setUploadingTwitter(false);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/seo/${selectedPage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save SEO settings');
      }

      setSuccess('SEO settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-600">Loading SEO settings...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="page-header-gradient mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              SEO & Open Graph Settings
            </h1>
            <p>
              Manage meta tags, Open Graph, and Twitter Card metadata for better social sharing
            </p>
          </div>
          <Link href="/dashboard/seo/seo-tools">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-green-600 shadow-md font-semibold"
            >
              <FileCode className="w-4 h-4 mr-2" />
              SEO Tools
            </Button>
          </Link>
        </div>
      </div>

      <Card className="dashboard-card border-0">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-fit">
              <Search className="w-5 h-5 text-brand-primary" />
              <Label htmlFor="page-select" className="text-base font-semibold text-gray-900 whitespace-nowrap">Select Page</Label>
            </div>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home Page</SelectItem>
                <SelectItem value="services">Services Page</SelectItem>
                <SelectItem value="blog">Blog Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="alert-error">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="alert-success">
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900">Basic SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Patrick Farrell | Tech Strategy & Business Growth"
                required
                className="mt-1"
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/255 characters</p>
            </div>

            <div>
              <Label htmlFor="description">Meta Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches."
                required
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length} characters</p>
            </div>

            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={formData.keywords || ''}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="tech strategy, business growth, startups"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={formData.canonicalUrl || ''}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://iampatrickfarrell.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="metaRobots">Robots Meta Tag</Label>
                <Select
                  value={formData.metaRobots}
                  onValueChange={(value) => setFormData({ ...formData, metaRobots: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index, follow">Index, Follow</SelectItem>
                    <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                    <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                    <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

          <Card className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900">Open Graph (Facebook/WhatsApp)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input
                id="ogTitle"
                value={formData.ogTitle || ''}
                onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                placeholder={formData.title}
                className="mt-1"
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use page title</p>
            </div>

            <div>
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea
                id="ogDescription"
                value={formData.ogDescription || ''}
                onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                placeholder={formData.description}
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use meta description</p>
            </div>

            <div>
              <Label>OG Image (1200x630px recommended)</Label>
              {formData.ogImageUrl ? (
                <div className="mt-2 relative">
                  <img
                    src={formData.ogImageUrl}
                    alt="OG"
                    className="w-full max-w-md h-auto rounded-lg border"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => setFormData({ ...formData, ogImageUrl: '' })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <a
                    href={formData.ogImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-sm text-brand-primary hover:text-brand-primary-hover"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {formData.ogImageUrl}
                  </a>
                </div>
              ) : (
                <div className="mt-2">
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-primary transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {uploadingOg ? 'Uploading...' : 'Click to upload OG image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'og')}
                      disabled={uploadingOg}
                    />
                  </label>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="ogType">OG Type</Label>
              <Select
                value={formData.ogType}
                onValueChange={(value) => setFormData({ ...formData, ogType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        </div>

        <Card className="dashboard-card border-0">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="text-xl font-semibold text-gray-900">Twitter Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="twitterCard">Card Type</Label>
              <Select
                value={formData.twitterCard}
                onValueChange={(value) => setFormData({ ...formData, twitterCard: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="twitterTitle">Twitter Title</Label>
              <Input
                id="twitterTitle"
                value={formData.twitterTitle || ''}
                onChange={(e) => setFormData({ ...formData, twitterTitle: e.target.value })}
                placeholder={formData.ogTitle || formData.title}
                className="mt-1"
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use OG title</p>
            </div>

            <div>
              <Label htmlFor="twitterDescription">Twitter Description</Label>
              <Textarea
                id="twitterDescription"
                value={formData.twitterDescription || ''}
                onChange={(e) => setFormData({ ...formData, twitterDescription: e.target.value })}
                placeholder={formData.ogDescription || formData.description}
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use OG description</p>
            </div>

            <div>
              <Label>Twitter Image</Label>
              {formData.twitterImageUrl ? (
                <div className="mt-2 relative">
                  <img
                    src={formData.twitterImageUrl}
                    alt="Twitter"
                    className="w-full max-w-md h-auto rounded-lg border"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => setFormData({ ...formData, twitterImageUrl: '' })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <a
                    href={formData.twitterImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-sm text-brand-primary hover:text-brand-primary-hover"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {formData.twitterImageUrl}
                  </a>
                </div>
              ) : (
                <div className="mt-2">
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {uploadingTwitter ? 'Uploading...' : 'Click to upload Twitter image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'twitter')}
                      disabled={uploadingTwitter}
                    />
                  </label>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Leave blank to use OG image</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary-hover text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-200"
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
