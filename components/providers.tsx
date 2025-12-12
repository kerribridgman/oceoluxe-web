'use client';

import { CartProvider } from '@/lib/cart';
import { CartDrawer } from '@/components/cart';
import { ConsentProvider } from '@/lib/cookies/consent';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { AnalyticsLoader } from '@/components/analytics-loader';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
      <AnalyticsLoader />
      <CookieConsentBanner />
    </ConsentProvider>
  );
}
