'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MarkdownRenderer } from '@/components/blog/markdown-renderer';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'og') {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'cover') {
      setUploadingCover(true);
    } else {
      setUploadingOg(true);
    }
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (type === 'cover') {
          setCoverImageUrl(result.url);
        } else {
          setOgImageUrl(result.url);
        }
      } else {
        setError(result.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading image');
    } finally {
      if (type === 'cover') {
        setUploadingCover(false);
      } else {
        setUploadingOg(false);
      }
    }
  }

  async function handleSubmit(publish: boolean) {
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          author: author || undefined,
          excerpt: excerpt || undefined,
          content,
          coverImageUrl: coverImageUrl || undefined,
          ogImageUrl: ogImageUrl || undefined,
          ogTitle: ogTitle || undefined,
          ogDescription: ogDescription || undefined,
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
          metaKeywords: metaKeywords || undefined,
          isPublished: publish,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create blog post');
      }

      router.push('/dashboard/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="page-header-gradient mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/blog">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-2">New Blog Post</h1>
              <p>Create a new blog post</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="bg-white/90 hover:bg-white text-gray-900 border-white shadow-md font-semibold"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg font-semibold"
              onClick={() => handleSubmit(true)}
              disabled={saving}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-error">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {showPreview ? (
        <Card className="dashboard-card border-0">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="text-xl font-semibold text-gray-900">Preview</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="max-w-4xl mx-auto">
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg mb-8"
                />
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title || 'Untitled Post'}</h1>
              <div className="text-gray-600 mb-8">
                By {author || 'Patrick Farrell'} • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              {excerpt && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">{excerpt}</p>
              )}
              <MarkdownRenderer content={content} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Content */}
            <Card className="dashboard-card border-0">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-xl font-semibold text-gray-900">Content</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL: /blog/{slug || 'slug'}</p>
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Patrick Farrell"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary of your post..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content (Markdown) *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Your post content here&#10;&#10;Write in **Markdown**..."
                    rows={20}
                    className="mt-1 font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Images */}
            <Card className="dashboard-card border-0">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-xl font-semibold text-gray-900">Images</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div>
                  <Label>Cover Image</Label>
                  {coverImageUrl ? (
                    <div className="mt-2 relative">
                      <img src={coverImageUrl} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-white"
                        onClick={() => setCoverImageUrl('')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                          <Upload className="w-10 h-10 mx-auto mb-2 text-brand-primary" />
                          <p className="text-sm text-gray-600 font-medium">
                            {uploadingCover ? 'Uploading...' : 'Upload cover image'}
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'cover')}
                          disabled={uploadingCover}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <Label>OG Image (Social Sharing)</Label>
                  {ogImageUrl ? (
                    <div className="mt-2 relative">
                      <img src={ogImageUrl} alt="OG" className="w-full h-32 object-cover rounded-lg" />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-white"
                        onClick={() => setOgImageUrl('')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                          <Upload className="w-10 h-10 mx-auto mb-2 text-brand-primary" />
                          <p className="text-sm text-gray-600 font-medium">
                            {uploadingOg ? 'Uploading...' : 'Upload OG image'}
                          </p>
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
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="dashboard-card border-0">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="text-xl font-semibold text-gray-900">SEO</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title (60 chars)</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title}
                    maxLength={60}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60</p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description (160 chars)</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder={excerpt}
                    maxLength={160}
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160</p>
                </div>

                <div>
                  <Label htmlFor="metaKeywords">Keywords (comma-separated)</Label>
                  <Input
                    id="metaKeywords"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="blog, technology, tutorial"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ogTitle">OG Title</Label>
                  <Input
                    id="ogTitle"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder={title}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ogDescription">OG Description</Label>
                  <Textarea
                    id="ogDescription"
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    placeholder={excerpt}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
