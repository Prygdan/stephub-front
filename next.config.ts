import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      '127.0.0.1',
      'localhost',
      'stephub.store',
      'api.stephub.store',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stephub.store',
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
