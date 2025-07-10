import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This will tell TypeScript to ignore all build errors during compilation
  typescript: {
    ignoreBuildErrors: true,
  },
  // This will tell ESLint to ignore all warnings during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Other options can go here
};

export default nextConfig;