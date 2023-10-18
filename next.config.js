/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
