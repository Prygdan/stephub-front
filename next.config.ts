import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      '127.0.0.1',
      'localhost',
      'zmy.com',
      'api.zmy.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zmy.com',
        port: '443',
        pathname: '/storage/**',
      },
    ],
  },
  experimental: {
    esmExternals: true,
    optimizeCss: true,
  },
  eslint: { ignoreDuringBuilds: true }
};

export default nextConfig;
