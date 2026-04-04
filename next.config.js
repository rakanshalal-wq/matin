/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: { allowedOrigins: ['matin.ink', 'app.matin.ink', 'localhost:3000'] }
  },
  images: { domains: ['matin.ink', 'app.matin.ink'] }
};
module.exports = nextConfig;
