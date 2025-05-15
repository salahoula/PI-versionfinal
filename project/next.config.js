/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  cache: { type: 'memory' },
  webpack: (config) => {
    config.cache = {
      type: 'memory'
    };
    return config;
  }
};

module.exports = nextConfig;