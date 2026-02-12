import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
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
