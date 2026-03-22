import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,   // cache dynamic pages for 30s on client
      static: 180,   // cache static pages for 3min on client
    },
  },
};

export default nextConfig;
