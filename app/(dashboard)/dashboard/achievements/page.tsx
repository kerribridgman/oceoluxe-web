'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Plus, Trash2, Edit, Save, X, Loader2, Eye, EyeOff } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  pointsValue: number | null;
  triggerType: string;
  triggerValue: number | null;
  isSecret: boolean;
  createdAt: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    iconUrl: '',
    pointsValue: '',
    triggerType: 'lessons_completed',
    triggerValue: '',
    isSecret: false,
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function seedDefaults() {
    try {
      const response = await fetch('/api/achievements/seed', { method: 'POST' });
      if (response.ok) {
        fetchAchievements();
      }
    } catch (error) {
      console.error('Error seeding achievements:', error);
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function startCreate() {
    setFormData({
      name: '',
      slug: '',
      description: '',
      iconUrl: '',
      pointsValue: '',
      triggerType: 'lessons_completed',
      triggerValue: '',
      isSecret: false,
    });
    setIsCreating(true);
    setEditingId(null);
  }

  function startEdit(achievement: Achievement) {
    setFormData({
      name: achievement.name,
      slug: achievement.slug,
      description: achievement.description || '',
      iconUrl: achievement.iconUrl || '',
      pointsValue: achievement.pointsValue?.toString() || '',
      triggerType: achievement.triggerType,
      triggerValue: achievement.triggerValue?.toString() || '',
      isSecret: achievement.isSecret,
    });
    setEditingId(achievement.id);
    setIsCreating(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const url = isCreating
        ? '/api/achievements'
        : `/api/achievements/${editingId}`;
      const method = isCreating ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pointsValue: formData.pointsValue ? parseInt(formData.pointsValue) : 0,
          triggerValue: formData.triggerValue ? parseInt(formData.triggerValue) : null,
        }),
      });

      if (response.ok) {
        await fetchAchievements();
        cancelEdit();
      }
    } catch (error) {
      console.error('Error saving achievement:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this achievement?')) return;

    try {
      const response = await fetch(`/api/achievements/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAchievements();
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  }

  const triggerTypes = [
    { value: 'lessons_completed', label: 'Lessons Completed' },
    { value: 'courses_completed', label: 'Courses Completed' },
    { value: 'posts_created', label: 'Posts Created' },
    { value: 'streak_days', label: 'Streak Days' },
    { value: 'points_earned', label: 'Points Earned' },
  ];

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Achievements</h1>
              <p className="text-white/80">Manage badges and milestones for gamification</p>
            </div>
          </div>
          <div className="flex gap-2">
            {achievements.length === 0 && (
              <Button
                onClick={seedDefaults}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Seed Defaults
              </Button>
            )}
            <Button
              onClick={startCreate}
              className="bg-white text-[#3B3937] hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Achievement
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="dashboard-card border-0 mb-6">
          <CardHeader>
            <CardTitle>{isCreating ? 'Create Achievement' : 'Edit Achievement'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  placeholder="First Steps"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="first-steps"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Complete your first lesson"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="triggerType">Trigger Type</Label>
                <select
                  id="triggerType"
                  value={formData.triggerType}
                  onChange={(e) =>
                    setFormData({ ...formData, triggerType: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {triggerTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="triggerValue">Trigger Value</Label>
                <Input
                  id="triggerValue"
                  type="number"
                  value={formData.triggerValue}
                  onChange={(e) =>
                    setFormData({ ...formData, triggerValue: e.target.value })
                  }
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointsValue">Points Reward</Label>
                <Input
                  id="pointsValue"
                  type="number"
                  value={formData.pointsValue}
                  onChange={(e) =>
                    setFormData({ ...formData, pointsValue: e.target.value })
                  }
                  placeholder="25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iconUrl">Icon URL</Label>
                <Input
                  id="iconUrl"
                  value={formData.iconUrl}
                  onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                  placeholder="/achievements/badge.svg"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="isSecret"
                  checked={formData.isSecret}
                  onChange={(e) =>
                    setFormData({ ...formData, isSecret: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="isSecret">Secret Achievement (hidden until earned)</Label>
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

      {/* Achievements List */}
      <Card className="dashboard-card border-0">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading achievements...</p>
            </div>
          ) : achievements.length === 0 ? (
            <div className="py-12 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No achievements yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Create achievements to gamify the learning experience
              </p>
              <Button onClick={seedDefaults} variant="outline">
                Seed Default Achievements
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.isSecret
                      ? 'border-dashed border-gray-300 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#CDA7B2]/10 flex items-center justify-center flex-shrink-0">
                      {achievement.iconUrl ? (
                        <img
                          src={achievement.iconUrl}
                          alt={achievement.name}
                          className="w-8 h-8"
                        />
                      ) : (
                        <Trophy className="w-6 h-6 text-[#CDA7B2]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {achievement.name}
                        </h3>
                        {achievement.isSecret && (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {achievement.triggerType.replace('_', ' ')}
                        </span>
                        <span>= {achievement.triggerValue}</span>
                        <span className="text-[#CDA7B2] font-medium">
                          +{achievement.pointsValue} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(achievement)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(achievement.id)}
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
