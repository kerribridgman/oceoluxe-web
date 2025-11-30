'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Eye, Edit, Trash2, RefreshCw, CheckCircle, AlertCircle, RotateCw, X } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  readingTimeMinutes: number | null;
}

interface SyncResult {
  success: boolean;
  message?: string;
  synced?: number;
  errors?: string[];
  posts?: Array<{
    id: string;
    title: string;
    status: 'created' | 'updated' | 'skipped';
  }>;
}

interface SyncProgress {
  current: number;
  total: number;
  title: string;
  status: string;
  percentage: number;
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [syncingPostId, setSyncingPostId] = useState<number | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await fetch('/api/blog');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }

      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete blog post');
    }
  }

  async function togglePublish(post: BlogPost) {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !post.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      // Refresh posts
      fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update blog post');
    }
  }

  async function syncFromNotion(limit?: number) {
    setSyncing(true);
    setSyncResult(null);
    setSyncProgress(null);
    setShowSyncModal(false);

    try {
      const url = limit
        ? `/api/notion/sync-blog/stream?limit=${limit}`
        : '/api/notion/sync-blog/stream';
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
          setSyncResult({
            success: data.success,
            message: `Successfully synced ${data.synced} blog posts`,
            synced: data.synced,
            posts: data.posts,
            errors: data.errors,
          });
          setSyncProgress(null);
          setSyncing(false);
          eventSource.close();
          fetchPosts();
        } else if (data.type === 'error') {
          setSyncResult({
            success: false,
            message: data.message,
          });
          setSyncProgress(null);
          setSyncing(false);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setSyncResult({
          success: false,
          message: 'Connection lost during sync',
        });
        setSyncProgress(null);
        setSyncing(false);
        eventSource.close();
      };
    } catch (err) {
      setSyncResult({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to sync from Notion',
      });
      setSyncing(false);
    }
  }

  async function syncSinglePost(postId: number) {
    setSyncingPostId(postId);

    try {
      const response = await fetch(`/api/notion/sync-blog/${postId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to sync post');
      }

      // Show success message briefly
      alert(data.message);

      // Refresh posts list
      await fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to sync post');
    } finally {
      setSyncingPostId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-600">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
            <p>Create and manage your blog posts</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowSyncModal(true)}
              disabled={syncing}
              variant="outline"
              className="bg-white hover:bg-gray-50 text-brand-navy shadow-lg hover:shadow-xl transition-all duration-200 border border-white/30"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync from Notion'}
            </Button>
            <Link href="/dashboard/blog/new">
              <Button className="bg-white hover:bg-gray-50 text-brand-navy shadow-lg hover:shadow-xl transition-all duration-200 border border-white/30">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      {syncing && syncProgress && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-blue-900">
                    Syncing: {syncProgress.title}
                  </span>
                  <span className="text-sm text-blue-700">
                    {syncProgress.current} / {syncProgress.total} ({syncProgress.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <span className={`inline-block px-2 py-0.5 rounded ${
                syncProgress.status === 'created' ? 'bg-green-200 text-green-800' :
                syncProgress.status === 'updated' ? 'bg-blue-200 text-blue-800' :
                syncProgress.status === 'error' ? 'bg-red-200 text-red-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {syncProgress.status}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {syncResult && (
        <Card className={`mb-6 ${syncResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {syncResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${syncResult.success ? 'text-green-900' : 'text-red-900'}`}>
                  {syncResult.message}
                </p>
                {syncResult.posts && syncResult.posts.length > 0 && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium mb-1">Synced posts:</p>
                    <ul className="space-y-1">
                      {syncResult.posts.map((post) => (
                        <li key={post.id} className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            post.status === 'created' ? 'bg-green-200 text-green-900' :
                            post.status === 'updated' ? 'bg-blue-200 text-blue-900' :
                            'bg-gray-200 text-gray-900'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-gray-700">{post.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {syncResult.errors && syncResult.errors.length > 0 && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium text-red-900 mb-1">Errors:</p>
                    <ul className="list-disc list-inside space-y-1 text-red-800">
                      {syncResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first blog post</p>
            <Link href="/dashboard/blog/new">
              <Button className="bg-[#4a9fd8] hover:bg-[#3a8fc8] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                      {post.isPublished ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                          <Eye className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                          <FileText className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>/{post.slug}</span>
                      {post.readingTimeMinutes && (
                        <span>{post.readingTimeMinutes} min read</span>
                      )}
                      <span>
                        {post.isPublished && post.publishedAt
                          ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                          : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncSinglePost(post.id)}
                      disabled={syncingPostId === post.id || syncing}
                      title="Sync this post from Notion"
                    >
                      <RotateCw className={`w-4 h-4 ${syncingPostId === post.id ? 'animate-spin' : ''}`} />
                    </Button>
                    {post.isPublished && (
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    )}
                    <Link href={`/dashboard/blog/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublish(post)}
                    >
                      {post.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sync Options Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Sync from Notion</h2>
              <button
                onClick={() => setShowSyncModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Choose how many posts to sync from your Notion database:
              </p>
              <button
                onClick={() => syncFromNotion(1)}
                className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-900">
                      Sync Latest Post
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-blue-700">
                      Only sync the most recent post from Notion
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Fastest
                  </span>
                </div>
              </button>
              <button
                onClick={() => syncFromNotion(10)}
                className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-900">
                      Sync Last 10 Posts
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-blue-700">
                      Sync the 10 most recent posts from Notion
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Recommended
                  </span>
                </div>
              </button>
              <button
                onClick={() => syncFromNotion()}
                className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-900">
                      Sync All Posts
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-blue-700">
                      Sync all posts from your Notion database
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    ~60 posts
                  </span>
                </div>
              </button>
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <button
                onClick={() => setShowSyncModal(false)}
                className="w-full py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
