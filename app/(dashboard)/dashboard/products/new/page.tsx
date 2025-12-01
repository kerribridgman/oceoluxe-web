'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Upload, X, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    coverImageUrl: '',
    productType: 'one_time' as 'one_time' | 'subscription',
    price: '',
    yearlyPrice: '',
    deliveryType: 'download' as 'download' | 'access' | 'email',
    downloadUrl: '',
    accessInstructions: '',
    isPublished: false,
    isFeatured: false,
  });

  function handleNameChange(value: string) {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: prev.slug || value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    }));
  }

  function handlePriceChange(value: string) {
    // Allow only numbers and decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({ ...prev, price: cleaned }));
  }

  function handleYearlyPriceChange(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({ ...prev, yearlyPrice: cleaned }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError(null);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', 'cover');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, coverImageUrl: result.url }));
      } else {
        setError(result.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading image');
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(publish: boolean) {
    if (!formData.name) {
      setError('Product name is required');
      return;
    }

    if (!formData.price) {
      setError('Price is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Convert price to cents
      const priceInCents = Math.round(parseFloat(formData.price) * 100);
      const yearlyPriceInCents = formData.yearlyPrice
        ? Math.round(parseFloat(formData.yearlyPrice) * 100)
        : null;

      const response = await fetch('/api/dashboard-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || undefined,
          description: formData.description || undefined,
          shortDescription: formData.shortDescription || undefined,
          coverImageUrl: formData.coverImageUrl || undefined,
          productType: formData.productType,
          priceInCents,
          yearlyPriceInCents,
          deliveryType: formData.deliveryType,
          downloadUrl: formData.downloadUrl || undefined,
          accessInstructions: formData.accessInstructions || undefined,
          isPublished: publish,
          isFeatured: formData.isFeatured,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create product');
      }

      router.push('/dashboard/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/products">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">New Product</h1>
                <p>Create a new digital product with Stripe integration</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter product name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="auto-generated-from-name"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">URL: /checkout/{formData.slug || 'slug'}</p>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for product cards"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed product description..."
                  rows={6}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div>
                <Label>Product Type</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="productType"
                      value="one_time"
                      checked={formData.productType === 'one_time'}
                      onChange={() => setFormData(prev => ({ ...prev, productType: 'one_time' }))}
                      className="w-4 h-4 text-[#CDA7B2]"
                    />
                    <span className="text-sm font-medium">One-time Purchase</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="productType"
                      value="subscription"
                      checked={formData.productType === 'subscription'}
                      onChange={() => setFormData(prev => ({ ...prev, productType: 'subscription' }))}
                      className="w-4 h-4 text-[#CDA7B2]"
                    />
                    <span className="text-sm font-medium">Subscription</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">
                    {formData.productType === 'subscription' ? 'Monthly Price *' : 'Price *'}
                  </Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="0.00"
                      className="pl-9"
                    />
                  </div>
                </div>

                {formData.productType === 'subscription' && (
                  <div>
                    <Label htmlFor="yearlyPrice">Yearly Price (optional)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="yearlyPrice"
                        value={formData.yearlyPrice}
                        onChange={(e) => handleYearlyPriceChange(e.target.value)}
                        placeholder="0.00"
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave empty for monthly-only</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900">Delivery</CardTitle>
              <CardDescription>How will customers receive this product?</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div>
                <Label>Delivery Type</Label>
                <div className="flex gap-4 mt-2 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="download"
                      checked={formData.deliveryType === 'download'}
                      onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'download' }))}
                      className="w-4 h-4 text-[#CDA7B2]"
                    />
                    <span className="text-sm font-medium">Download Link</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="access"
                      checked={formData.deliveryType === 'access'}
                      onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'access' }))}
                      className="w-4 h-4 text-[#CDA7B2]"
                    />
                    <span className="text-sm font-medium">Access Instructions</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="email"
                      checked={formData.deliveryType === 'email'}
                      onChange={() => setFormData(prev => ({ ...prev, deliveryType: 'email' }))}
                      className="w-4 h-4 text-[#CDA7B2]"
                    />
                    <span className="text-sm font-medium">Email Only</span>
                  </label>
                </div>
              </div>

              {formData.deliveryType === 'download' && (
                <div>
                  <Label htmlFor="downloadUrl">Download URL</Label>
                  <Input
                    id="downloadUrl"
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, downloadUrl: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Direct link to the downloadable file</p>
                </div>
              )}

              {formData.deliveryType === 'access' && (
                <div>
                  <Label htmlFor="accessInstructions">Access Instructions</Label>
                  <Textarea
                    id="accessInstructions"
                    value={formData.accessInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessInstructions: e.target.value }))}
                    placeholder="Instructions for accessing the product..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <Card className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900">Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {formData.coverImageUrl ? (
                <div className="relative">
                  <img
                    src={formData.coverImageUrl}
                    alt="Cover"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => setFormData(prev => ({ ...prev, coverImageUrl: '' }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#CDA7B2] hover:bg-[#CDA7B2]/5 transition-all">
                    <Upload className="w-10 h-10 mx-auto mb-2 text-[#CDA7B2]" />
                    <p className="text-sm text-gray-600 font-medium">
                      {uploadingCover ? 'Uploading...' : 'Upload cover image'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 16:9 ratio</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingCover}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900">Settings</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-[#CDA7B2] rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Featured Product</span>
                  <p className="text-xs text-gray-500">Display prominently on the products page</p>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Stripe Info */}
          <Card className="dashboard-card border-0 bg-gray-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#CDA7B2]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#CDA7B2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Stripe Integration</p>
                  <p className="text-xs text-gray-500">Product will be synced after saving</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                After saving, use the "Sync to Stripe" button on the products page to create this product in Stripe and enable checkout.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
