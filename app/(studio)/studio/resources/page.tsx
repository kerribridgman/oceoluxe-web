'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FolderOpen,
  Download,
  ExternalLink,
  Search,
  FileText,
  FileSpreadsheet,
  File,
} from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Resource {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  thumbnailUrl: string | null;
  downloadUrl: string | null;
  notionUrl: string | null;
  fileType: string | null;
  downloadCount: number;
}

const fileTypeIcons: Record<string, any> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileText,
  notion: ExternalLink,
};

const categoryColors: Record<string, string> = {
  Guide: 'bg-blue-100 text-blue-700',
  Fabric: 'bg-green-100 text-green-700',
  Tech: 'bg-purple-100 text-purple-700',
  Customer: 'bg-orange-100 text-orange-700',
};

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: resources, isLoading } = useSWR<Resource[]>(
    '/api/resources',
    fetcher
  );

  const categories = resources
    ? [...new Set(resources.map((r) => r.category))].sort()
    : [];

  const filteredResources = resources?.filter((resource) => {
    const matchesSearch =
      !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function handleDownload(resource: Resource) {
    const url = resource.downloadUrl || resource.notionUrl;
    if (url) {
      window.open(url, '_blank');
      // Track download
      fetch(`/api/resources/${resource.id}/download`, { method: 'POST' });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Resources</h1>
        <p className="text-gray-500 mt-1">
          Templates, guides, and tools to help your business
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={
              selectedCategory === null
                ? 'bg-[#CDA7B2] hover:bg-[#CDA7B2]/90'
                : ''
            }
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={
                selectedCategory === cat
                  ? 'bg-[#CDA7B2] hover:bg-[#CDA7B2]/90'
                  : ''
              }
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white border-0 shadow-sm animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredResources && filteredResources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const IconComponent =
              fileTypeIcons[resource.fileType || ''] || File;

            return (
              <Card
                key={resource.id}
                className="bg-white border-0 shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
                  {resource.thumbnailUrl ? (
                    <img
                      src={resource.thumbnailUrl}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#CDA7B2]/20 to-[#3B3937]/10">
                      <FolderOpen className="w-12 h-12 text-[#CDA7B2]/50" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-3 left-3 ${
                      categoryColors[resource.category] ||
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {resource.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase flex items-center gap-1">
                      <IconComponent className="w-3 h-3" />
                      {resource.fileType || 'File'}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(resource)}
                      className="bg-[#CDA7B2] hover:bg-[#CDA7B2]/90"
                    >
                      {resource.fileType === 'notion' ? (
                        <>
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory
                ? 'Try adjusting your search or filters'
                : 'Check back soon for new resources'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
