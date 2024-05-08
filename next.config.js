/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
