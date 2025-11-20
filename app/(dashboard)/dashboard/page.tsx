'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import Link from 'next/link';
import {
  FileText,
  Package,
  TrendingUp,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  BarChart3,
  Settings,
  Users,
  Mail,
  ShoppingCart,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  price: string;
  isVisible: boolean;
  syncedAt: string;
}

interface Application {
  id: number;
  name: string;
  email: string;
  type: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  totalProducts: number;
  visibleProducts: number;
  pendingApplications: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalProducts: 0,
    visibleProducts: 0,
    pendingApplications: 0
  });
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch all data in parallel
        const [blogsRes, productsRes, applicationsRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/mmfc-products'),
          fetch('/api/applications')
        ]);

        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          const blogs = blogsData.posts || [];
          setRecentBlogs(blogs.slice(0, 5));
          setStats(prev => ({
            ...prev,
            totalBlogs: blogs.length,
            publishedBlogs: blogs.filter((b: BlogPost) => b.isPublished).length
          }));
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const products = productsData.products || [];
          setRecentProducts(products.slice(0, 5));
          setStats(prev => ({
            ...prev,
            totalProducts: products.length,
            visibleProducts: products.filter((p: Product) => p.isVisible).length
          }));
        }

        if (applicationsRes.ok) {
          const applicationsData = await applicationsRes.json();
          const applications = applicationsData.applications || [];
          setRecentApplications(applications.slice(0, 3));
          setStats(prev => ({
            ...prev,
            pendingApplications: applications.filter((a: Application) => a.status === 'pending').length
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <section className="flex-1">
      <div className="page-header-gradient mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p>Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="dashboard-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Blog Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBlogs}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.publishedBlogs} published
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.visibleProducts} visible
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingApplications}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Pending review
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Site Traffic</p>
                <p className="text-3xl font-bold text-gray-900">--</p>
                <p className="text-xs text-gray-500 mt-1">
                  Connect analytics
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="dashboard-card border-0 mb-8">
        <CardHeader className="border-b border-gray-100 pb-3">
          <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/blog/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">New Blog Post</span>
              </Button>
            </Link>

            <Link href="/dashboard/products">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Sync Products</span>
              </Button>
            </Link>

            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Analytics</span>
              </Button>
            </Link>

            <Link href="/dashboard/seo">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-amber-50 hover:border-amber-300 transition-colors">
                <Settings className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium">SEO Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Blog Posts */}
        <Card className="dashboard-card border-0">
          <CardHeader className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Recent Blog Posts</CardTitle>
                <CardDescription>Your latest blog content</CardDescription>
              </div>
              <Link href="/dashboard/blog">
                <Button variant="ghost" size="sm" className="text-brand-primary hover:text-brand-primary-hover">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentBlogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No blog posts yet</p>
                <Link href="/dashboard/blog/new">
                  <Button size="sm" className="bg-brand-primary hover:bg-brand-primary-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBlogs.map((post) => (
                  <div key={post.id} className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/blog/${post.id}`} className="block group">
                        <h4 className="font-medium text-gray-900 group-hover:text-brand-primary transition-colors truncate mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(post.createdAt), 'MMM d, yyyy')}
                          </span>
                          {post.isPublished ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Eye className="w-3 h-3" />
                              Published
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400">
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                    <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card className="dashboard-card border-0">
          <CardHeader className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Recent Products</CardTitle>
                <CardDescription>Latest synced products</CardDescription>
              </div>
              <Link href="/dashboard/products">
                <Button variant="ghost" size="sm" className="text-brand-primary hover:text-brand-primary-hover">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No products synced yet</p>
                <Link href="/dashboard/products">
                  <Button size="sm" className="bg-brand-primary hover:bg-brand-primary-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Add API Key & Sync
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="block group">
                        <h4 className="font-medium text-gray-900 group-hover:text-brand-primary transition-colors truncate mb-1">
                          {product.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-semibold text-brand-primary">${product.price}</span>
                          {product.isVisible ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <Eye className="w-3 h-3" />
                              Visible
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400">
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                    <Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      {stats.pendingApplications > 0 && (
        <Card className="dashboard-card border-0">
          <CardHeader className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Pending Applications</CardTitle>
                <CardDescription>New coaching and circle applications</CardDescription>
              </div>
              <Link href="/dashboard/applications">
                <Button variant="ghost" size="sm" className="text-brand-primary hover:text-brand-primary-hover">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate mb-1">{app.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{app.email}</span>
                      <span>•</span>
                      <span className="capitalize">{app.type.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{format(new Date(app.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <Link href="/dashboard/applications">
                    <Button size="sm" variant="outline" className="ml-2 flex-shrink-0">
                      Review
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
