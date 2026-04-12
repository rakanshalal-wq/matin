import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['matin.ink', 'app.matin.ink', 'localhost:3000'],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'matin.ink' },
      { protocol: 'https', hostname: 'app.matin.ink' },
    ],
  },
};

export default nextConfig;
