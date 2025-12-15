'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
}

interface ConsentContextValue {
  consent: CookieConsent | null;
  status: ConsentStatus;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (consent: Partial<CookieConsent>) => void;
  showBanner: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  preferencesOpen: boolean;
}

const CONSENT_KEY = 'cookie-consent';

const ConsentContext = createContext<ConsentContextValue | null>(null);

function getStoredConsent(): { consent: CookieConsent; status: ConsentStatus } | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Invalid stored value
  }
  return null;
}

function storeConsent(consent: CookieConsent, status: ConsentStatus) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(CONSENT_KEY, JSON.stringify({ consent, status }));
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [showBanner, setShowBanner] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Load stored consent on mount
  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored.consent);
      setStatus(stored.status);
      setShowBanner(false);
    } else {
      // No stored consent, show banner after a brief delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const newConsent: CookieConsent = { analytics: true, marketing: true };
    setConsent(newConsent);
    setStatus('accepted');
    storeConsent(newConsent, 'accepted');
    setShowBanner(false);
    setPreferencesOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    const newConsent: CookieConsent = { analytics: false, marketing: false };
    setConsent(newConsent);
    setStatus('rejected');
    storeConsent(newConsent, 'rejected');
    setShowBanner(false);
    setPreferencesOpen(false);
  }, []);

  const updateConsent = useCallback((partial: Partial<CookieConsent>) => {
    const newConsent: CookieConsent = {
      analytics: partial.analytics ?? consent?.analytics ?? false,
      marketing: partial.marketing ?? consent?.marketing ?? false,
    };
    const newStatus: ConsentStatus = newConsent.analytics || newConsent.marketing ? 'accepted' : 'rejected';
    setConsent(newConsent);
    setStatus(newStatus);
    storeConsent(newConsent, newStatus);
    setShowBanner(false);
    setPreferencesOpen(false);
  }, [consent]);

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setPreferencesOpen(false);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        status,
        acceptAll,
        rejectAll,
        updateConsent,
        showBanner,
        openPreferences,
        closePreferences,
        preferencesOpen,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
