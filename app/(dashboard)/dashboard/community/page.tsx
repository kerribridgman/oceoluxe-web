'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, ThumbsUp, Pin, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: number;
  userId: number;
  title: string | null;
  content: string;
  postType: string | null;
  isPinned: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
  };
  course?: {
    id: number;
    title: string;
  } | null;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/community/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function togglePin(postId: number, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/community/posts/${postId}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !currentStatus }),
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  }

  async function deletePost(postId: number) {
    if (!confirm('Delete this post? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  // Stats
  const totalPosts = posts.length;
  const pinnedPosts = posts.filter((p) => p.isPinned).length;
  const totalLikes = posts.reduce((acc, p) => acc + (p.likesCount || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.commentsCount || 0), 0);

  function getPostTypeColor(type: string | null) {
    switch (type) {
      case 'question':
        return 'bg-blue-100 text-blue-700';
      case 'win':
        return 'bg-green-100 text-green-700';
      case 'resource':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Community</h1>
            <p className="text-white/80">Moderate discussions and member posts</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#CDA7B2]/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#CDA7B2]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Pin className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pinned</p>
                <p className="text-2xl font-bold text-gray-900">{pinnedPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Comments</p>
                <p className="text-2xl font-bold text-gray-900">{totalComments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card className="dashboard-card border-0">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#CDA7B2] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No community posts yet</p>
              <p className="text-sm text-gray-500">
                Posts will appear here when members start discussions
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`p-4 rounded-lg border ${
                    post.isPinned
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 hover:border-[#CDA7B2]/50'
                  } transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && (
                          <Pin className="w-4 h-4 text-yellow-600" />
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getPostTypeColor(
                            post.postType
                          )}`}
                        >
                          {post.postType || 'discussion'}
                        </span>
                        {post.course && (
                          <span className="text-xs text-gray-400">
                            in {post.course.title}
                          </span>
                        )}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-1">
                        {post.title || 'Untitled Post'}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span>By {post.user.name || 'Anonymous'}</span>
                        <span>
                          {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {post.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.commentsCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePin(post.id, post.isPinned)}
                        className={post.isPinned ? 'text-yellow-600' : 'text-gray-400'}
                      >
                        <Pin className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePost(post.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
