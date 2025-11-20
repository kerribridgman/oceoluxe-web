'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Plus, RefreshCw, Eye, EyeOff, ExternalLink, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';

interface MmfcApiKey {
  id: number;
  name: string;
}

interface MmfcService {
  id: number;
  externalId: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  salePrice: string | null;
  featuredImageUrl: string | null;
  coverImage: string | null;
  isVisible: boolean;
  syncedAt: string;
  apiKeyName?: string;
}

export default function MmfcServicesPage() {
  const [apiKeys, setApiKeys] = useState<MmfcApiKey[]>([]);
  const [services, setServices] = useState<MmfcService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncingKeyId, setSyncingKeyId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [keysRes, servicesRes] = await Promise.all([
        fetch('/api/mmfc-keys'),
        fetch('/api/mmfc-services')
      ]);

      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setApiKeys(keysData.keys || []);
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.services || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSyncServices(keyId: number) {
    setSyncingKeyId(keyId);
    try {
      const response = await fetch(`/api/mmfc-services/sync/${keyId}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to sync services');
        return;
      }

      alert(`Successfully synced ${data.servicesCount} service(s)!`);
      fetchData();
    } catch (error) {
      console.error('Error syncing services:', error);
      alert('Failed to sync services');
    } finally {
      setSyncingKeyId(null);
    }
  }

  async function toggleVisibility(serviceId: number, isVisible: boolean) {
    try {
      const response = await fetch('/api/mmfc-services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, isVisible })
      });

      if (!response.ok) {
        alert('Failed to update visibility');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Failed to update visibility');
    }
  }

  const visibleServicesCount = services.filter(s => s.isVisible).length;

  return (
    <section className="flex-1">
      {/* Page Header */}
      <div className="page-header-gradient mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">MMFC Services</h1>
              <p>Manage services synced from Make Money from Coding</p>
            </div>
          </div>
          <Button
            asChild
            className="bg-white text-brand-primary hover:bg-white/90 shadow-lg"
          >
            <a href="/dashboard/api-keys">
              <Plus className="w-4 h-4 mr-2" />
              Manage API Keys
            </a>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Services</p>
                <p className="text-3xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Visible Services</p>
                <p className="text-3xl font-bold text-gray-900">{visibleServicesCount}</p>
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

      {/* API Keys Sync Section */}
      {apiKeys.length === 0 ? (
        <Card className="dashboard-card border-0 mb-8">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No MMFC API Keys Found</h3>
            <p className="text-gray-600 mb-4">
              Add a Make Money from Coding API key to sync your services
            </p>
            <Link href="/dashboard/api-keys">
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Manage API Keys
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="dashboard-card border-0 mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">Sync Services</CardTitle>
            <CardDescription>
              Pull the latest services from your Make Money from Coding account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{key.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {services.filter(s => s.apiKeyName === key.name).length} service(s) synced
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSyncServices(key.id)}
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

      {/* Services Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Synced Services</h2>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="dashboard-card border-0">
                <CardContent className="pt-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-48 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : services.length === 0 ? (
          <Card className="dashboard-card border-0">
            <CardContent className="py-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No services synced yet</p>
              <p className="text-sm text-gray-500">
                {apiKeys.length > 0
                  ? 'Click "Sync Now" above to import your services from MMFC'
                  : 'Add an API key to get started'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="dashboard-card border-0 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="pb-3">
                  {(service.coverImage || service.featuredImageUrl) && (
                    <div className="mb-4 -mt-6 -mx-6">
                      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                        <img
                          src={service.coverImage || service.featuredImageUrl || ''}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                  {service.description && (
                    <CardDescription className="line-clamp-2 text-sm mt-2">
                      {service.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      {service.salePrice ? (
                        <>
                          <span className="text-2xl font-bold text-brand-primary">
                            ${service.salePrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${service.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">
                          ${service.price}
                        </span>
                      )}
                      {service.pricingType === 'hourly' && (
                        <span className="text-sm text-gray-600">/hr</span>
                      )}
                    </div>

                    {/* API Key Source */}
                    {service.apiKeyName && (
                      <div className="text-xs text-gray-500">
                        From: {service.apiKeyName}
                      </div>
                    )}
                  </div>

                  {/* Visibility Toggle */}
                  <Button
                    size="sm"
                    variant={service.isVisible ? 'default' : 'outline'}
                    onClick={() => toggleVisibility(service.id, !service.isVisible)}
                    className={`w-full mt-4 ${service.isVisible ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {service.isVisible ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Hidden
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
