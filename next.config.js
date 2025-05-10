/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // experimental: {
  //   nodeMiddleware: true,
  // },
};

module.exports = nextConfig; 