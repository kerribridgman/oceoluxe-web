'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, RefreshCw, Eye, EyeOff, ExternalLink, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';

interface MmfcApiKey {
  id: number;
  name: string;
}

interface SchedulingLink {
  id: number;
  apiKeyId: number;
  externalId: number;
  slug: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  bookingUrl: string;
  maxAdvanceBookingDays: number | null;
  minNoticeMinutes: number | null;
  isEnabled: boolean;
  syncedAt: string;
  apiKeyName?: string;
}

export default function SchedulingPage() {
  const [links, setLinks] = useState<SchedulingLink[]>([]);
  const [apiKeys, setApiKeys] = useState<MmfcApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncingKeyId, setSyncingKeyId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [linksRes, keysRes] = await Promise.all([
        fetch('/api/mmfc-scheduling'),
        fetch('/api/mmfc-keys')
      ]);

      if (linksRes.ok) {
        const linksData = await linksRes.json();
        setLinks(linksData.links || []);
      }

      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setApiKeys(keysData.keys || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSyncScheduling(keyId: number) {
    setSyncingKeyId(keyId);
    try {
      const response = await fetch(`/api/mmfc-scheduling/sync/${keyId}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to sync scheduling');
        return;
      }

      alert(`Successfully synced ${data.linksCount} scheduling link(s)!`);
      fetchData();
    } catch (error) {
      console.error('Error syncing scheduling:', error);
      alert('Failed to sync scheduling');
    } finally {
      setSyncingKeyId(null);
    }
  }

  async function toggleLinkStatus(linkId: number, isEnabled: boolean) {
    try {
      const response = await fetch('/api/mmfc-scheduling', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, isEnabled })
      });

      if (!response.ok) {
        alert('Failed to update link status');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error updating link status:', error);
      alert('Failed to update link status');
    }
  }

  const enabledLinksCount = links.filter(link => link.isEnabled).length;

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="page-header-gradient mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Scheduling</h1>
              <p>Manage booking links synced from Make Money from Coding</p>
            </div>
          </div>
          <Link href="/book" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-brand-primary hover:bg-white/90 shadow-lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Booking Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Links</p>
                <p className="text-3xl font-bold text-gray-900">{links.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Enabled Links</p>
                <p className="text-3xl font-bold text-gray-900">{enabledLinksCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">API Keys</p>
                <p className="text-3xl font-bold text-gray-900">{apiKeys.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Section */}
      {apiKeys.length > 0 && (
        <Card className="dashboard-card border-0 mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">Sync Scheduling Links</CardTitle>
            <CardDescription>
              Pull the latest scheduling links from your Make Money from Coding account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{key.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {links.filter(l => l.apiKeyId === key.id).length} scheduling link(s) synced
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSyncScheduling(key.id)}
                    disabled={syncingKeyId === key.id}
                    size="sm"
                    className="bg-brand-primary hover:bg-brand-primary-hover"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${syncingKeyId === key.id ? 'animate-spin' : ''}`} />
                    {syncingKeyId === key.id ? 'Syncing...' : 'Sync Now'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No API Keys Message */}
      {apiKeys.length === 0 && (
        <Card className="dashboard-card border-0 mb-8">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No MMFC API Keys Found</h3>
            <p className="text-gray-600 mb-4">
              Add a Make Money from Coding API key to sync your scheduling links
            </p>
            <Link href="/dashboard/api-keys">
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Manage API Keys
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Scheduling Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduling Links</h2>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="dashboard-card border-0">
                <CardContent className="pt-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : links.length === 0 ? (
          <Card className="dashboard-card border-0">
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No scheduling links synced yet</p>
              <p className="text-sm text-gray-500">
                {apiKeys.length > 0
                  ? 'Click "Sync Now" above to import your scheduling links from MMFC'
                  : 'Add an API key in Integrations to get started'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Card key={link.id} className="dashboard-card border-0 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2">{link.title}</CardTitle>
                      {link.description && (
                        <CardDescription className="line-clamp-2 text-sm mt-2">
                          {link.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {/* Duration */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{link.durationMinutes} minutes</span>
                    </div>

                    {/* Booking URL */}
                    <div>
                      <a
                        href={link.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 break-all"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        {link.bookingUrl.replace('https://', '')}
                      </a>
                    </div>

                    {/* API Key Source */}
                    {link.apiKeyName && (
                      <div className="text-xs text-gray-500">
                        From: {link.apiKeyName}
                      </div>
                    )}
                  </div>

                  {/* Toggle Button - Sticky to bottom */}
                  <Button
                    size="sm"
                    variant={link.isEnabled ? 'default' : 'outline'}
                    onClick={() => toggleLinkStatus(link.id, !link.isEnabled)}
                    className={`w-full mt-4 ${link.isEnabled ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {link.isEnabled ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Disabled
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
