'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BarChart3, Save, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function AnalyticsPage() {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleTagManagerId, setGoogleTagManagerId] = useState('');
  const [plausibleDomain, setPlausibleDomain] = useState('');
  const [plausibleApiKey, setPlausibleApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load existing analytics settings
  useEffect(() => {
    fetchAnalyticsSettings();
  }, []);

  async function fetchAnalyticsSettings() {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setGoogleAnalyticsId(data.googleAnalyticsId || '');
        setGoogleTagManagerId(data.googleTagManagerId || '');
        setPlausibleDomain(data.plausibleDomain || '');
        setPlausibleApiKey(data.plausibleApiKey || '');
      }
    } catch (err) {
      console.error('Failed to fetch analytics settings:', err);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/analytics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleAnalyticsId,
          googleTagManagerId,
          plausibleDomain,
          plausibleApiKey,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update analytics settings');
      }

      setSuccess('Analytics settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="flex-1">
      <div className="page-header-gradient mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p>Configure Google Analytics and Plausible tracking</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-error mb-6">
          <AlertCircle className="w-4 h-4 mr-2" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="alert-success mb-6">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Google Analytics */}
        <Card className="dashboard-card border-0">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.782 0-.782-.782-.782-.782s.146-.146 2.183-2.183c.218-.145.334-.382.334-.625 0-.782-.782-.782-.782-.782H7.462c-.43 0-.853-.208-1.112-.403C6.69 11.26 7.08 11.5 8 11.5h5.965c.867 0 2.034-.674 2.034-2.008 0-1.162-1.025-1.867-1.89-1.867H8.462c-.867 0-2.034.674-2.034 2.008 0 1.335 1.167 2.008 2.034 2.008h3.878c0 0 .782 0 .782.782 0 .243-.116.48-.334.625-2.037 2.037-2.183 2.183-2.183 2.183s0 .782.782.782c.243 0 .48-.117.625-.334l4.334-6.5c.218-.33.595-.565 1.002-.565.867 0 2.034.674 2.034 2.008 0 .668-.292 1.242-.718 1.626C19.92 13.74 19.5 14 19.077 14H13.11c-.87 0-2.035-.674-2.035-2.008 0-1.335 1.166-2.008 2.034-2.008h5.615c.867 0 2.034.674 2.034 2.008 0 1.162-1.025 1.867-1.89 1.867h-2.892c0 0-.782 0-.782.782 0 .243.116.48.334.625 2.037 2.037 2.183 2.183 2.183 2.183s0 .782-.782.782c-.243 0-.48-.117-.625-.334l-4.334-6.5c-.218-.33-.595-.565-1.002-.565z" fill="#E37400"/>
              </svg>
              Google Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label htmlFor="ga-id" className="text-sm font-medium text-gray-700">
                Google Analytics ID (GA4)
              </Label>
              <Input
                id="ga-id"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="mt-1 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Find this in your Google Analytics property settings
              </p>
            </div>

            <div>
              <Label htmlFor="gtm-id" className="text-sm font-medium text-gray-700">
                Google Tag Manager ID (Optional)
              </Label>
              <Input
                id="gtm-id"
                value={googleTagManagerId}
                onChange={(e) => setGoogleTagManagerId(e.target.value)}
                placeholder="GTM-XXXXXXX"
                className="mt-1 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                If you use GTM instead of direct GA4 tracking
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 font-medium"
              >
                Open Google Analytics
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Plausible Analytics */}
        <Card className="dashboard-card border-0">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              Plausible Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label htmlFor="plausible-domain" className="text-sm font-medium text-gray-700">
                Site Domain
              </Label>
              <Input
                id="plausible-domain"
                value={plausibleDomain}
                onChange={(e) => setPlausibleDomain(e.target.value)}
                placeholder="yourdomain.com"
                className="mt-1 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                The domain you registered in Plausible
              </p>
            </div>

            <div>
              <Label htmlFor="plausible-api" className="text-sm font-medium text-gray-700">
                API Key (Optional)
              </Label>
              <Input
                id="plausible-api"
                type="password"
                value={plausibleApiKey}
                onChange={(e) => setPlausibleApiKey(e.target.value)}
                placeholder="Enter API key for server-side access"
                className="mt-1 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required only if you need server-side API access
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <a
                href="https://plausible.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 font-medium"
              >
                Open Plausible Dashboard
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Instructions */}
      <Card className="dashboard-card border-0 mb-6">
        <CardHeader className="border-b border-gray-100 pb-3">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Implementation Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2">📝 Required Setup</h4>
              <p className="text-sm text-amber-800 mb-3">
                To enable analytics tracking on your site, you need to set environment variables:
              </p>
              <div className="bg-white/50 rounded border border-amber-300 p-3 mb-3">
                <code className="text-xs font-mono text-gray-800 block space-y-1">
                  <div>NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX</div>
                  <div>NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX</div>
                </code>
              </div>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>Add these to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file for local development</li>
                <li>Add them to your hosting platform (Vercel, etc.) for production</li>
                <li>After adding, restart your dev server or redeploy your site</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">How It Works</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>The database stores your tracking IDs for reference</li>
                <li>Environment variables are used to inject tracking scripts</li>
                <li>Analytics scripts are loaded client-side after page hydration</li>
                <li>This approach ensures static page generation works correctly</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`mt-0.5 ${googleAnalyticsId || googleTagManagerId ? 'text-green-600' : 'text-gray-400'}`}>
                  {googleAnalyticsId || googleTagManagerId ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Google Analytics</p>
                  <p className="text-xs text-gray-600">
                    {googleAnalyticsId || googleTagManagerId ? 'Configured and tracking' : 'Not configured'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`mt-0.5 ${plausibleDomain ? 'text-green-600' : 'text-gray-400'}`}>
                  {plausibleDomain ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Plausible Analytics</p>
                  <p className="text-xs text-gray-600">
                    {plausibleDomain ? 'Configured and tracking' : 'Not configured'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-200"
        >
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Analytics Settings
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
