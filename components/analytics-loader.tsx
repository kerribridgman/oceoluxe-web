'use client';

import Script from 'next/script';
import { useConsent } from '@/lib/cookies/consent';

/**
 * Client-side component that loads analytics scripts only after user consent
 * This ensures CCPA/GDPR compliance by not loading tracking until approved
 */
export function AnalyticsLoader() {
  const { consent, status } = useConsent();

  // Use environment variables if available (for production)
  const envGaId = process.env.NEXT_PUBLIC_GA_ID;
  const envGtmId = process.env.NEXT_PUBLIC_GTM_ID;

  // Don't load analytics until user has given consent
  if (status === 'pending' || !consent?.analytics) {
    return null;
  }

  // Only load if consent given and env vars are set
  if (envGaId || envGtmId) {
    return (
      <>
        {envGaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${envGaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${envGaId}');
              `}
            </Script>
          </>
        )}
        {envGtmId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${envGtmId}');
            `}
          </Script>
        )}
      </>
    );
  }

  // If no env vars, component does nothing (analytics disabled)
  return null;
}
