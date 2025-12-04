'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    coverImageUrl: '',
    difficulty: 'beginner',
    estimatedMinutes: '',
    requiredSubscriptionTier: '',
  });

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : null,
          requiredSubscriptionTier: formData.requiredSubscriptionTier || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create course');
      }

      const { course } = await response.json();
      router.push(`/dashboard/courses/${course.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/courses">
              <Button variant="ghost" className="text-white hover:bg-white/10 -ml-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Create Course</h1>
              <p className="text-white/80">Add a new course to Studio Systems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="dashboard-card border-0">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g., Fashion Production Fundamentals"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="fashion-production-fundamentals"
                  required
                />
                <p className="text-xs text-gray-500">
                  URL: /learn/courses/{formData.slug || 'your-slug'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="A brief one-liner about the course"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of what students will learn..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Cover Image URL</Label>
              <Input
                id="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedMinutes">Estimated Duration (minutes)</Label>
                <Input
                  id="estimatedMinutes"
                  type="number"
                  value={formData.estimatedMinutes}
                  onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
                  placeholder="60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredSubscriptionTier">Access Level</Label>
                <select
                  id="requiredSubscriptionTier"
                  value={formData.requiredSubscriptionTier}
                  onChange={(e) => setFormData({ ...formData, requiredSubscriptionTier: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Free (Everyone)</option>
                  <option value="member">Members Only</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/courses">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-[#CDA7B2] text-white hover:bg-[#CDA7B2]/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Course
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
