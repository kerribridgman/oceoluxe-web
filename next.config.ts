import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://images.unsplash.com https://prod-files-secure.s3.us-west-2.amazonaws.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://api.stripe.com https://vitals.vercel-insights.com",
              "frame-src https://js.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old blog post URLs → new blog post URLs
      {
        source: '/blog/posts/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      // Old blog listing URL
      {
        source: '/blog/posts',
        destination: '/blog',
        permanent: true,
      },
      // Old nested product delivery URLs → products page
      {
        source: '/products/product-delivery/:path*',
        destination: '/products',
        permanent: true,
      },
      // Old product library URLs → products page
      {
        source: '/products/product-library/:path*',
        destination: '/products',
        permanent: true,
      },
      // Redesign redirects
      {
        source: '/services',
        destination: '/work-with-oceo-luxe',
        permanent: true,
      },
      {
        source: '/apply/work-with-me',
        destination: '/apply',
        permanent: true,
      },
    ];
  },
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'avkad1oqqd4cmpta.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
