import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['matin.ink', 'app.matin.ink', 'localhost:3000'],
    },
  },
  images: {
    domains: ['matin.ink', 'app.matin.ink'],
  },
};

export default nextConfig;
