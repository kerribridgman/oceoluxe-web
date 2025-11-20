'use client';

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * Client-side component that loads analytics settings and injects tracking scripts
 * This runs after the page is hydrated to avoid breaking static generation
 */
export function AnalyticsLoader() {
  // Use environment variables if available (for production)
  const envGaId = process.env.NEXT_PUBLIC_GA_ID;
  const envGtmId = process.env.NEXT_PUBLIC_GTM_ID;

  // If env vars are set, use them immediately (no need for API call)
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
  // In the future, you could fetch from API here if needed
  return null;
}
