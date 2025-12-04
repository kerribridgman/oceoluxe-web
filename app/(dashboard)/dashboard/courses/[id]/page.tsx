'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  BookOpen,
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  videoDurationMinutes: number | null;
  lessonType: string | null;
  displayOrder: number;
  isPreview: boolean;
  pointsReward: number | null;
}

interface Module {
  id: number;
  title: string;
  description: string | null;
  displayOrder: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  coverImageUrl: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  requiredSubscriptionTier: string | null;
  modules: Module[];
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    coverImageUrl: '',
    difficulty: 'beginner',
    estimatedMinutes: '',
    requiredSubscriptionTier: '',
    isPublished: false,
    isFeatured: false,
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  async function fetchCourse() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
        setFormData({
          title: data.course.title || '',
          slug: data.course.slug || '',
          description: data.course.description || '',
          shortDescription: data.course.shortDescription || '',
          coverImageUrl: data.course.coverImageUrl || '',
          difficulty: data.course.difficulty || 'beginner',
          estimatedMinutes: data.course.estimatedMinutes?.toString() || '',
          requiredSubscriptionTier: data.course.requiredSubscriptionTier || '',
          isPublished: data.course.isPublished || false,
          isFeatured: data.course.isFeatured || false,
        });
        // Expand all modules by default
        setExpandedModules(new Set(data.course.modules.map((m: Module) => m.id)));
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : null,
          requiredSubscriptionTier: formData.requiredSubscriptionTier || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }

      await fetchCourse();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddModule() {
    try {
      const response = await fetch(`/api/courses/${id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Module',
          displayOrder: (course?.modules.length || 0) + 1,
        }),
      });

      if (response.ok) {
        await fetchCourse();
      }
    } catch (error) {
      console.error('Error adding module:', error);
    }
  }

  async function handleDeleteModule(moduleId: number) {
    if (!confirm('Delete this module and all its lessons?')) return;

    try {
      const response = await fetch(`/api/courses/${id}/modules/${moduleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCourse();
      }
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  }

  async function handleAddLesson(moduleId: number) {
    try {
      const response = await fetch(`/api/courses/${id}/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Lesson',
          slug: `lesson-${Date.now()}`,
          displayOrder:
            (course?.modules.find((m) => m.id === moduleId)?.lessons.length || 0) + 1,
        }),
      });

      if (response.ok) {
        await fetchCourse();
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  }

  async function handleDeleteLesson(moduleId: number, lessonId: number) {
    if (!confirm('Delete this lesson?')) return;

    try {
      const response = await fetch(
        `/api/courses/${id}/modules/${moduleId}/lessons/${lessonId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        await fetchCourse();
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  }

  function toggleModule(moduleId: number) {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#CDA7B2]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
        <Link href="/dashboard/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
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
              <h1 className="text-3xl font-bold mb-2 text-white">Edit Course</h1>
              <p className="text-white/80">{course.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className={`text-white ${formData.isPublished ? 'bg-green-500/20' : 'bg-white/10'}`}
              onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
            >
              {formData.isPublished ? (
                <>
                  <Eye className="w-4 h-4 mr-2" /> Published
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-2" /> Draft
                </>
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-white text-[#3B3937] hover:bg-white/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dashboard-card border-0">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                <Input
                  id="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
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
                  <Label htmlFor="estimatedMinutes">Duration (min)</Label>
                  <Input
                    id="estimatedMinutes"
                    type="number"
                    value={formData.estimatedMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedMinutes: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredSubscriptionTier">Access</Label>
                  <select
                    id="requiredSubscriptionTier"
                    value={formData.requiredSubscriptionTier}
                    onChange={(e) =>
                      setFormData({ ...formData, requiredSubscriptionTier: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Free</option>
                    <option value="member">Members Only</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules & Lessons */}
          <Card className="dashboard-card border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Modules & Lessons</CardTitle>
              <Button onClick={handleAddModule} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </CardHeader>
            <CardContent>
              {course.modules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No modules yet. Add your first module to start building the course.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div
                      key={module.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Module Header */}
                      <div
                        className="flex items-center gap-3 p-4 bg-gray-50 cursor-pointer"
                        onClick={() => toggleModule(module.id)}
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-500">Module {moduleIndex + 1}</span>
                        <span className="font-medium flex-1">{module.title}</span>
                        <span className="text-sm text-gray-400">
                          {module.lessons.length} lessons
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteModule(module.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Module Lessons */}
                      {expandedModules.has(module.id) && (
                        <div className="p-4 space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-[#CDA7B2]/50"
                            >
                              <GripVertical className="w-4 h-4 text-gray-300" />
                              {lesson.videoUrl ? (
                                <Video className="w-4 h-4 text-blue-500" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-sm text-gray-500">
                                {lessonIndex + 1}.
                              </span>
                              <span className="flex-1 text-sm">{lesson.title}</span>
                              {lesson.isPreview && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  Preview
                                </span>
                              )}
                              {lesson.videoDurationMinutes && (
                                <span className="text-xs text-gray-400">
                                  {lesson.videoDurationMinutes} min
                                </span>
                              )}
                              <Link
                                href={`/dashboard/courses/${id}/lessons/${lesson.id}`}
                              >
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddLesson(module.id)}
                            className="w-full mt-2"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="dashboard-card border-0">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Modules</span>
                <span className="font-medium">{course.modules.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lessons</span>
                <span className="font-medium">
                  {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    formData.isPublished ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {formData.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card border-0">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.coverImageUrl ? (
                <img
                  src={formData.coverImageUrl}
                  alt="Cover"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-gray-300" />
                </div>
              )}
              <h3 className="font-semibold mb-1">{formData.title || 'Untitled Course'}</h3>
              <p className="text-sm text-gray-500">
                {formData.shortDescription || 'No description'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
