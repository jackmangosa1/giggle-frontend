/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["servicemanagementapp.blob.core.windows.net"],
  },
};

module.exports = nextConfig;
