import type { NextConfig } from 'next';

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const OSS_BASE_URL = process.env.NEXT_PUBLIC_OSS_BASE_URL ?? '';

const nextConfig: NextConfig = {
  // Output standalone build for production deployment
  output: 'standalone',

  images: {
    remotePatterns: [
      // Strapi local uploads (dev)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Aliyun OSS CDN (production)
      ...(OSS_BASE_URL
        ? [
            {
              protocol: 'https' as const,
              hostname: new URL(OSS_BASE_URL).hostname,
              pathname: '/**',
            },
          ]
        : []),
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
  },

  // Experimental: React compiler (Next.js 15+)
  experimental: {
    reactCompiler: false,
  },

  // Rewrites: proxy /uploads to Strapi in dev
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/uploads/:path*',
          destination: `${STRAPI_URL}/uploads/:path*`,
        },
      ];
    }
    return [];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
