/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: { allowedOrigins: ['matin.ink', 'app.matin.ink', 'localhost:3000'] }
  },
  images: { domains: ['matin.ink', 'app.matin.ink'] }
};
module.exports = nextConfig;
