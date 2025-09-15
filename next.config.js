/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // enable optimization and allow remote flags/images
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'appoostobio.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
  },
  async rewrites() {
    return [
      // Map /en/* or /ar/* to underlying non-prefixed routes
      { source: '/:locale(en|ar)', destination: '/' },
      { source: '/:locale(en|ar)/:path*', destination: '/:path*' },
    ];
  },
};

module.exports = nextConfig;