'use client';

import { useConsent } from '@/lib/cookies/consent';
import { X, Cookie, Settings } from 'lucide-react';
import { useState } from 'react';

export function CookieConsentBanner() {
  const {
    showBanner,
    acceptAll,
    rejectAll,
    updateConsent,
    preferencesOpen,
    openPreferences,
    closePreferences,
    consent
  } = useConsent();

  const [analyticsEnabled, setAnalyticsEnabled] = useState(consent?.analytics ?? true);
  const [marketingEnabled, setMarketingEnabled] = useState(consent?.marketing ?? true);

  if (!showBanner && !preferencesOpen) return null;

  const handleSavePreferences = () => {
    updateConsent({ analytics: analyticsEnabled, marketing: marketingEnabled });
  };

  // Preferences Modal
  if (preferencesOpen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3B3937] to-[#5a5654] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[#CDA7B2]" />
              <h2 className="text-lg font-medium text-white">Cookie Preferences</h2>
            </div>
            <button
              onClick={closePreferences}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-[#5a5654] text-sm leading-relaxed">
              We use cookies to enhance your experience. Choose which cookies you allow us to use.
            </p>

            {/* Essential Cookies - Always On */}
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-[#3B3937]">Essential Cookies</h3>
                <span className="text-xs bg-[#967F71]/10 text-[#967F71] px-2 py-1 rounded-full">
                  Always Active
                </span>
              </div>
              <p className="text-sm text-[#5a5654]">
                Required for the website to function. These cannot be disabled.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-[#3B3937]">Analytics Cookies</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CDA7B2]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CDA7B2]"></div>
                </label>
              </div>
              <p className="text-sm text-[#5a5654]">
                Help us understand how visitors interact with our website to improve user experience.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-[#3B3937]">Marketing Cookies</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingEnabled}
                    onChange={(e) => setMarketingEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CDA7B2]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CDA7B2]"></div>
                </label>
              </div>
              <p className="text-sm text-[#5a5654]">
                Used to deliver personalized advertisements and track campaign performance.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm font-medium text-[#5a5654] hover:text-[#3B3937] transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2 text-sm font-medium bg-[#CDA7B2] text-white rounded-lg hover:bg-[#b8939d] transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Banner
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 md:flex md:items-center md:gap-6">
          {/* Icon and Text */}
          <div className="flex-1 mb-4 md:mb-0">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#CDA7B2]/10 rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-[#CDA7B2]" />
              </div>
              <div>
                <h3 className="font-medium text-[#3B3937] mb-1">We value your privacy</h3>
                <p className="text-sm text-[#5a5654] leading-relaxed">
                  We use cookies to enhance your browsing experience and analyze our traffic.
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <a href="/privacy" className="text-[#CDA7B2] hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={openPreferences}
              className="px-4 py-2.5 text-sm font-medium text-[#5a5654] hover:text-[#3B3937] border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              Manage Preferences
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2.5 text-sm font-medium text-[#5a5654] hover:text-[#3B3937] border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2.5 text-sm font-medium bg-[#CDA7B2] text-white rounded-lg hover:bg-[#b8939d] transition-colors shadow-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
