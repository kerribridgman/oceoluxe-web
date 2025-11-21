'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, FileCode, Search } from 'lucide-react';

export default function SeoToolsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oceoluxe.com';

  const tools = [
    {
      title: 'Sitemap.xml',
      icon: FileCode,
      description: 'Automatically generated sitemap following Google\'s XML sitemap protocol',
      url: `${siteUrl}/sitemap.xml`,
      features: [
        'Auto-updates when blog posts are published',
        'Includes all published blog posts with lastmod dates',
        'Main pages with priority and change frequency',
        'Google sitemap protocol standards',
      ],
    },
    {
      title: 'Robots.txt',
      icon: Search,
      description: 'SEO-optimized robots.txt file following best practices',
      url: `${siteUrl}/robots.txt`,
      features: [
        'Allows search engines to crawl public pages',
        'Blocks admin dashboard and API routes',
        'Special rules for Googlebot and Googlebot-Image',
        'References sitemap.xml location',
      ],
    },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-2">SEO Tools</h1>
          <p>Automatically generated SEO files following Google's standards</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tools.map((tool) => (
          <Card key={tool.title} className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <tool.icon className="w-5 h-5 text-brand-primary" />
                {tool.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">{tool.description}</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Features:</h3>
                <ul className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open(tool.url, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View {tool.title}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(tool.url);
                    alert('URL copied to clipboard!');
                  }}
                  className="flex-1"
                >
                  Copy URL
                </Button>
              </div>

              <div className="mt-4 p-3 bg-[#CDA7B2]/20 border border-[#CDA7B2] rounded-lg">
                <p className="text-xs text-[#3B3937]">
                  <strong>Note:</strong> These files are automatically generated and updated.
                  The sitemap updates whenever you publish or modify blog posts.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="dashboard-card border-0 bg-gradient-to-br from-[#CDA7B2]/20 to-[#967F71]/20">
        <CardHeader className="border-b border-[#967F71]/20 pb-3">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Google Search Console
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-600 mb-4">
            To help Google discover and index your content, submit your sitemap to Google Search Console:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mb-6">
            <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Google Search Console</a></li>
            <li>Add and verify your website property</li>
            <li>Navigate to Sitemaps in the left menu</li>
            <li>Submit your sitemap URL: <code className="px-2 py-1 bg-white rounded text-brand-primary">{siteUrl}/sitemap.xml</code></li>
          </ol>
          <Button
            onClick={() => window.open('https://search.google.com/search-console', '_blank')}
            className="bg-gradient-to-r from-[#CDA7B2] to-[#967F71] hover:from-[#CDA7B2]/90 hover:to-[#967F71]/90 text-white"
          >
            Open Google Search Console
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
