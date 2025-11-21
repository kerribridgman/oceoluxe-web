'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, ExternalLink, Link as LinkIcon } from 'lucide-react';

interface LinkSetting {
  id: number;
  key: string;
  label: string;
  url: string;
}

export default function LinksPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkSetting[]>([]);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/links');
      if (!response.ok) {
        throw new Error('Failed to fetch link settings');
      }
      const data = await response.json();
      setLinks(data.links);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save link settings');
      }

      setSuccess('Link settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  function updateLink(key: string, field: 'label' | 'url', value: string) {
    setLinks(links.map(link =>
      link.key === key ? { ...link, [field]: value } : link
    ));
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6">
        <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Links</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="mb-8 rounded-2xl p-8 bg-[#CDA7B2] border border-[#967F71] shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Links</h1>
            <p>Manage external links for your website</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-[#CDA7B2] to-[#967F71] hover:from-[#CDA7B2]/90 hover:to-[#967F71]/90 text-white shadow-lg font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert-error">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="alert-success">
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <div className="grid gap-6">
        {links.map((link) => (
          <Card key={link.key} className="dashboard-card border-0">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-brand-primary" />
                {link.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor={`${link.key}-label`}>Button Label</Label>
                <Input
                  id={`${link.key}-label`}
                  value={link.label}
                  onChange={(e) => updateLink(link.key, 'label', e.target.value)}
                  placeholder="e.g., Book a Free Discovery Call"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The text displayed on buttons throughout your site
                </p>
              </div>

              <div>
                <Label htmlFor={`${link.key}-url`}>URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id={`${link.key}-url`}
                    value={link.url}
                    onChange={(e) => updateLink(link.key, 'url', e.target.value)}
                    placeholder="https://calendly.com/..."
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(link.url, '_blank')}
                    disabled={!link.url}
                    className="shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  The destination URL (e.g., Calendly booking link)
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
